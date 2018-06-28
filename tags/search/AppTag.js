import BaseTag        from '/tags/_common/BaseTag.js';
import CoreVideoTag   from '/tags/_common/CoreVideoTag.js';
import ResultsTag     from './ResultsTag.js';
import SuggestionsTag from './SuggestionsTag.js';
import KeysTag        from './KeysTag.js';
import AzTag          from './keys/AzTag.js';
import NumbersTag     from './keys/NumbersTag.js';
import FloatTag       from './keys/FloatTag.js';
import KeyPrediction  from './lib/KeyPrediction.js';
import KeyTracking    from './lib/KeyTracking.js';
import CacheData      from '/tags/search/data/cached-responses.js';

document.title = 'Search';


X.variants({

	sAzStartKey: 'n',
	sQueryGhostText: 'TV shows, movies, categories, and people',
	sPredictKeys: '5',
	sNetworkLagMs: '500',

	fSounds: false,
	fAzPredict: true,
	fAzPredict3: false,
	fAzPredict2	: false,
	fAzUpperCase: false,
	fAzFixedFocus: false,
	fAzFixedFocusNumbers: false,
	fAzFixedFocusBig: false,
	fAzStacked: false,
	fAzChunkZebra: false,
	fAzChunkSpace: false,
	fAzChunkSpaceNoButton: false,
	fAzNoGaps: false,
	fAzNumberExpand: true,
	fAzPredictGray: false,
	fAzPredictRed: true,
	fAzPredictRedBig: false,
	fAzAlignFocus: false,

	fQueryCenter: false,
	fQuerySimpleX: true,

	sInputThrottleMs: '40',

	fResultsCache: false,
});

let MAX_RESULTS = 30;

let TITLE_CONFIG = {"titleIds":[],"title":{"short":true},"artwork":[{"name":"SDP","type":"sdp","height":131},{"name":"SDPLARGE","type":"sdp","height":720},{"name":"STORY_ART","type":"StoryArt","height":720},{"name":"TITLE_TREATMENT","type":"TITLE_TREATMENT","height":400},{"name":"TITLE_TREATMENT_CROPPED","type":"TITLE_TREATMENT_CROPPED","height":400},{"name":"LOGO_STACKED_CROPPED","type":"LOGO_STACKED_CROPPED","height":720},{"name":"LOGO_HORIZONTAL_CROPPED","type":"LOGO_HORIZONTAL_CROPPED","height":720},{"name":"BOXSHOT","type":"boxshot","height":200},{"name":"BB2_OG_LOGO_PLUS","type":"BB2_OG_LOGO_PLUS","height":720},{"name":"BB2_OG_LOGO_PLUS_CROPPED","type":"BB2_OG_LOGO_PLUS_CROPPED","height":720},{"name":"TALL_PANEL","type":"TALL_PANEL","height":720},{"name":"SHORT_PANEL","type":"SHORT_PANEL","height":720}],"genres":3,"moods":3,"isOriginal":true,"seasons":true,"cid":"504586155175348453"};

let ENDPOINT_URL = 'https://www.stage.netflix.com';





// Seed prediction data

KeyPrediction.analyze(DATA.videos);



// Tracking

let trackingVariant = '';
if (X.flag('fAzStacked')) {
	trackingVariant = 'stacked';
}
else if (X.flag('fAzChunkZebra') || X.flag('fAzChunkSpace')) {
	trackingVariant = 'chunked';
}
else if (X.flag('fAzPredict')) {
	trackingVariant = 'predict';
}
else {
	trackingVariant = 'other';
}

KeyTracking.init(trackingVariant, X.string('sAzStartKey'));




// Sound Player
let sounds = {
	move: X.sound('/tags/search/sounds/tick.mp3', 3),
	click: X.sound('/tags/search/sounds/click.mp3', 2),
};
window.playSound = function(soundId){
	if (X.flag('fSounds')) {
		sounds[soundId].play();
	}
};


// AJAX fallback

if (X.param('fResultsCache')) {

	$.originalAjaxFunction = $.ajax;

	$.ajax = function(opts) {

	  const cachedResponse = CacheData[opts.url];
	  if (cachedResponse) {
	    setTimeout(() => {
	      opts.success(cachedResponse);
	    }, 300)
	  } else {
	    console.log('not cached', opts.url);
	    $.originalAjaxFunction(opts)
	  }
	};
}


export default class AppTag extends BaseTag {

	onMount() {
    	this.hasInput('true');

    	this.query = '';
    	this.updateQuery('');

    	jtag('.az-keys').hasInput(true);

    	jtag('.az-keys').updateSlide();

    	this.mode('keys');
    }

    predict() {
    	
    	if (!X.flag('fAzPredict')) { return; }

    	$('.key').removeClass('hi');

    	let predictedKeys = KeyPrediction.predictForQuery(this.query);

    	predictedKeys.forEach((c)=>{
	    	$('.key-' + c.toUpperCase()).addClass('hi');
	    });
    }

    updateQuery(char) {
    	
    	if (char == '_') {
    		char = ' ';
    		KeyTracking.onClickKey(char);
    	}
    	else if (char == '<') {
    		this.query = this.query.slice(0, this.query.length - 1);
    		char = '';
    		KeyTracking.onDelete();
    	}
    	else if (char == '*') {
    		this.query = '';
    		char = '';
    		playSound('click');
    		KeyTracking.onClear();
    	}
    	else {
    		KeyTracking.onClickKey(char);
    	}

    	this.query += char;

    	let q = this.query;
    	if (!this.query.match(/\S/)) {
    		q = '&nbsp;';
    	}
    	if (this.query[this.query.length - 1] == ' ') {
    		q += '<span class="query-cursor"></span>';
    	}
    	this.$('.query-text').html(q);

    	if (!X.flag('fResultsSlideChevron')) {
    		this.$('.query-banner-text').html(X.icon('search') + q);
    	}

    	$('.query-ghost-text').toggle(!this.query);
    	
    	this.predict();

    	this.fetch();
    }

    onNav(dir) {
    	if (this.isMode('box')) {
    		if (dir == 'SELECT') {
    			this.updateQuery('*');
    		}
    		else if (dir == 'D') {
    			this.mode('keys');
    			this.hasInput(false);
    			jtag('.float-keys').hasInput(true);
    		}	
    	}
    }

    onBoxFocus() {
    	this.mode('box');
    	this.hasInput(true);
    }

    setQuery(q) {
    	this.query = q;
    	this.skipSuggestions = true;
    	this.updateQuery('');
    	jtag('.results-boxes').resetSlider();
    }

    fetch() {

    	this.xhr && this.xhr.abort();

    	if (!this.query) {
    		$('.results-boxes-slider').empty();
    		$('.results-suggestions').empty();
    		return;
    	}

    	this.lagTimer && this.lagTimer.clear();

    	$('.results').transition({ opacity: 0.3 }, 150);

    	this.fetchTime = Date.now();

    	let payload = { 
    		query: this.query.toLowerCase(),
    		maxResults: MAX_RESULTS,
    		type: 'titles',
    	};
    	let json = encodeURIComponent(JSON.stringify(payload));
    	let url = ENDPOINT_URL + '/api/xd/jlesko/search?revision=latest&options=' + json;
    	console.log('query:', payload.query);
    	this.xhr = $.ajax({
    		url: url,
    		success: (data)=>{
    			data = JSON.parse(data);
    			let ids = [];
    			data.forEach((t)=>{
    				ids.push(t.id);
    			});
    			console.log('  Titles matched:', ids.length);

    			this.lagTimer = X.wait(X.num('sNetworkLagMs'), ()=>{
    				this.remoteTitles(ids);
    			});
    			
    		}
    	});
    }

    remoteTitles(ids) {
    	TITLE_CONFIG.titleIds = ids;
    	let json = encodeURIComponent(JSON.stringify(TITLE_CONFIG));
    	let url = ENDPOINT_URL + '/api/xd/titles?revision=latest&options=' + json;
    	this.xhr = $.ajax({
    		url: url,
    		success: (data)=>{
    			this.results = { ids: ids, titles: JSON.parse(data) };
    			this.remoteSuggestions();
    		}
    	});
    }

    remoteSuggestions() {
    	let payload = { 
    		query: this.query.toLowerCase(),
    		maxResults: 10,
    		type: 'suggestions',
    	};
    	let json = encodeURIComponent(JSON.stringify(payload));
    	let url = ENDPOINT_URL + '/api/xd/jlesko/search?revision=latest&options=' + json;
    	this.xhr = $.ajax({
    		url: url,
    		success: (data)=>{
    			console.log('  Got data in:', (Date.now() - this.fetchTime) + 'ms');

    			data = JSON.parse(data);

    			let suggests = [];
    			data.forEach((t)=>{
    				suggests.push(t.title);
    			});

    			this.results.suggestions = suggests;
    			this.updateResults();
    		}
    	});
    }

    updateResults() {

    	$('.results').css({ opacity: 1 });
    	$('.results-boxes-slider').empty();
    	

    	if (X.flag('fResultsSuggestions')) {
    		this.results.ids = this.results.ids.slice(0, 9);
    	}
    	
    	X.wait(X.flag('fResultsSuggestions') ? 150 : 1, ()=>{
    		jtag('.results-boxes').update(this.results);
    	});
    	
    	if (!this.skipSuggestions) {
    		$('.results-suggestions').empty();
     		jtag('.results-suggestions').update(this.results);
     	}
     	this.skipSuggestions = false;
    }

    animateToResults() {
    	if (!X.flag('fResultsSlide')) { return; }

    	$('.row-top, .results').transition({ y: X.flag('fResultsSuggestionsHorizontal') ? '-9rem' : '-7.88rem' }, 500);
    	$('.query-banner').transition({ opacity: 1 }, 500);
    }

    animateFromResults() {
    	if (!X.flag('fResultsSlide')) { return; }

    	$('.row-top, .results').transition({ y: '0rem' }, 500);
    	$('.query-banner').transition({ opacity: 0 }, 100);
    }

	html() {

		let $html = jml`

			<"search layer">

				<"query-banner abs z3">
					<"query-banner-text">${ X.icon('chevronU') }</>
				</>

				<"row-top">
					<"query">
						<"query-box">
							<"query-text"></>
							<"query-button">${ X.icon('close') }</>
							<"query-ghost-text">${ X.string('sQueryGhostText') }</>
						</>
					</>

					<"float-keys-row"></>
					<"alpha-row az-keys-row"></>
					<"alpha-row nz-keys-row"></>

					<"alpha-row num-keys-row"></>
				</>

				<"results">
				</>
			</>
		`;

		new AzTag ($html.find('.az-keys-row'), { isNz: false });
		if (X.flag('fAzStacked')) {
			new AzTag ($html.find('.nz-keys-row'), { isNz: true });
		}
		
		new FloatTag ($html.find('.float-keys-row'));
		if (X.flag('fAzNumberExpand')) {
			new NumbersTag ($html.find('.num-keys-row'));
		}

		new SuggestionsTag ($html.find('.results'));
		new ResultsTag ($html.find('.results'));
		
		return $html;
	}
}



X.css(`

	.search {
		text-align: center;
	}

	.query-cursor {
		border-right: solid 0.1rem #666;
	    margin: 0 0.5rem;
	    height: 1.5rem;
	    top: 0.1rem;
	    position: relative;
	    display: inline-block;
	}

	.query-box {
		margin-top: 2rem;
		padding: 0.2rem 1rem;
		font-size: 1.8rem;
		border-radius: 0.2rem;
		border: solid 0.05rem #333;
		width: 26rem;
		display: inline-block;
		text-transform: lowercase;
		font-family: netflixSansBlack;
		font-weight: normal;
		text-align: left;
		white-space: nowrap;
		margin-bottom: 0.5rem;
		position: relative;
		overflow: hidden;
	}

	.fQueryCenter .query-box {
		text-align: center;
	}

	.query-text {
		display: inline-block;
		white-space: nowrap;
	}

	.query-button {
		height: 2.5rem;
		padding: 0 0.4rem;
		font-size: 1.8rem;
		background-color: #333;
		position: absolute;
		right: 0;
		top: 0;

		.icon {
			top: 0.35rem;
		}
	}

	.fQuerySimpleX .query-button {
		background-color: transparent;
		color: #444;
	}

	.mode-box .query-button {
		background-color: #fff;
		color: #333;
	}

	.query-ghost-text {
		font-size: 1rem;
		color: #333;
		position: absolute;
		top: 0.7rem;
		left: 1rem;
		font-family: NetflixSans;
		text-transform: none;
	}

	.fResultsFakeRows .results .box:nth-child(3n) {
		margin-bottom: 1.5rem;
	}

	.search-icon {
		width: 1.5em;
		margin: 0.45em 0;
		position: relative;
	}

	.query-banner {
		top: 0;
		left: 0;
		width: 100%;
		padding: 0.4rem 0 0.3rem;
		background-color: rgba(0,0,0,0.8);
		opacity: 0;
	}

	.query-banner-text {
		font-family: netflixSansBlack;
		position: relative;
		left: 3rem;
		text-align: left;
		text-transform: lowercase;
		color: #fff;
	}

	.query-banner-text .icon {
		font-size: 80%;
		color: #888;
		display: inline-block;
		margin-right: 0.5rem;
	}

	.fResultsSlideChevron .query-banner-text {
		text-align: center;
		position: relative;
		left: 0;
		width: 100%;
		font-size: 1.3rem;
		top: 0.2rem
	}

	.fResultsBannerUnderline .query-banner {
		border-bottom: solid 0.05rem #333;
	}

`);






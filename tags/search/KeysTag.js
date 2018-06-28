import BaseTag from '/tags/_common/BaseTag.js';
import KeyTracking from './lib/KeyTracking.js';

export default class KeysTag extends BaseTag {

	onMount() {
		this.updateFocus('.key');
	}

	getNav() {
        return {
            ids: this.getKeys(),
            loop: 'both'
        };    
    }

    onNav(dir) {
    	if (dir == 'D') {
    		this.hasInput(false);
    		jtag('.search').hasInput(true);
    	}
    }

    onKeyNav(dir) {
    	if (dir == 'SELECT') {

    		if (this.focus.id == '#') {
    			this.$('.key.focus').text(jtag('.az-keys').isMode('num') ? '#' : 'ABC');
    			jtag('.az-keys').toggleNumbers();
    		} else {
    			jtag('.search').updateQuery(this.focus.id);
    			playSound('click');
    		}

    	} else {

    		let exit = this.handleLR(dir);
    		this.updateFocus('.key');
    		
    		playSound('move');

    		KeyTracking.onMove('key');

    		return exit;
    	}
    }

    keyHtml(id) {

		let $html = jml`
			<"${id}-keys keys"></>
		`;

		this.getKeys().forEach((e,i)=>{
			let glyph = e;
			let cls = e;

			if (e === '_') { 
				glyph = X.flag('fFloatIcons') ? '<img class="search-icon" src="/assets/images/search/space.png">' : 'Space';
				cls = 'space';
			}
			else if (e === '<') { 
				glyph = X.flag('fFloatIcons') ? '<img class="search-icon" src="/assets/images/search/backspace.png">' : 'Delete';
				cls = 'delete';
			}
			else if (e === '*') { 
				glyph = X.flag('fFloatIcons') ? X.icon('close') : 'Clear';
				cls = 'clear';
			}

			if (e == '#') {
				glyph = '123';
				cls = 'num';
			}
			if (e == '#' && this.isNumMode) {
				glyph = 'abc';
			}

			let $key = $('<div class="key">').addClass('key-' + cls).html(glyph);
			if (e == '#') {
				$key.toggleClass('abc', glyph == 'abc');
			} 

			$html.append($key);
		});
		
		return $html;
    }
}

X.css(`


	.alpha-row {
		font-size: 0.9rem;
		display: inline-block;
		white-space: nowrap;
		margin-top: 0.5rem;
	}

	.fAzStacked .alpha-row.nz-keys-row {
		margin-top: 0.2rem;
	}

	.keys.has-input .key {
		&.focus {
			font-family: netflixSansBlack;
			background-color: #fff !important;
			color: #222 !important;
			transform: scale(1.2);
			font-weight: bold;
			z-index: 2
		}
	}

	.float-keys.has-input .key.focus img {
		-webkit-filter: invert(100%);
	}


	.key.hi {
		border-bottom: solid 0.05rem #666;
		color: #fff;
		height: 1.6em;
	}

	.fAzPredictGray .key {
		font-weight: normal;
		background-color: #1f1f1f;
		color: #888;
	}
	.fAzPredictGray .key.hi {
		border: 0;
		color: #fff;
		font-weight: bold;
	}

	.fAzPredictRedBig .key.hi {
		background-color: #7b2d2d;
		color: #fff;
		border: 0;
	}

	.fAzPredictRed .key.hi {
		border-bottom: solid 0.05rem #df0714;
	}

	.fAzUpperCase .key {
		text-transform: uppercase;
		line-height: 1.5em;
	}

	.key {
		height: 1.5em;
		width: 1.5em;
		background-color: #333;
		border-radius: 0.1em;
		color: #fff;
		text-transform: lowercase;
		display: inline-block;
		margin: 0 0.05em;
		text-align: center;
		font-size: 100%;
		line-height: 1.4em;
		font-weight: bold;
	}

	.abc {
		width: 3em;
	}

	.key-num {
		font-size: 80%;
		width: 2.5em;
		height: 1.9em;
		line-height: 1.9em;
		vertical-align: middle;
		top: -0.05em;
	}

	.fAzNoGaps .alpha-row .key {
		margin: 0;
		border-radius: 0;
		&.focus {
			border-radius: 0.1em;
		}
	}

	.fAzChunkZebra .alpha-row .key {
		background-color: #3c3c3c;
	}

	.fAzChunkZebra .alpha-row .key:nth-child(6n+1) {
		background-color: #1f1f1f;
	}
	.fAzChunkZebra .alpha-row .key:nth-child(6n+2) {
		background-color: #1f1f1f;
	}
	.fAzChunkZebra .alpha-row .key:nth-child(6n+3) {
		background-color: #1f1f1f;
	}

	.fAzFixedFocus .az-keys-row {
		position: relative;
		left: 21.2em;
	}

	.fAzFixedFocus .az-keys.mode-num {
		position: relative;
		left: -10em;
	}

	.fAzFixedFocusBig .keys.has-input.az-keys .key.focus {
		transform: scale(1.6);
		margin: 0 0.5rem;
	}

	.fFloatButtonClear .query-button {
		display: none;
	}

	.fAzStacked .key:nth-child(14) {
		margin-left: 1.9rem;
	}

	.fAzStacked .key {
		margin-left: 0.1rem; 
		margin-right: 0.1rem;
	}

	.fAzStacked .float-keys .key {
		width: 3rem;
	}

	.fAzFixedFocusNumbers .key:nth-child(27){
		margin-left: 1em;
	}

	.fAzChunkSpace .az-keys .key:nth-child(3n+1) {
		margin-left: 0.15rem;
	}

	.fAzChunkSpaceNoButton .alpha-row .key {
		background: none;
		width: 1.2em;
	}
	.fAzChunkSpaceNoButton .alpha-row .key:nth-child(3n+1) {
		margin-left: 0.75rem;
	}




`);

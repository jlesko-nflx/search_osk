import BaseTag from '/tags/_common/BaseTag.js';

X.variants({
	fResultsBoxLabels: false,
	fResultsFakeRows: false,
	fResultsSuggestionsHorizontal: false,
	fResultsSlide: true,
	fResultsSlideChevron: false,
	fResultsBannerUnderline: true,
});

export default class ResultsTag extends BaseTag {

	takeFocus(focusNum) {
		this.hasInput(true);
		if (focusNum >= 0) {  this.setFocusNum(focusNum);  }
		this.updateFocus('.box');
		this.updateFocusRing();
		jtag('.search').animateToResults();
	}

	resetSlider() {
		this.rowNum = 0;
    	this.slide($('.results-boxes-slider'), '.box', 'y', 0, 0);
	}

	onMount() {
		this.rowNum = 0;
		this.results = { ids: [] };
	}

	update(results) {

		this.results = results;

		results.ids.forEach((id)=>{

			let title = results.titles[id];

			let $box = $('<div class="box">');
			$box.append($('<img src="' + title.artwork.SDPLARGE.url + '">'));

			if (X.flag('fResultsBoxLabels')) {
				$box.append($('<div class="info">').text(title.title.short));
			}

			$('.results-boxes-slider').append($box);
		});

		this.animateBoxes();
	}

	hasResults() {
		return !! $('.results-boxes .box').length;
	}

    animateBoxes() {
    	$('.box').each((i,box)=>{
    		let delaySlot = i; // Math.floor(i / 4);
    		let delayInc = 30;
    		$(box).css({ opacity: 0, x: '0rem' }).transition({ opacity: 1, x: 0, delay: delaySlot * delayInc }, 300);
    	});

    	console.log('box', this.$('.box')[0]);
    	X.sizeFocusRing(this.$('.focus-ring'), this.$('.box')[0]);
    }

    updateFocusRing() {
    	let marg = X.flag('fResultsSuggestionsHorizontal') ? 4 : 2.25;
    	this.$('.focus-ring').css({ left: marg + (10.5 * this.focus.num) + 'rem' });
    }

    onNav(dir) {
    	let exit = this.handleLR(dir);
    	// this.updateFocus('.box');

    	if (!X.flag('fResultsSuggestionsHorizontal')) {
    		if (exit == -1) {
	    		this.hasInput(false);
	    		jtag('.results-suggestions').takeFocus();
	    	}
    	}

    	
    	this.updateFocusRing();

    	let boxesPerRow = X.flag('fResultsSuggestionsHorizontal') ? 4 : 3;
    	let numRows = Math.ceil(this.results.suggestions.length / boxesPerRow);

    	if (dir == 'D') {
    		if (this.rowNum < numRows) {
    			this.rowNum += 1;
    			console.log(this.rowNum);
    			this.slide($('.results-boxes-slider'), '.box', 'y', 300, this.rowNum * boxesPerRow);
    		}
    	}
    	else if (dir == 'U') {
    		if (this.rowNum == 0) {
    			if (X.flag('fResultsSuggestionsHorizontal')) {
    				this.hasInput(false);
    				jtag('.search').animateFromResults();
    				jtag('.results-suggestions').takeFocus();
    			} else {
    				this.hasInput(false);
    				jtag('.az-keys').takeFocus(-1);
    				jtag('.search').animateFromResults();
    			}
    			
    		} else {
    			this.rowNum -= 1;
    			this.slide($('.results-boxes-slider'), '.box', 'y', 300, this.rowNum * boxesPerRow);
    		}
    	}
    }

	getNav() {
		return {
            ids: X.flag('fResultsSuggestionsHorizontal') ? 4 : 3,
            loop: 'none'
        };  
	}

	html() {

		return jml`

			<"results-boxes">
				<"focus-ring abs z2"></>
				<"results-boxes-slider layer z1"></>
			</>

		`;
	}
}


X.css(`


    .results {
        margin-top: 1rem;
    }
    .results-boxes .box {
        width: 10rem;
        height: 5.62rem;
        margin: 0 0.5rem 0.5rem 0;
        display: inline-block;
        img {
            width: 100%;
        }

        .info {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: rgba(0,0,0,0.8);
            color: #fff;
            font-size: 0.6rem;
            white-space: nowrap;
            overflow: hidden;
            padding: 0.2rem 0.5rem;
            text-align: left;
        }
    }

    .results-boxes-slider {
        margin-top: 0.2rem;
        left: 2.25rem;
    }


    .results-boxes {
        position: absolute;
        right: 0;
        top: 0.75rem;
        width: 36rem;
        height: 30rem;
        overflow: hidden;
        opacity: 0.85;
        text-align: left;
    }
    .results-boxes.has-input {
        opacity: 1;
    }

    .fResultsSlide {
        .results-boxes {
            overflow: visible;
        }
    }

    .results-boxes.has-input .focus-ring {
        border: solid 0.15rem #fff;
        top: 0.2rem;
        left: 2.25rem;
        box-shadow: inset 0 0 0.15rem rgba(0,0,0,0.5);
    }

    .fResultsSuggestionsHorizontal .results-boxes.has-input .focus-ring {
        left: 4rem;
    }
`);

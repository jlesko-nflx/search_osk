import BaseTag from '/tags/_common/BaseTag.js';
import KeyTracking    from './lib/KeyTracking.js';

export default class SuggestionsTag extends BaseTag {

	takeFocus() {
		this.hasInput(true);
		this.updateFocus('.suggestion');
	}

	update(results) {

		this.results = results;

		$('.results-suggestions').hide();

		if (X.flag('fResultsSuggestionsHorizontal')) {
			let $label = $('<div class="suggestions-label">').text('Related To...');
			$('.results-suggestions').append($label);
		}

    	X.wait(1, ()=>{
    		this.results.suggestions.forEach((s)=>{
	    		let $s = $('<div class="suggestion">').text(s);
	    		$('.results-suggestions').append($s);
	    	});
	    	$('.results-suggestions').fadeIn(250);
            this.setFocusNum(0);
            this.slide($('.results-suggestions'), '.suggestion', 'x', 0, 0);

    	});
	}

    onNav(dir) {

    	let exit = 0;
    	let dirToBoxes = '';
    	let jumpToQuery = false;
    	if (X.flag('fResultsSuggestionsHorizontal')) {
    		exit = this.handleLR(dir);
    		dirToBoxes = 'D';
    		if (dir == 'U') {
    			jumpToQuery = true;
    		}
    		this.slide($('.results-suggestions'), '.suggestion', 'x', 0, this.focus.num);
            KeyTracking.onMove('suggestion');

    	} else {
    		exit = this.handleUD(dir);
    		dirToBoxes = 'R';
    		if (exit == -1) {
    			jumpToQuery = true;
    		} else {
                KeyTracking.onMove('suggestion');
            }
    	}
    	
    	this.updateFocus('.suggestion');

    	if (dir == dirToBoxes) {
    		this.hasInput(false);
    		jtag('.results-boxes').takeFocus();
    	}
    	else if (jumpToQuery) {
    		this.hasInput(false);
    		jtag('.az-keys').takeFocus(-1);
    		jtag('.search').animateFromResults();
    		jtag('.results-boxes').resetSlider();
    	}

        if (dir == 'SELECT') {
            let query = this.results.suggestions[this.focus.num];
            KeyTracking.onClickSuggestion(query);
            jtag('.search').setQuery(query);
        }
     }

	getNav() {
		return {
            ids: this.results.suggestions.length,
            loop: 'none'
        };  
	}

	html() {
		return jml`
			<"results-suggestions"></>
		`;
	}
}

X.css(`


    .results-suggestions {
        display: none;
    }

    .results-suggestions {
        width: 12rem;
        position: absolute;
        text-align: left;
        left: 3rem;
        padding-top: 2rem;
        opacity: 0.85;
    }
    .results-suggestions.has-input {
        opacity: 1;
    }

    .suggestions-label {
        display: none;
        margin-right: 1rem;
        top: -0.05rem;
    }
    .fResultsSuggestionsHorizontal {

        .results-boxes-slider {
            left: 4rem;
        }

        .suggestions-label {
            display: inline-block;
            color: #fff;
            text-transform: uppercase;
            font-size: 60%;
            font-weight: bold;
        }
        .suggestions-slider {
            display: inline-block;
            width: 80%;
            overflow: hidden;
        }
        .results-suggestions {
            width: 100%;
            position: relative;
            white-space: nowrap;
            margin-left: 1rem;
            top: 0;
            padding-top: 0.25rem;
            font-size: 90%;
            .suggestion {
                display: inline-block; 
                margin-right: 1rem;
            }
        }
        .results-boxes {
            width: 100%;
            position: relative;
        }
    }

    .suggestion, .suggestions-label {
        margin-bottom: 0.75rem;
        color: #888;
        font-size: 75%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .results-suggestions.has-input .suggestion.focus {
        font-weight: bold;
        color: #fff;
    }
    
`);

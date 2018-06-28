import KeysTag from '../KeysTag.js';

export default class AzTag extends KeysTag {

	onMount() {
		this.setFocusNum(0);

		let startKey = X.string('sAzStartKey').toUpperCase();
		this.getKeys().forEach((k,i)=>{
			if (k == startKey) {
				this.setFocusNum(i);
			}
		});

		this.updateFocus('.key');
		this.isNumMode = false;
	}

	getNav() {
        return {
            ids: this.getKeys(),
            loop: X.flag('fAzFixedFocus') || X.flag('fAzNumberExpand') ? 'none' : 'both'
        };    
    }

    getKeys() {

    	let keys = [];

    	if (this.isNumMode) {
    		keys = '1234567890'.split('');
    	}
		else if (X.flag('fAzStacked')) {
			if (this.data.isNz) {
				keys = 'NOPQRSTUVWXYZ67890'.split('');
			}
			else {
				keys = 'ABCDEFGHIJKLM12345'.split('');
			}
		}
		else {
			keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
		}
	
		if (X.flag('fAzFixedFocus') && !X.flag('fFloatButtonNumbers') && X.flag('fAzFixedFocusNumbers')) {
			keys = keys.concat('1234567890'.split(''));
		}
		else if (!X.flag('fAzStacked') && !X.flag('fFloatButtonNumbers')) {
			keys.push('#');
		}

		return keys;
	}

	toggleNumbers() {
		this.isNumMode = !this.isNumMode;
		this.mode(this.isNumMode ? 'num' : 'alpha');
		//if (isNumKeys) {
			this.setFocusNum(Math.floor(this.getKeys().length / 2));
			this.$el.html(this.keyHtml());
			this.updateFocus('.key');
			this.updateSlide();
		//}
	}

	updateSlide() {
		if (X.flag('fAzFixedFocus')) {
    		this.slide($('.az-keys-row'), '.key', 'x', 0, this.focus.num);
    	}
	}

	takeFocus(num) {
		if (num >= 0) { this.setFocusNum(num); }
		this.updateFocus('.key');
		this.hasInput(true);
	}

    onNav(dir) {
    	
    	let exit = this.onKeyNav(dir);

    	if (this.data.isNz && dir !== 'D') {
    		if (dir == 'U') {
	    		this.hasInput(false);
	    		jtag('.az-keys').takeFocus(this.focus.num);
	    	}
    	}
    	else {
    		if (dir == 'U') {
	    		this.hasInput(false);
	    		jtag('.float-keys').hasInput(true);
	    	}
	    	else if (dir == 'D') {
	    		
	    		if (X.flag('fAzStacked') && !this.data.isNz) {
	    			this.hasInput(false);
	    			jtag('.nz-keys').takeFocus(this.focus.num);
	    		}
	    		else if (X.flag('fResultsSuggestionsHorizontal')) {
	    			if ($('.suggestion').length > 0) {
	    				this.hasInput(false);
	    				jtag('.results-suggestions').takeFocus();
	    			}
	    		}
	    		else if (jtag('.results-boxes').hasResults()) {
	    			this.hasInput(false);
	    			if (X.flag('fAzAlignFocus')) {
	    				let focusNum = 0;
	    				// 7 - suggestions
	    				if (this.focus.num <= 6) {
	    					this.hasInput(false);
		    				jtag('.results-suggestions').takeFocus();
		    				return;
	    				}
	    				else if (this.focus.num <= 14) {
	    					focusNum = 0;
	    				}
	    				else if (this.focus.num <= 21) {
	    					focusNum = 1;
	    				}
	    				else {
	    					focusNum = 2;
	    				}
	    				jtag('.results-boxes').takeFocus(focusNum);

	    			} else {
	    				jtag('.results-boxes').takeFocus(0);
	    			}
	    		}
	    	}
    	}
    	
    	
    	if (dir == 'R' || dir == 'L' || dir == 'SELECT') {
    		
    		jtag('.float-keys').onFloat('.' + (this.data.isNz ? 'nz' : 'az') + '-keys');

    		this.updateSlide();

    		if (this.focus.id == '#' && X.flag('fAzNumberExpand')) {
    			this.hasInput(false);
	    		jtag('.num-keys').takeFocus();
    		}
    	}

    	if (exit == 1) {
    		//this.hasInput(false);
	    	//jtag('.num-keys').takeFocus();
    	}
    }

    html() {
		return this.keyHtml(this.data.isNz ? 'nz' : 'az');
    }
}


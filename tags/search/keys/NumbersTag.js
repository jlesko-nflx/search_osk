import KeysTag from '../KeysTag.js';

export default class NumbersTag extends KeysTag {

	getNav() {
        return {
            ids: this.getKeys(),
            loop: 'none'
        };    
    }

	onMount() {
		this.updateFocus('.key');
	}

	getNav() {
        return {
            ids: this.getKeys(),
        };    
    }

    getKeys() {
    	return '1234567890'.split('');
    }

    onEnter() {
    	this.setFocusNum(0);
    	this.updateFocus('.key');
    }

    onNav(dir) {
    	if (dir == 'U') {
    		this.hasInput(false);
    		jtag('.float-keys').hasInput(true);
    	}
    	else if (dir == 'D') {
    		this.hasInput(false);
    		jtag('.results-boxes').takeFocus(-1);
    	}
    	else {
    		let exit = this.onKeyNav(dir);
    		if (exit == -1) {
    			this.hasInput(false);
    			jtag('.az-keys').takeFocus(25);

    			$('.az-keys').transition({ x: '0rem' }, 400);
    			this.$el.transition({ opacity: 0, x: '14rem' }, 400);
    			X.wait(400, ()=>{
		    		jtag('.float-keys').onFloat('.az-keys');
		    	});
		    	$('.key-num').css({ opacity: 1 });
    		}
    		jtag('.float-keys').onFloat('.num-keys');
    	}
    }

    takeFocus() {

    	$('.key-num').css({ opacity: 0 });

    	$('.az-keys').transition({ x: '-12rem' }, 400);
    	this.$el.css({ opacity: 0, x: '12rem' }).transition({ opacity: 1, x: 0 }, 400);
    	X.wait(400, ()=>{
    		jtag('.float-keys').onFloat('.num-keys');
    	});
    	this.hasInput(true);

    }

    html() {
		return this.keyHtml('num');
    }
}

X.css(`

    .num-keys-row {
        position: absolute;
        right: 4rem;
    }

    .num-keys {
        opacity: 0;
    }
    
`);

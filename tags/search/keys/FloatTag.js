import KeysTag from '../KeysTag.js';

X.variants({
	fFloatButtonNumbers: false,
	fFloatButtonDeleteFirst: true,
	fFloatIcons: true,
	fFloatCenter: false,
	fFloatMoveHide: false,
	fFloatMoveFade: false,
	fFloatButtonClear: false,

	sFloatHideDelayMs: '800',

});

export default class FloatTag extends KeysTag {

	onMount() {
		if (this.getKeys().length == 3) {
			this.$el.addClass('three-wide');
		}
		this.updateFocus('.key');
		this.onFloat('.az-keys');

		this.parentSel = '.az-keys';
	}

	getNav() {
        return {
            ids: this.getKeys(),
        };    
    }

    getKeys() {
    	let keys = X.flag('fFloatButtonDeleteFirst') ? ['<', '_'] : ['_', '<'];
    	if (X.flag('fFloatButtonClear')) {
    		keys.push('*');
    	}
    	if (X.flag('fFloatButtonNumbers')) {
    		keys.push('#');
    	}
    	return keys;
    }

    onEnter() {
    	this.setFocusNum(this.getKeys().length == 3 ? 1 : 0);
    	this.updateFocus('.key');
    }

    onNav(dir) {
    	if (dir == 'D') {
    		this.hasInput(false);
    		jtag(this.parentSel).hasInput(true);
    	}
    	else if (dir == 'U') {
    		if (!X.flag('fFloatButtonClear')) {
    			this.hasInput(false);
    			jtag('.search').onBoxFocus();
    		}
    	} 
    	else {
    		this.onKeyNav(dir);
    	}
    }

    onFloat(parentSel) {
    	 if (X.flag('fFloatCenter') || X.flag('fAzFixedFocus')) {
    	 	return;
    	 }

    	 this.parentSel = parentSel;

    	 X.tick(()=>{
    	 	let pos = $(parentSel + ' .key.focus')[0].getBoundingClientRect();
    	 	$('.float-keys').css({ x: pos.left });
    	 });

         let floatHideDelay = X.num('sFloatHideDelayMs');
    	 if (X.flag('fFloatMoveHide')) {
    	 	this.waitTimer && this.waitTimer.clear();
			$('.float-keys').css({ opacity: 0 });
			this.waitTimer = X.wait(floatHideDelay, ()=>{
				$('.float-keys').css({ opacity: 1 });
			});
    	 }
    	 else if (X.flag('fFloatMoveFade')) {
    	 	this.waitTimer && this.waitTimer.clear();
			$('.float-keys').css({ opacity: 0.3 });
			this.waitTimer = X.wait(floatHideDelay, ()=>{
				$('.float-keys').css({ opacity: 1 });
			});
    	 }
    }

    html() {
		return this.keyHtml('float');
    }
}

X.css(`


    .float-keys {
        text-align: left;
    }

    .float-keys.three-wide {
        margin-left: -2.65em;
    }

    .fFloatIcons .float-keys .key {
        width: 3.55em;
    }

    .float-keys .key {
        width: 4em;
        font-size: 80%;
        text-transform: none;
        font-weight: normal;

        .icon {
            top: 0.1rem;
        }
    }

    .float-keys .key:nth-child(3) {
        .icon {
            top: 0.25rem;
        }
    }

    .float-keys .key-num {
        top: 0.05rem;
    }

    .fFloatCenter .float-keys {
        text-align: center;
        .key {
            width: 6em;
        }
    }


`);


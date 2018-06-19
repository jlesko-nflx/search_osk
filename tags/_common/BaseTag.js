
let tagId = 0;
let tagIdToElement = {};

export default class BaseTag {

    constructor(elParent, data) {
        this.state = {
            mode: 'default',
            isFocus: false,
            hasInput: false
        };
        this.data = data || {};

        this.tagId = tagId;
        tagId += 1;

        if (elParent) {
            this.renderTo(elParent);
        }
    }

    $(sel) {
        return this.$el.find(sel);
    }

    render() {
        this.$el = this.html(this.data);
        this.$el.data('jtag', this);

        return this.$el;
    }

    renderTo(elParent) {
        this.render();

        $(elParent).append(this.$el);

        if (this.onNav) {
            this.addInputListener();
        }

        this.onMount && this.onMount();
    }

    isFocus(isFocus) {
        this.$el.toggleClass('focus', isFocus);
        this.state.isFocus = isFocus;

        if (isFocus && this.onFocus) {
            this.onFocus();
        } else if (!isFocus && this.onUnfocus) {
            this.onUnfocus();
        }
    }

    hasInput(hasInput) {
        if (!this.state.isFocus) {
            this.isFocus(true);
        }
        X.wait(1, ()=>{
            this.$el.toggleClass('has-input', hasInput);
            let doEnter = hasInput && !this.state.hasInput;
            this.state.hasInput = hasInput;
            if (doEnter) {
                this.onEnter && this.onEnter();
            }
        });
    }

    mode(newMode) {
        requestAnimationFrame(()=>{
            this.$el.removeClass('mode-' + this.state.mode);
            if (!newMode) { newMode = 'default'; }
            this.state.mode = newMode;
            this.$el.addClass('mode-' + this.state.mode);
        });
    }

    isMode(mode) {
        return this.state.mode === mode;
    }

    updateFocus(sel) {
        this.$el.find(sel + '.focus').removeClass('focus');
        this.$el.find(sel).eq(this.focus.num).addClass('focus');
    }


    // INPUT 

    addInputListener(cb) {

        this.focus = {
            num: 0,
        };

        var lastKeyTime = 0;
        document.addEventListener('keydown', (e)=> {

            // if (X.get('allowKeyboard')) {
            //     return true;
            // }

            var keys = {
                37: 'L',
                39: 'R',
                38: 'U',
                40: 'D',
                13: 'SELECT',
                27: 'BACK',

                88: 'X'
            };

            var action = keys[e.keyCode];
            if (action) {

                if (this.state.hasInput) {

                    // throttle
                    var throttleMs = X.num('sInputThrottleMs') || 40;
                    let elapsed = Date.now() - lastKeyTime;
                    if (elapsed < throttleMs) {
                        e.preventDefault();
                        return;
                    }
                    lastKeyTime = Date.now();

                    this.onNav(action);
                }
            }


        }, true);
    }

    handleUD(dir) {
        if (!dir) { console.error('handleUD - pass in dir'); }
        if (dir == 'U') {
            return this.moveFocusNum(-1);
        }
        else if (dir == 'D') {
            return this.moveFocusNum(+1);
        }
        return 0;
    }

    handleLR(dir) {
        if (!dir) { console.error('handleLR - pass in dir'); }
        if (dir == 'L') {
            return this.moveFocusNum(-1);
        }
        else if (dir == 'R') {
            return this.moveFocusNum(+1);
        }
        return 0;
    }

    moveFocusNum(delta) {
        var subnav = this.getNav();
        var newFocusNum = this.focus.num + delta;
        var lastNum = (typeof subnav.ids == 'number' ? subnav.ids : subnav.ids.length) - 1;
        var exit = 0;

        if (newFocusNum > lastNum) {
            if (subnav.loop == 'right' || subnav.loop == 'both') {
                newFocusNum = 0;
            } else {
                newFocusNum = lastNum;
                exit = 1;
            }

        }
        if (newFocusNum < 0) {
            if (subnav.loop == 'both') {
                newFocusNum = lastNum;
            } else {
                newFocusNum = 0;
                exit = -1;
            }
        }

        this.setFocusNum(newFocusNum);

        return exit;
    }

    setFocusNum(num) {
        if (!this.getNav) { return; }
        var subnav = this.getNav();
        var numIds = (typeof subnav.ids == 'number' ? subnav.ids : subnav.ids.length);

        if (num < 0) { num = numIds + num; }

        var wrappedNum = num % numIds;

        var id = subnav.ids[wrappedNum];

        this.setElementFocus(this.focus.element, false);

        var els = subnav.elements || {};
        this.focus = {
            id: id,
            num: num,
            element: els[id],
            loops: Math.floor(num / numIds),
            wrappedNum: wrappedNum
        };

        this.setElementFocus(this.focus.element, true);
    }

    setElementFocus(el, isFocus) {
        $(el).toggleClass('focus', isFocus);
    }




    // translate a container element to line up with one of its children as focus
    slide($parent, selKid, axis, duration, focusChildNum) {

        focusChildNum = (typeof focusChildNum === 'undefined') ? this.focus.num : focusChildNum;

        var $el0 = $parent.find(selKid).eq(0);
        var $elX = $parent.find(selKid).eq(focusChildNum);

        var pos = axis === 'y' ? 'top' : 'left';
        var pos0 = $el0[0].getBoundingClientRect()[pos];
        var posX = $elX[0].getBoundingClientRect()[pos];
        var delta = posX - pos0;

        var an = { };
        an[axis] = (-1 * delta) + 'px';

        if (duration) {
            $parent.transition(an, duration);
        } else {
            $parent.css(an);
        }
    }


    createVideo(container, src, opts) {

        if (!opts) { 
            opts = {
                autoPlay: true
            }; 
        }

        let $vid = $('<video class="w100 z1">');
        $vid.attr('src', src);
        
        this.$el.find(container).empty().prepend($vid);

        let video = $vid[0];

        
        let started = false;
        video.addEventListener('canplay', ()=>{
            if (started) { return; }
            started = true; 

             if (opts.autoPlay) {
                video.play(); 
             }

             opts.onLoad && opts.onLoad();
        });

        if (opts.loop) {
            video.addEventListener('ended', ()=>{
                 video.play(); 
            });
        }

        return video;
    }

}

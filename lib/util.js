// Transit
(function(t,e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else if(typeof exports==="object"){module.exports=e(require("jquery"))}else{e(t.jQuery)}})(this,function(t){t.transit={version:"0.9.12",propertyMap:{marginLeft:"margin",marginRight:"margin",marginBottom:"margin",marginTop:"margin",paddingLeft:"padding",paddingRight:"padding",paddingBottom:"padding",paddingTop:"padding"},enabled:true,useTransitionEnd:false};var e=document.createElement("div");var n={};function i(t){if(t in e.style)return t;var n=["Moz","Webkit","O","ms"];var i=t.charAt(0).toUpperCase()+t.substr(1);for(var r=0;r<n.length;++r){var s=n[r]+i;if(s in e.style){return s}}}function r(){e.style[n.transform]="";e.style[n.transform]="rotateY(90deg)";return e.style[n.transform]!==""}var s=navigator.userAgent.toLowerCase().indexOf("chrome")>-1;n.transition=i("transition");n.transitionDelay=i("transitionDelay");n.transform=i("transform");n.transformOrigin=i("transformOrigin");n.filter=i("Filter");n.transform3d=r();var a={transition:"transitionend",MozTransition:"transitionend",OTransition:"oTransitionEnd",WebkitTransition:"webkitTransitionEnd",msTransition:"MSTransitionEnd"};var o=n.transitionEnd=a[n.transition]||null;for(var u in n){if(n.hasOwnProperty(u)&&typeof t.support[u]==="undefined"){t.support[u]=n[u]}}e=null;t.cssEase={_default:"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeInCubic:"cubic-bezier(.550,.055,.675,.190)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};t.cssHooks["transit:transform"]={get:function(e){return t(e).data("transform")||new f},set:function(e,i){var r=i;if(!(r instanceof f)){r=new f(r)}if(n.transform==="WebkitTransform"&&!s){e.style[n.transform]=r.toString(true)}else{e.style[n.transform]=r.toString()}t(e).data("transform",r)}};t.cssHooks.transform={set:t.cssHooks["transit:transform"].set};t.cssHooks.filter={get:function(t){return t.style[n.filter]},set:function(t,e){t.style[n.filter]=e}};if(t.fn.jquery<"1.8"){t.cssHooks.transformOrigin={get:function(t){return t.style[n.transformOrigin]},set:function(t,e){t.style[n.transformOrigin]=e}};t.cssHooks.transition={get:function(t){return t.style[n.transition]},set:function(t,e){t.style[n.transition]=e}}}p("scale");p("scaleX");p("scaleY");p("translate");p("rotate");p("rotateX");p("rotateY");p("rotate3d");p("perspective");p("skewX");p("skewY");p("x",true);p("y",true);function f(t){if(typeof t==="string"){this.parse(t)}return this}f.prototype={setFromString:function(t,e){var n=typeof e==="string"?e.split(","):e.constructor===Array?e:[e];n.unshift(t);f.prototype.set.apply(this,n)},set:function(t){var e=Array.prototype.slice.apply(arguments,[1]);if(this.setter[t]){this.setter[t].apply(this,e)}else{this[t]=e.join(",")}},get:function(t){if(this.getter[t]){return this.getter[t].apply(this)}else{return this[t]||0}},setter:{rotate:function(t){this.rotate=b(t,"deg")},rotateX:function(t){this.rotateX=b(t,"deg")},rotateY:function(t){this.rotateY=b(t,"deg")},scale:function(t,e){if(e===undefined){e=t}this.scale=t+","+e},skewX:function(t){this.skewX=b(t,"deg")},skewY:function(t){this.skewY=b(t,"deg")},perspective:function(t){this.perspective=b(t,"px")},x:function(t){this.set("translate",t,null)},y:function(t){this.set("translate",null,t)},translate:function(t,e){if(this._translateX===undefined){this._translateX=0}if(this._translateY===undefined){this._translateY=0}if(t!==null&&t!==undefined){this._translateX=b(t,"px")}if(e!==null&&e!==undefined){this._translateY=b(e,"px")}this.translate=this._translateX+","+this._translateY}},getter:{x:function(){return this._translateX||0},y:function(){return this._translateY||0},scale:function(){var t=(this.scale||"1,1").split(",");if(t[0]){t[0]=parseFloat(t[0])}if(t[1]){t[1]=parseFloat(t[1])}return t[0]===t[1]?t[0]:t},rotate3d:function(){var t=(this.rotate3d||"0,0,0,0deg").split(",");for(var e=0;e<=3;++e){if(t[e]){t[e]=parseFloat(t[e])}}if(t[3]){t[3]=b(t[3],"deg")}return t}},parse:function(t){var e=this;t.replace(/([a-zA-Z0-9]+)\((.*?)\)/g,function(t,n,i){e.setFromString(n,i)})},toString:function(t){var e=[];for(var i in this){if(this.hasOwnProperty(i)){if(!n.transform3d&&(i==="rotateX"||i==="rotateY"||i==="perspective"||i==="transformOrigin")){continue}if(i[0]!=="_"){if(t&&i==="scale"){e.push(i+"3d("+this[i]+",1)")}else if(t&&i==="translate"){e.push(i+"3d("+this[i]+",0)")}else{e.push(i+"("+this[i]+")")}}}}return e.join(" ")}};function c(t,e,n){if(e===true){t.queue(n)}else if(e){t.queue(e,n)}else{t.each(function(){n.call(this)})}}function l(e){var i=[];t.each(e,function(e){e=t.camelCase(e);e=t.transit.propertyMap[e]||t.cssProps[e]||e;e=h(e);if(n[e])e=h(n[e]);if(t.inArray(e,i)===-1){i.push(e)}});return i}function d(e,n,i,r){var s=l(e);if(t.cssEase[i]){i=t.cssEase[i]}var a=""+y(n)+" "+i;if(parseInt(r,10)>0){a+=" "+y(r)}var o=[];t.each(s,function(t,e){o.push(e+" "+a)});return o.join(", ")}t.fn.transition=t.fn.transit=function(e,i,r,s){var a=this;var u=0;var f=true;var l=t.extend(true,{},e);if(typeof i==="function"){s=i;i=undefined}if(typeof i==="object"){r=i.easing;u=i.delay||0;f=typeof i.queue==="undefined"?true:i.queue;s=i.complete;i=i.duration}if(typeof r==="function"){s=r;r=undefined}if(typeof l.easing!=="undefined"){r=l.easing;delete l.easing}if(typeof l.duration!=="undefined"){i=l.duration;delete l.duration}if(typeof l.complete!=="undefined"){s=l.complete;delete l.complete}if(typeof l.queue!=="undefined"){f=l.queue;delete l.queue}if(typeof l.delay!=="undefined"){u=l.delay;delete l.delay}if(typeof i==="undefined"){i=t.fx.speeds._default}if(typeof r==="undefined"){r=t.cssEase._default}i=y(i);var p=d(l,i,r,u);var h=t.transit.enabled&&n.transition;var b=h?parseInt(i,10)+parseInt(u,10):0;if(b===0){var g=function(t){a.css(l);if(s){s.apply(a)}if(t){t()}};c(a,f,g);return a}var m={};var v=function(e){var i=false;var r=function(){if(i){a.unbind(o,r)}if(b>0){a.each(function(){this.style[n.transition]=m[this]||null})}if(typeof s==="function"){s.apply(a)}if(typeof e==="function"){e()}};if(b>0&&o&&t.transit.useTransitionEnd){i=true;a.bind(o,r)}else{window.setTimeout(r,b)}a.each(function(){if(b>0){this.style[n.transition]=p}t(this).css(l)})};var z=function(t){this.offsetWidth;v(t)};c(a,f,z);return this};function p(e,i){if(!i){t.cssNumber[e]=true}t.transit.propertyMap[e]=n.transform;t.cssHooks[e]={get:function(n){var i=t(n).css("transit:transform");return i.get(e)},set:function(n,i){var r=t(n).css("transit:transform");r.setFromString(e,i);t(n).css({"transit:transform":r})}}}function h(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}function b(t,e){if(typeof t==="string"&&!t.match(/^[\-0-9\.]+$/)){return t}else{return""+t+e}}function y(e){var n=e;if(typeof n==="string"&&!n.match(/^[\-0-9\.]+/)){n=t.fx.speeds[n]||t.fx.speeds._default}return b(n,"ms")}t.transit.getTransitionValue=d;return t});

let VARIANTS = {};

// template handler. jml`...`
function jml (strings1, ...keys1) {

    let out = '';
    let strings = strings1.slice();
    let keys = keys1.slice();
    while (true) {
        if (strings.length + keys.length <= 0) { break; }

        let s = strings.shift();
        let k = keys.shift();

        if (s) out += s;
        if (k) {
            if (Array.isArray(k)) {

                k.forEach((e,i)=>{
                    if (e.render) {
                        out += e.render()[0].outerHTML;
                    } else {
                        out += e.outerHTML;
                    }
                });
                k = k.join('');

            } else if (typeof k === 'object') {
                out += k[0].outerHTML;
            } else {
                out += k;
            }
        }
    }
    return formatJml(out);
}

window.jtag = function(sel) {
    let t = $(sel).jtag();
    if (!t) {
        throw Error ('Element ('+ sel +') has no jtag.');
    }
    return t;
}

window.formatJml = function (t) {

    let out = '';
    let lines = t.split(/\n/);
    lines.forEach((e)=>{
        e = e.replace(/<d /g, '<div ');
        e = e.replace(/<\/>/g, '</div>');
        e = e.replace(/<"/g, '<div class="');
        e = e.replace(/ "(.*?)"/g, ' class="$1"');

        if (e.match(/>> /)) {
            e = e.replace(/>> /, '>');
            e += '</div>';
        }
        out += e;
    });

    return $(out);
}

$.fn.jtag = function(){
    return this.data('jtag');
};

window.X = {

    wait(timeMs1, fn1) {
        
        let timer = {

            offset: 0,
            timerIds: [],

            then: function (timeMs, fn) {
                if (!fn) { fn = function(){}; } 
                let timerId = setTimeout(fn, timeMs + this.offset);
                this.timerIds.push(timerId);
                this.offset += timeMs;
                return this;
            },

            stop: function() {
                this.timerIds.forEach((tid)=>{
                    clearTimeout(tid);
                });
            },

            restart: function(newTime) {
                this.clear();
                this.then(newTime || timeMs1, fn1);
            },

            clear: function() {
                this.stop();
                this.timerIds = [];
                this.offset = 0;
            }
        };

        timer.then(timeMs1, fn1);

        return timer;
    },

    tick(fn) {
        requestAnimationFrame(fn);
    },

    icon(iconName, extraClasses) {

        var icons = {
            back:         'icon-uniE635',
            search:       'icon-uniE636',
            play:         'icon-uniE646',
            pause:        'icon-uniE645',
            rewind:       'icon-uniE752',
            language:     'icon-uniE650',
            episodes:     'icon-uniE649',
            myListAdd:    'icon-uniF018',
            myListAdded:  'icon-uniE756',
            ratingUp:     'icon-uniE661',
            ratingDown:   'icon-uniE660',
            info:         'icon-uniE799',
            caretR:       'icon-uniE867',
            caretL:       'icon-uniE868',
            spinner:      'icon-uniE765',
            star:         'icon-uniE640',
            netflix:      'icon-uniE5D0',
            chevronD:     'icon-uniE745',
            chevronU:     'icon-uniE706',
            space:        'icon-uniE882',
            delete:       'icon-uniE883',
            kids:         'icon-uniE691',
            circlePlay:   'icon-uniE713',
            circleAdd:    'icon-uniE716',
            circleRate:   'icon-uniE718',
            close:        'icon-uniE807',

            pauseLight:   'icon-uniF057'
        };

        extraClasses = extraClasses || '';

        return '<div class="icon ' + (icons[iconName] || 'UNKNOWN') + ' ' + extraClasses + '"></div>';
    },

    // TODO: support comma-multi-selectors
    css(scss) {
        var out = [];
        var blockStack = [];
        var blocks = [];
        var selectorChain = [];
        var currentBlock = [];
        var lines = scss.split(/\n+/);

        function rempx(m, m1) {
            return (Number(m1) / 20) + 'rem';
        }

        for (var i=0,len = lines.length; i < len; i++) {

            var line = lines[i].trim();

            // line comment or blank line
            if (!line || line.substr(0,2) === '//') { continue; }

            if (line === '}') {

                currentBlock.push('}');
                // buffer inner blocks until we reach the top level again
                out.push(currentBlock.join("\n"));
                currentBlock = blockStack.pop() || [];

                selectorChain.pop();
                // if (!selectorChain.length) {
                //     // top-level.  flush inner blocks
                //     while (true) {
                //         if (!blockStack.length) { break; }
                //         out.push(blockStack.pop().join("\n"));
                //     }
                // }

            } else {

                var m = line.match(/^(.*?)\s*{\s*$/);
                if (m) {
                    // selector
                    selectorChain.push(m[1]);

                    let selector = selectorChain.join(' ').replace(/ &/, '');
                    selector += ' {';
                    blockStack.push(currentBlock);
                    currentBlock = [];
                    currentBlock.push(selector);
                }
                else {
                    // rule
                    line = line.replace(/([0-9][0-9\.]*)rpx/gi, rempx);
                    currentBlock.push('    ' + line);
                }
            }
        }
        
        $('body').append('<style>' + out.join("\n\n") + '</style>');
    },

    // Misc

    // Get current URL params in a Map
    queryParams() {
        var search = location.search.substring(1);
        var params = search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
            function(key, value) { return key===""?value:decodeURIComponent(value) }):{};
        return params;
    },

    sizeFocusRing(elRing, elItem) {
        X.tick(function(){
            var rect = $(elItem)[0].getBoundingClientRect();
            var size = {
                width: rect.right - rect.left,
                height: rect.bottom - rect.top
            };
            $(elRing).css(size);
        });
    },


    soundChannels: {},

    playSound(id, args) {

        if (!X.flag('fAllSoundUi')) { return; }

        // play sound directly
        if (id.match(/\.wav|\.mp3/)) {
            var s = new Audio();
            s.volume = args && args.volume || 0.15;
            s.src = '/sfx/' + id;
            s.play();
            return s;
        }

        var soundSet = X.string('soundSet');


        if (this.soundChannels[id] || !sets[soundSet] ) {
            return;
        }
        var self = this;
        X.wait(16, function(){
            self.soundChannels[id] = false;
        });

        var file = sets[soundSet][id];
        if (id == 'select' && X.string('soundLong')) {
            file = 'long/' + X.string('soundLong');
        }

        this.soundChannels[id] = new Audio();
        this.soundChannels[id].volume = 0.1;
        this.soundChannels[id].src = '/sfx/ui/set1/' + file + '.wav';
        this.soundChannels[id].play();

    },

    sound(url, numBuffers) {

        let sfx = {
            buffers: [],
            bufferNum: 0,
            play: function(){
                this.bufferNum += 1;
                if (this.bufferNum > this.buffers.length - 1) {
                    this.bufferNum = 0;
                }
                this.buffers[this.bufferNum].play();
            }
        };
        for (var i=0; i < numBuffers; i+=1) {
            sfx.buffers.push(new Audio (url));
        }

        return sfx;
    },


    //========== VARIANTS


    initFlagClasses() {
        var flags = this.getVariants('f');
        for (var f in flags) {
            if (this.flag(f)) {  document.body.classList.add(f);  }
        }
    },

    getVariants(type) {
        var flags = {};
        var params = X.params();
        for (var s in VARIANTS) {
            if (s[0] === type) {
                flags[s] = params.hasOwnProperty(s) ? params[s] : VARIANTS[s];
            }
        }
        return flags;
    },

    removePrefix(key) {
        return key.charAt(1).toLowerCase() + key.slice(2);
    },

    addPrefix(key, prefix) {
        var ucKey = key.charAt(0).toUpperCase() + key.slice(1);
        ucKey = prefix + ucKey;
        return ucKey;
    },

    flag(key) {
       // key = X.addPrefix(key, 'f');
        var v = this.getVariants('f')[key] || false;
        var isOn = v !== '0' && v !== false;
        return isOn;
    },

    string(key) {
      //  key = X.addPrefix(key, 's');
        return X.getVariants('s')[key];
    },

    num(key) {
      //  key = X.addPrefix(key, 's');
        return parseInt(X.getVariants('s')[key]) || 0;
    },

    params() {
        var search = location.search.substring(1);
        var params = search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
            function(key, value) { return key===""?value:decodeURIComponent(value) }):{};
        return params;
    },

    param(key, def) {
        var params = this.params();
        return params.hasOwnProperty(key) ? params[key] : def;
    },

    variants(s, clusters) {
        VARIANTS = Object.assign(VARIANTS, s);
        if (clusters) {
            for (var k in clusters) {
                if (s[k]) {
                    VARIANTS = Object.assign(VARIANTS, clusters[k]);
                }
            }
        }
        X.initFlagClasses();
    },

};





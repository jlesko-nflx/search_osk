import BaseTag from '/tags/_common/BaseTag.js';

export default class XPanelTag extends BaseTag {

    onMount() {

        this.state.isOpen = false;
        this.numChanges = 0;

        document.addEventListener('keydown',(e)=> {

              if (e.keyCode == 9 || (e.keyCode == 13 && this.state.isOpen)) {   // 'TAB'
                  e.preventDefault();

                  if (this.state.isOpen) {
                      if (this.numChanges) {
                          this.saveFlags();
                      } else {
                          this.hide();
                      }

                  } else {
                      this.show();
                  }
                  this.state.isOpen = !this.state.isOpen;
              }
          });

         this.$('.option').on('click', (e)=>{
             this.numChanges += 1;
             $(e.currentTarget).toggleClass('isActive');
         });

         this.$('input[type="text"]').on('keydown', ()=>{
            console.log('CHANGE');
             this.numChanges += 1;
         });
    }

    show() {
        $('.xpanel').transition({ x: 0, opacity: 1  });
    }

    hide() {
        $('.xpanel').transition({ x: '-14rem', opacity: 0  });
    }

    saveFlags() {

        var params = X.params();

        $('.xpanel .option').each(function(i,e){
            var $e = $(e);
            var f = $e.data('name');
            params[f] = $e.hasClass('isActive') ? 1 : 0;
        });

        $('.xpanel .field input').each(function(i,e){
            var $e = $(e);
            var id = $e.attr('id');
            var val = $e[0].value;
            params[id] = val;
        });

        var q = [];
        for (var k in params) {
            q.push(k + '=' + encodeURIComponent(params[k]));
        }

        location.href = '/?' + q.join('&');
    }

    renderStrings() {
        var out = [];
        var strings = X.getVariants('s');
        for (var s in strings) {
            var label = X.removePrefix(s);
            var v = strings[s];
            out.push(`
                <div class='field'>
                    <label htmlFor="${s}">${label}</label>
                    <input type='text' id='${s}' value='${v}' />
                </div>
            `);
        }

        return out.join('');
    }

    renderFlags() {
        var self = this;

        var out = [];
        var flags = X.getVariants('f');
        var flagKeys = [];

        for (var f in flags) {
            flagKeys.push(f);
        }

        flagKeys.sort().forEach(function(e,i){
            var isActive = flags[e] !== false && flags[e] !== '0';
            let label = X.removePrefix(e);
            label = label.replace(/([A-Z])/, '.$1');
            out.push(`
                <div class="${'option' + (isActive ? ' isActive' : '')}" data-name="${e}" key="${'key' + i}">
                    <div class='check' />
                    <span>${ label }</span>
                </div>
            `);
        });

        return out.join('');
    }

    html() {

        let $html = jml`

            <"xpanel z1">
                <"xpanel-header"><a href="/?testId=${this.data.testId}" style="position: relative; cursor: pointer">${this.data.testId}</a></>
                <"xpanel-col">
                    ${ this.renderStrings() }
                </>
                <"xpanel-col">
                    ${ this.renderFlags() }
                </>
            </>

        `;

        return $html;

    }

}

X.css(`

    .xpanel-header {
        font-weight: bold;
        margin-bottom: 1rem;
        color: #fff;
    }

    .xpanel {

        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 14rem;
        background-color: rgba(110,0,0,0.9);
        padding: 2rem;
        overflow: auto;
        vertical-align: top;
        white-space: nowrap;
        
        opacity: 0;
        transform: translateX(-14rem);

        display: block;

        .field { 
            font-size: 60%; 
            margin-bottom: 0.25rem; 
        }
        .field input {
            background-color: #2d0000;
            padding: 0.25rem;
        }
        .field label { 
            font-size: 90%; 
            display: block; 
        }

        .xpanel-col {
            display: inline-block;
            width: 9rem;
            margin-right: 1rem;
            float:left;
        }

        .option {
            cursor: pointer;
            line-height: 1.1rem;
            font-size: 0.6rem;
            display: block;
            color: #d99;
            text-shadow: 0 0 0.3rem rgba(255,255,255,0.8);

            .check {
                display: inline-block;
                height: 0.4rem;
                width: 0.4rem;
                background-color: #a33;
                margin-right: 0.25rem;
                border-radius: 0.1rem;
            }

            &.isActive {
                color: #fff;
                .check {
                    background-color: #fff;
                }
            }
        }
    }



`);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script = {
  props: {
    placeholder: {
        type: String,
        default: ''
    },
    startMonth: {
        type: String,
        default: null
    },
    endMonth: {
        type: String,
        default: null
    },
    monthFormat: {
      type: Array,
      default: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
    },
    mounted () {
        if (this.monthFormat.length > 0) {
            this.months = this.months.map((m, index) => {
                return {
                    ...m,
                    name: this.monthFormat[index]
                }
            });
        }
        this.updateDisplayText();
    },
    data () {
        return {
            months: [
                { id: '01', name: '01' },
                { id: '02', name: '02' },
                { id: '03', name: '03' },
                { id: '04', name: '04' },
                { id: '05', name: '05' },
                { id: '06', name: '06' },
                { id: '07', name: '07' },
                { id: '08', name: '08' },
                { id: '09', name: '09' },
                { id: '10', name: '10' },
                { id: '11', name: '11' },
                { id: '12', name: '12' }
            ],
            isClickingButton: false,
            isPanelOpen: false, // 控制面板開啟/關閉
            isHovering: false, // 是否在滑鼠移動中
            hoverMonth: null, // 滑鼠目前停留的月份
            displayText: '' // 顯示在輸入框中的文字
        }
    },
    watch: {
        startMonth: 'updateDisplayText',
        endMonth: 'updateDisplayText'
    },
    methods: {
        updateDisplayText () {
            if (this.startMonth && this.endMonth) {
                const startMonthName = this.months.find(month => month.id === this.startMonth).name;
                const endMonthName = this.months.find(month => month.id === this.endMonth).name;
                this.displayText = `${startMonthName} - ${endMonthName}`;
            } else if (this.startMonth) {
                const startMonthName = this.months.find(month => month.id === this.startMonth).name;
                this.displayText = `${startMonthName}`;
            } else {
                this.displayText = this.placeholder;
            }
        },
        openPanel () {
            this.isClickingButton = true; // 標記正在點擊按鈕
            this.isPanelOpen = true;
            this.addGlobalClickListener();
            setTimeout(() => (this.isClickingButton = false), 200); // 延遲重置
        },
        closePanel () {
            this.isPanelOpen = false;
            this.removeGlobalClickListener();
        },
        selectMonth (month) {
            this.isClickingButton = true;
            setTimeout(() => (this.isClickingButton = false), 200); // 延遲重置
            if (!this.startMonth || (this.startMonth && this.endMonth)) {
                this.$emit('update:startMonth', month.id); // 傳遞 name
                this.$emit('update:endMonth', null);
            } else if (!this.endMonth) {
                if (month.id >= this.startMonth) {
                    this.$emit('update:endMonth', month.id); // 傳遞 name
                } else {
                    this.$emit('update:startMonth', month.id); // 傳遞 name
                    this.$emit('update:endMonth', this.startMonth);
                }
                this.closePanel();
            }
        },
        isInRange (month) {
            return (
                this.startMonth &&
                this.endMonth &&
                month > this.startMonth &&
                month < this.endMonth
            )
        },
        isInHoverRange (month) {
            return (
                this.startMonth &&
                !this.endMonth &&
                month > this.startMonth &&
                month <= this.hoverMonth
            )
        },
        handleHover (month) {
            this.isHovering = true;
            this.hoverMonth = month;
        },
        clearHover () {
            this.isHovering = false;
            this.hoverMonth = null;
        },
        addGlobalClickListener () {
            document.addEventListener('click', this.handleGlobalClick);
        },
        removeGlobalClickListener () {
            document.removeEventListener('click', this.handleGlobalClick);
        },
        handleGlobalClick (event) {
            // this.isPanelOpen = false;
            setTimeout(() => {
                // 如果不是點擊按鈕，才關閉選單
                if (!this.isClickingButton) {
                    this.isPanelOpen = false;
                }
            }, 200);
            // if (!this.$el.contains(event.target)) {
            //   this.closePanel();
            // }
    }
  },
  beforeDestroy () {
    this.removeGlobalClickListener();
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
    }
    // scopedId
    {
        options._scopeId = scopeId;
    }
    let hook;
    {
        hook = function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "month-range-picker",
      on: {
        click: function ($event) {
          $event.stopPropagation();
        },
      },
    },
    [
      _c("div", { staticClass: "input-field" }, [
        _c("input", {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: _vm.displayText,
              expression: "displayText",
            },
          ],
          attrs: { type: "button", placeholder: _vm.placeholder },
          domProps: { value: _vm.displayText },
          on: {
            click: _vm.openPanel,
            blur: _vm.handleGlobalClick,
            input: function ($event) {
              if ($event.target.composing) {
                return
              }
              _vm.displayText = $event.target.value;
            },
          },
        }),
      ]),
      _vm._v(" "),
      _vm.isPanelOpen
        ? _c(
            "div",
            { staticClass: "months-panel" },
            _vm._l(_vm.months, function (month) {
              return _c(
                "div",
                {
                  key: month.id,
                  class: [
                    "month",
                    {
                      "start-month": month.id === _vm.startMonth,
                      "end-month": month.id === _vm.endMonth,
                      "in-range": _vm.isInRange(month.id),
                      "hover-range":
                        _vm.isHovering && _vm.isInHoverRange(month.id),
                    },
                  ],
                  on: {
                    click: function ($event) {
                      return _vm.selectMonth(month)
                    },
                    mouseover: function ($event) {
                      return _vm.handleHover(month.id)
                    },
                    mouseleave: _vm.clearHover,
                  },
                },
                [_vm._v("\n            " + _vm._s(month.name) + "\n        ")]
              )
            }),
            0
          )
        : _vm._e(),
    ]
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-0d9e5954_0", { source: ".month-range-picker[data-v-0d9e5954] {\n  position: relative;\n}\n.month-range-picker .input-field input[data-v-0d9e5954] {\n  padding: 8px;\n  border: 1px solid #ddd;\n  border-radius: 5px;\n  cursor: pointer;\n  width: 100%;\n  background: transparent;\n  text-align: left;\n}\n.months-panel[data-v-0d9e5954] {\n  max-width: 220px;\n  display: flex;\n  flex-wrap: wrap;\n  margin-top: 5px;\n  border: 1px solid #ddd;\n  padding: 12px;\n  border-radius: 5px;\n  position: absolute;\n  background: white;\n  z-index: 10;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);\n}\n.month[data-v-0d9e5954] {\n  width: calc(33.3333333333% - 20px);\n  text-align: center;\n  padding: 4px 10px;\n  margin: 0;\n  cursor: pointer;\n  border: 0;\n}\n.month.start-month[data-v-0d9e5954] {\n  background-color: #007bff;\n  color: white;\n  border-top-left-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\n.month.end-month[data-v-0d9e5954] {\n  background-color: #007bff;\n  color: white;\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 4px;\n}\n.month.in-range[data-v-0d9e5954], .month.hover-range[data-v-0d9e5954] {\n  background-color: #e0efff;\n}\n.month[data-v-0d9e5954]:hover {\n  background-color: #007bff;\n  color: white;\n  border-radius: 4px;\n}\n\n/*# sourceMappingURL=MonthRangePicker.vue.map */", map: {"version":3,"sources":["/Volumes/SP-PX10/projects/code/Tools/vue2/vue2-month-range-picker/src/components/MonthRangePicker.vue","MonthRangePicker.vue"],"names":[],"mappings":"AA6KA;EAEA,kBAAA;AC7KA;AD+KA;EACA,YAAA;EACA,sBAAA;EACA,kBAAA;EACA,eAAA;EACA,WAAA;EACA,uBAAA;EACA,gBAAA;AC7KA;ADiLA;EACA,gBAAA;EACA,aAAA;EACA,eAAA;EACA,eAAA;EACA,sBAAA;EACA,aAAA;EACA,kBAAA;EACA,kBAAA;EACA,iBAAA;EACA,WAAA;EACA,wCAAA;AC9KA;ADiLA;EACA,kCAAA;EACA,kBAAA;EACA,iBAAA;EACA,SAAA;EACA,eAAA;EACA,SAAA;AC9KA;ADiLA;EACA,yBAAA;EACA,YAAA;EACA,2BAAA;EACA,8BAAA;AC/KA;ADkLA;EACA,yBAAA;EACA,YAAA;EACA,4BAAA;EACA,+BAAA;AChLA;ADmLA;EACA,yBAAA;ACjLA;ADoLA;EACA,yBAAA;EACA,YAAA;EACA,kBAAA;AClLA;;AAEA,+CAA+C","file":"MonthRangePicker.vue","sourcesContent":["<template>\n    <div class='month-range-picker' @click.stop>\n        <!-- <h4>選擇月份範圍</h4> -->\n\n        <!-- 單一輸入框 -->\n        <div class='input-field'>\n            <!-- <button @focus='openPanel'>開啟</button> -->\n            <input type='button' v-model='displayText' :placeholder='placeholder' @click='openPanel'\n                @blur='handleGlobalClick' />\n        </div>\n\n        <!-- 月份選擇面板  -->\n        <div v-if='isPanelOpen' class='months-panel'>\n            <div v-for='month in months' :key='month.id' :class='[ \"month\", {\n                    \"start-month\": month.id === startMonth,\n                    \"end-month\": month.id === endMonth,\n                    \"in-range\": isInRange(month.id),\n                    \"hover-range\": isHovering && isInHoverRange(month.id),\n                },\n            ]' @click='selectMonth(month)' @mouseover='handleHover(month.id)' @mouseleave='clearHover'>\n                {{ month.name }}\n            </div>\n        </div>\n    </div>\n</template>\n\n<script>\nexport default {\n  props: {\n    placeholder: {\n        type: String,\n        default: ''\n    },\n    startMonth: {\n        type: String,\n        default: null\n    },\n    endMonth: {\n        type: String,\n        default: null\n    },\n    monthFormat: {\n      type: Array,\n      default: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']\n    }\n    },\n    mounted () {\n        if (this.monthFormat.length > 0) {\n            this.months = this.months.map((m, index) => {\n                return {\n                    ...m,\n                    name: this.monthFormat[index]\n                }\n            })\n        }\n        this.updateDisplayText()\n    },\n    data () {\n        return {\n            months: [\n                { id: '01', name: '01' },\n                { id: '02', name: '02' },\n                { id: '03', name: '03' },\n                { id: '04', name: '04' },\n                { id: '05', name: '05' },\n                { id: '06', name: '06' },\n                { id: '07', name: '07' },\n                { id: '08', name: '08' },\n                { id: '09', name: '09' },\n                { id: '10', name: '10' },\n                { id: '11', name: '11' },\n                { id: '12', name: '12' }\n            ],\n            isClickingButton: false,\n            isPanelOpen: false, // 控制面板開啟/關閉\n            isHovering: false, // 是否在滑鼠移動中\n            hoverMonth: null, // 滑鼠目前停留的月份\n            displayText: '' // 顯示在輸入框中的文字\n        }\n    },\n    watch: {\n        startMonth: 'updateDisplayText',\n        endMonth: 'updateDisplayText'\n    },\n    methods: {\n        updateDisplayText () {\n            if (this.startMonth && this.endMonth) {\n                const startMonthName = this.months.find(month => month.id === this.startMonth).name;\n                const endMonthName = this.months.find(month => month.id === this.endMonth).name;\n                this.displayText = `${startMonthName} - ${endMonthName}`;\n            } else if (this.startMonth) {\n                const startMonthName = this.months.find(month => month.id === this.startMonth).name;\n                this.displayText = `${startMonthName}`;\n            } else {\n                this.displayText = this.placeholder;\n            }\n        },\n        openPanel () {\n            this.isClickingButton = true // 標記正在點擊按鈕\n            this.isPanelOpen = true\n            this.addGlobalClickListener()\n            setTimeout(() => (this.isClickingButton = false), 200) // 延遲重置\n        },\n        closePanel () {\n            this.isPanelOpen = false\n            this.removeGlobalClickListener()\n        },\n        selectMonth (month) {\n            this.isClickingButton = true;\n            setTimeout(() => (this.isClickingButton = false), 200); // 延遲重置\n            if (!this.startMonth || (this.startMonth && this.endMonth)) {\n                this.$emit('update:startMonth', month.id); // 傳遞 name\n                this.$emit('update:endMonth', null);\n            } else if (!this.endMonth) {\n                if (month.id >= this.startMonth) {\n                    this.$emit('update:endMonth', month.id); // 傳遞 name\n                } else {\n                    this.$emit('update:startMonth', month.id); // 傳遞 name\n                    this.$emit('update:endMonth', this.startMonth);\n                }\n                this.closePanel();\n            }\n        },\n        isInRange (month) {\n            return (\n                this.startMonth &&\n                this.endMonth &&\n                month > this.startMonth &&\n                month < this.endMonth\n            )\n        },\n        isInHoverRange (month) {\n            return (\n                this.startMonth &&\n                !this.endMonth &&\n                month > this.startMonth &&\n                month <= this.hoverMonth\n            )\n        },\n        handleHover (month) {\n            this.isHovering = true\n            this.hoverMonth = month\n        },\n        clearHover () {\n            this.isHovering = false\n            this.hoverMonth = null\n        },\n        addGlobalClickListener () {\n            document.addEventListener('click', this.handleGlobalClick)\n        },\n        removeGlobalClickListener () {\n            document.removeEventListener('click', this.handleGlobalClick)\n        },\n        handleGlobalClick (event) {\n            // this.isPanelOpen = false;\n            setTimeout(() => {\n                // 如果不是點擊按鈕，才關閉選單\n                if (!this.isClickingButton) {\n                    this.isPanelOpen = false\n                }\n            }, 200)\n            // if (!this.$el.contains(event.target)) {\n            //   this.closePanel();\n            // }\n    }\n  },\n  beforeDestroy () {\n    this.removeGlobalClickListener()\n  }\n}\n</script>\n\n<style lang='scss' scoped>\n.month-range-picker {\n    // padding: 20px;\n    position: relative;\n\n    .input-field input {\n        padding: 8px;\n        border: 1px solid #ddd;\n        border-radius: 5px;\n        cursor: pointer;\n        width: 100%;\n        background: transparent;\n        text-align: left;\n    }\n}\n\n.months-panel {\n    max-width: 220px;\n    display: flex;\n    flex-wrap: wrap;\n    margin-top: 5px;\n    border: 1px solid #ddd;\n    padding: 12px;\n    border-radius: 5px;\n    position: absolute;\n    background: white;\n    z-index: 10;\n    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);\n}\n\n.month {\n    width: calc(100% / 3 - 20px);\n    text-align: center;\n    padding: 4px 10px;\n    margin: 0;\n    cursor: pointer;\n    border: 0;\n    // border-radius: 5px;\n\n    &.start-month {\n        background-color: #007bff;\n        color: white;\n        border-top-left-radius: 4px;\n        border-bottom-left-radius: 4px;\n    }\n\n    &.end-month {\n        background-color: #007bff;\n        color: white;\n        border-top-right-radius: 4px;\n        border-bottom-right-radius: 4px;\n    }\n\n    &.in-range,&.hover-range {\n        background-color: #e0efff;\n    }\n\n    &:hover{\n        background-color: #007bff;\n        color: white;\n        border-radius: 4px;\n    }\n}\n</style>\n",".month-range-picker {\n  position: relative;\n}\n.month-range-picker .input-field input {\n  padding: 8px;\n  border: 1px solid #ddd;\n  border-radius: 5px;\n  cursor: pointer;\n  width: 100%;\n  background: transparent;\n  text-align: left;\n}\n\n.months-panel {\n  max-width: 220px;\n  display: flex;\n  flex-wrap: wrap;\n  margin-top: 5px;\n  border: 1px solid #ddd;\n  padding: 12px;\n  border-radius: 5px;\n  position: absolute;\n  background: white;\n  z-index: 10;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);\n}\n\n.month {\n  width: calc(33.3333333333% - 20px);\n  text-align: center;\n  padding: 4px 10px;\n  margin: 0;\n  cursor: pointer;\n  border: 0;\n}\n.month.start-month {\n  background-color: #007bff;\n  color: white;\n  border-top-left-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\n.month.end-month {\n  background-color: #007bff;\n  color: white;\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 4px;\n}\n.month.in-range, .month.hover-range {\n  background-color: #e0efff;\n}\n.month:hover {\n  background-color: #007bff;\n  color: white;\n  border-radius: 4px;\n}\n\n/*# sourceMappingURL=MonthRangePicker.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-0d9e5954";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector);

export { __vue_component__ as default };

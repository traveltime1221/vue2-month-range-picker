<template>
    <div class='month-range-picker' @click.stop>
        <!-- <h4>選擇月份範圍</h4> -->

        <!-- 單一輸入框 -->
        <div class='input-field'>
            <!-- <button @focus='openPanel'>開啟</button> -->
            <input type='button' v-model='displayText' :placeholder='placeholder' @click='openPanel'
                @blur='handleGlobalClick' />
        </div>

        <!-- 月份選擇面板  -->
        <div v-if='isPanelOpen' class='months-panel'>
            <div v-for='month in months' :key='month.id' :class='[ "month", {
                    "start-month": month.id === startMonth,
                    "end-month": month.id === endMonth,
                    "in-range": isInRange(month.id),
                    "hover-range": isHovering && isInHoverRange(month.id),
                },
            ]' @click='selectMonth(month)' @mouseover='handleHover(month.id)' @mouseleave='clearHover'>
                {{ month.name }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
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
            })
        }
        this.updateDisplayText()
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
            this.isClickingButton = true // 標記正在點擊按鈕
            this.isPanelOpen = true
            this.addGlobalClickListener()
            setTimeout(() => (this.isClickingButton = false), 200) // 延遲重置
        },
        closePanel () {
            this.isPanelOpen = false
            this.removeGlobalClickListener()
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
            this.isHovering = true
            this.hoverMonth = month
        },
        clearHover () {
            this.isHovering = false
            this.hoverMonth = null
        },
        addGlobalClickListener () {
            document.addEventListener('click', this.handleGlobalClick)
        },
        removeGlobalClickListener () {
            document.removeEventListener('click', this.handleGlobalClick)
        },
        handleGlobalClick (event) {
            // this.isPanelOpen = false;
            setTimeout(() => {
                // 如果不是點擊按鈕，才關閉選單
                if (!this.isClickingButton) {
                    this.isPanelOpen = false
                }
            }, 200)
            // if (!this.$el.contains(event.target)) {
            //   this.closePanel();
            // }
    }
  },
  beforeDestroy () {
    this.removeGlobalClickListener()
  }
}
</script>

<style lang='scss' scoped>
.month-range-picker {
    // padding: 20px;
    position: relative;

    .input-field input {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 5px;
        cursor: pointer;
        width: 100%;
        background: transparent;
        text-align: left;
    }
}

.months-panel {
    max-width: 220px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 5px;
    border: 1px solid #ddd;
    padding: 12px;
    border-radius: 5px;
    position: absolute;
    background: white;
    z-index: 10;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.month {
    width: calc(100% / 3 - 20px);
    text-align: center;
    padding: 4px 10px;
    margin: 0;
    cursor: pointer;
    border: 0;
    // border-radius: 5px;

    &.start-month {
        background-color: #007bff;
        color: white;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }

    &.end-month {
        background-color: #007bff;
        color: white;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }

    &.in-range,&.hover-range {
        background-color: #e0efff;
    }

    &:hover{
        background-color: #007bff;
        color: white;
        border-radius: 4px;
    }
}
</style>

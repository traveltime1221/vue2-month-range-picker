# vue2-month-range-picker

這是一個非常簡易而且只有選擇月份範圍的 Vue2 組件，支持更換月份格式。

![範例](https://github.com/traveltime1221/vue2-month-range-picker/raw/main/src/assets/image/example.gif)

## 安裝

### 環境
```
vue: ">=2.6.0 <2.7.0"
vue-template-compiler: ">=2.6.0 <2.7.0"
node: ">=12.0.0"
```

### 安裝方式
```
npm install vue2-month-range-picker
```

### 解決安裝衝突
如果專案包含 ESLint，安裝本套件時可能會遇到依賴衝突。可使用以下方法進行安裝處理：
```
npm install vue2-month-range-picker --legacy-peer-deps
```


## 使用方式

### 全域
於 main.js 註冊設定
```
import Vue from "vue";
import App from "./App.vue";
import MonthRangePicker from "vue2-month-range-picker"; // 引用

Vue.config.productionTip = false;
Vue.component("MonthRangePicker", MonthRangePicker); // 註冊

new Vue({
  render: (h) => h(App),
}).$mount("#app");
```

前往 page.vue 引用
```
<template>
  <div id="app">
    <MonthRangePicker
        :monthFormat="monthFormat"
        :startMonth="startMonth"
        :endMonth="endMonth"
        placeholder="請選擇月份範圍"
        @update:startMonth="startMonth = $event"
        @update:endMonth="endMonth = $event"/>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      monthFormat: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    };
  },
};
</script>
```

### 局部
```
<template>
  <div id="app">
    <MonthRangePicker
        :monthFormat="monthFormat"
        :startMonth="startMonth"
        :endMonth="endMonth"
        placeholder="請選擇月份範圍"
        @update:startMonth="startMonth = $event"
        @update:endMonth="endMonth = $event"/>
  </div>
</template>

<script>
import MonthRangePicker from "vue2-month-range-picker"; // 引用
export default {
  name: "App",
  components: {
    MonthRangePicker, // 於此註冊
  },
  data() {
    return {
      monthFormat: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    };
  },
};
</script>
```

## 屬性
|  參數 | 類型 | 描述 | 
| -------- | -------- | -------- | 
| monthFormat    | Array     | 使用者預設月份格式, 若無攜帶系統則預設英文格式：['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']    | 
| startMonth    | String     | 預設、傳遞選擇起始月份    |
| endMonth    | String     | 預設、傳遞選擇結束月份    | 
| placeholder    | String     | 提示, 無攜帶系統預設為空值    | 


## 版本歷程

* 1.0.0 第一次發布

## License
MIT

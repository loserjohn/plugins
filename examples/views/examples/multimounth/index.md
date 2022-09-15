<!--
 * @Author       : xh
 * @Date         : 2022-06-21 19:45:09
 * @LastEditors  : xh
 * @FileName     :
-->

## 示例

#### 默认,不必选，没有默认值

:::demo

```html
<template>
  <h4>{{ JSON.stringify(mounth) }}</h4>
  <yp-mounth-picker v-model="mounth" :yearlength="20" show-sum />
</template>

<script>
  export default {
    name: 'IndexPages',
    data: function () {
      return {
        mounth: [],
        mounth1: [],
        mounth2: ['2022-02', '2021-05'],
        mounth3: ['2022-02', '2021-05']
      }
    }
  }
</script>
```

:::

#### 必选（默认选中当前时间）

:::demo

```html
<h4>{{ JSON.stringify(mounth1) }}</h4>
<yp-mounth-picker v-model="mounth1" :yearlength="40" required />
```

:::

#### 预制时间,非必选

:::demo

```html
<h4>{{ JSON.stringify(mounth2) }}</h4>
<yp-mounth-picker v-model="mounth2" :yearlength="40" show-tips />
```

:::

#### 预制时间,必选

:::demo

```html
<h4>{{ JSON.stringify(mounth3) }}</h4>
<yp-mounth-picker v-model="mounth3" :yearlength="10" required />
```

:::

## 参数

### props

| 参数名     | 必填  | 默认值 |                                 描述 |
| ---------- | :---: | -----: | -----------------------------------: |
| value      | true  |     [] |                     v-model 绑定的值 |
| yearlength | false |     20 |        获取 前多少年的数据 默认为 20 |
| required   | false |  false | 是否 是必选 是的话 默认 当前月份必选 |
| showTip    | false |  false |                       否显示提示图标 |
| showSum    | false |        |                         是否显示总数 |

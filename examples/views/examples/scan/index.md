<!--
 * @Author       : xh
 * @Date         : 2022-06-21 19:45:09
 * @LastEditors  : xh
 * @FileName     :
-->

## 城市筛选组件

#### 默认

:::demo

```html
<template>
  <div>
    <h5><el-button class="btns" clas size="mini" type="primary" @click="setValue(0)">设置默认值</el-button></h5>
    <yp-city ref="demo0" @change="change" />
  </div>
</template>

<script>
  export default {
    name: 'IndexPages',
    data: function () {
      return {
        value: 0,
        region: '',
        result: ''
      }
    },
    created() {},
    methods: {
      change(v) {
        this.result = v
      },
      setValue(key) {
        switch (key) {
          case 0:
            this.$refs.demo0.setValue('430000')
            console.log('demodata', '430000')
            break
          case 1:
            this.$refs.demo1.setValue(['530400'], true)
            console.log('demodata', ['530400'])
            break
          case 2:
            this.$refs.demo2.setValue(['130304'], true)
            console.log('demodata', ['130304'])
            break
          case 3:
            this.$refs.demo3.setValue(['430000', '350000', '360000'])
            console.log('demodata', ['430000', '350000', '360000'])
            break
          case 4:
            this.$refs.demo4.setValue(['530400', '150300', '110102'], true)
            console.log('demodata', ['530400', '150300', '110102'])
            break

          case 5:
            this.$refs.demo5.setValue(['110102', '130606', '140921', '120103', '820003'], true)
            console.log('demodata', ['110102', '130606', '140921', '120103', '820003'])
            break
          case 6:
            // debugger
            this.$refs.demo6.setValue(['110000', '130000', '140000'])
            console.log('demodata', ['110000', '130000', '140000'])
            break
          case 7:
            this.$refs.demo7.setValue([
              ['110000', '110102'],
              ['110000', '110105'],
              ['130000', '130600', '130606'],
              ['140000', '140900', '140921']
            ])
            console.log('demodata', [
              ['110000', '110102'],
              ['110000', '110105'],
              ['130000', '130600', '130606'],
              ['140000', '140900', '140921']
            ])
            break
          case 8:
            this.$refs.demo8.setValue([
              ['110000', '110102'],
              ['110000', '110105'],
              ['130000', '130600', '130606'],
              ['140000', '140900', '140921']
            ])
            console.log('demodata', [
              ['110000', '110102'],
              ['110000', '110105'],
              ['130000', '130600', '130606'],
              ['140000', '140900', '140921']
            ])
            break
          case 9:
            this.$refs.demo9.setValue('130000')
            console.log('demodata', '130000')
            break
          case 10:
            this.$refs.demo10.setValue(['110000', '110102'])
            console.log('demodata', ['110000', '110102'])
            break
          case 11:
            this.$refs.demo11.setValue(['130000', '130600', '130606'])
            console.log('demodata', ['130000', '130600', '130606'])
            break
          default:
            break
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btns {
    /* margin-left: 30px; */
  }
</style>
```

:::

#### 省市

:::demo

```html
<template>
  <div>
    <!-- <pre v-if="result">
   
      {{ JSON.stringify(result) }}
    </pre> -->
    <h5><el-button class="btns" clas size="mini" type="primary" @click="setValue(1)">设置默认值</el-button></h5>
    <yp-city ref="demo1" :type="2" @change="change" />
  </div>
</template>
```

:::

#### 省市区

:::demo

```html
<template>
  <div>
    <!-- <pre v-if="result">
   
      {{ JSON.stringify(result) }}
    </pre> -->
    <h5><el-button class="btns" clas size="mini" type="primary" @click="setValue(2)">设置默认值</el-button></h5>
    <yp-city ref="demo2" :type="3" @change="change" />
  </div>
</template>
```

:::

#### 默认,多选，自动构建上级

:::demo

```html
<template>
  <div>
    <!-- <pre v-if="result">
   
      {{ JSON.stringify(result) }}
    </pre> -->
    <h5><el-button class="btns" clas size="mini" type="primary" @click="setValue(3)">设置默认值</el-button></h5>
    <yp-city ref="demo3" multiple @change="change" />
  </div>
</template>
```

:::

#### 省市,多选，自动构建上级

:::demo

```html
<template>
  <div>
    <!-- <pre v-if="result">
   
      {{ JSON.stringify(result) }}
    </pre> -->
    <h5><el-button class="btns" clas size="mini" type="primary" @click="setValue(4)">设置默认值</el-button></h5>
    <yp-city ref="demo4" :type="2" multiple @change="change" />
  </div>
</template>
```

:::

#### 省市区,多选，自动构建上级

:::demo

```html
<template>
  <div>
    <!-- <pre v-if="result">
   
      {{ JSON.stringify(result) }}
    </pre> -->
    <h5><el-button class="btns" clas size="mini" type="primary" @click="setValue(5)">设置默认值</el-button></h5>
    <yp-city ref="demo5" :type="3" multiple @change="change" />
  </div>
</template>
```

:::

---

#### 默认原始数据，多选

:::demo

```html
<template>
  <div>
    <!-- <pre v-if="result">
   
      {{ JSON.stringify(result) }}
    </pre> -->
    <h5><el-button class="btns" clas size="mini" type="primary" @click="setValue(6)">设置默认值</el-button></h5>
    <yp-city ref="demo6" multiple @change="change" />
  </div>
</template>
```

:::

#### 省市,原始数据，多选

:::demo

```html
<template>
  <div>
    <!-- <pre v-if="result">
   
      {{ JSON.stringify(result) }}
    </pre> -->
    <h5><el-button class="btns" clas size="mini" type="primary" @click="setValue(7)">设置默认值</el-button></h5>
    <yp-city ref="demo7" multiple :type="2" @change="change" />
  </div>
</template>
```

:::

#### 省市区,原始数据，多选

:::demo

```html
<template>
  <div>
    <!-- <pre v-if="result">
   
      {{ JSON.stringify(result) }}
    </pre> -->
    <h5><el-button class="btns" clas size="mini" type="primary" @click="setValue(8)">设置默认值</el-button></h5>
    <yp-city ref="demo8" multiple :type="3" @change="change" />
  </div>
</template>
```

:::

#### 默认原始数据，单选

:::demo

```html
<template>
  <div>
    <!-- <pre v-if="result">
   
      {{ JSON.stringify(result) }}
    </pre> -->
    <h5><el-button class="btns" clas size="mini" type="primary" @click="setValue(9)">设置默认值</el-button></h5>
    <yp-city ref="demo9" @change="change" />
  </div>
</template>
```

:::

#### 省市,原始数据，单选

:::demo

```html
<template>
  <div>
    <!-- <pre v-if="result">
   
      {{ JSON.stringify(result) }}
    </pre> -->
    <h5><el-button class="btns" clas size="mini" type="primary" @click="setValue(10)">设置默认值</el-button></h5>
    <yp-city ref="demo10" :type="2" @change="change" />
  </div>
</template>
```

:::

#### 省市区,原始数据，单选

:::demo

```html
<template>
  <div>
    <!-- <pre v-if="result">
   
      {{ JSON.stringify(result) }}
    </pre> -->
    <h5><el-button class="btns" clas size="mini" type="primary" @click="setValue(11)">设置默认值</el-button></h5>
    <yp-city ref="demo11" :type="3" @change="change" />
  </div>
</template>
```

:::

---

## 参数

### props

| 参数名        | 必填  |                  默认值 |                     描述 |
| ------------- | :---: | ----------------------: | -----------------------: |
| type          | true  |                       1 | 1 省 、2 省市 、3 省市区 |
| filterable    | false |                   false |               是否可搜索 |
| multiple      | false |                   false |                 是否多选 |
| disabled      | false |                   false |                 是否禁用 |
| value         | false | [String, Number, Array] |               v-model 值 |
| placeholder   | false |                         |                 文字提示 |
| customerStyle | false |                      {} |             进度条背景色 |

### ref 调用 emit

| 参数名    |         参数         |                                    描述 |
| --------- | :------------------: | --------------------------------------: |
| setValue  | v, treeLevel = false | v:预设的值； treeLevel 是否自动构建上级 |
| resetVale |         null         |                                重置选项 |

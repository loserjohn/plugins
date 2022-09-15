<!--
 * @Author       : xh
 * @Date         : 2022-06-21 19:45:09
 * @LastEditors  : xh
 * @FileName     :
-->

## skulist 生成器

:::demo

```html
<template>
  <div>
    <div class="footer">
      <el-button @click="getRes">获取</el-button>
      <el-button @click="setRes">预制赋值</el-button>
      <el-button @click="reset">清除数据</el-button>
    </div>
    <div v-if="defaultdata" class="skudemo">
      <pre>{{ defaultdata }}</pre>
    </div>
    <yp-skus ref="skus" @update="updatevalue" />
  </div>
</template>

<script>
  export default {
    name: 'IndexPages',
    data: function () {
      return {
        value: 0,
        defaultdata: ''
      }
    },
    created() {
      let that = this
      setTimeout(() => {
        that.value = 20
      }, 1000)
    },
    methods: {
      getRes() {
        const res = this.$refs.skus.getResult()
        console.log('skulist结果', res)
      },
      reset() {
        // 清除数据
        this.defaultdata = {
          goods_parameter: [],
          goods_spec: []
        }

        this.$refs.skus.setResult(this.defaultdata)
      },
      updatevalue() {},
      setRes() {
        this.defaultdata = {
          goods_parameter: [
            {
              name: '新增规格1',
              checked: true,
              list: [
                {
                  name: '新增属性',
                  pic: '',
                  checked: true
                },
                {
                  name: '新增属性2',
                  pic: '',
                  checked: false
                }
              ]
            },
            {
              name: '新增规格2',
              checked: true,
              list: [
                {
                  name: '新增属性3',
                  pic: '',
                  checked: true
                },
                {
                  name: '新增属性4',
                  pic: '',
                  checked: true
                }
              ]
            }
          ],
          goods_spec: [
            {
              skus_difference: ['新增属性1', '新增属性3'],
              skus_origin: 100,
              skus_price: 90,
              skus_stock: 50,
              sale_price: 0,
              sale_stock: 0,
              id: 0
            },
            {
              skus_difference: ['新增属性1', '新增属性4'],
              skus_origin: 100,
              skus_price: 90,
              skus_stock: 50,
              sale_price: 0,
              sale_stock: 0,
              id: 0
            }
          ]
        }

        this.$refs.skus.setResult(this.defaultdata)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .footer {
    display: flex;
    margin-top: 50px;
  }
  .skudemo {
    background: #f5ffff;
    margin-top: 20px;
  }
</style>
```

:::

## 参数

### ref emit

> 此组件采用 ref 调用

| 参数名      | 必填  |                             返回值 |          描述 |
| ----------- | :---: | ---------------------------------: | ------------: |
| getResult   | true  | {goods_parameter:[],goods_spec:[]} | 获取 sku 结果 |
| setResult   | false |                                    | 设置 sku 结果 |
| resetResult | false |                                    | 充值 sku 结果 |

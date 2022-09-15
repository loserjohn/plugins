<template>
  <div>
    <!-- 省市区选择封装 -->
    <div v-if="type === 1">
      <el-select v-model="val" placeholder="请选择省份" filterable :multiple="multiple" clearable :style="customerStyle" @change="changeSelectCity">
        <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
    </div>
    <div v-else>
      <el-cascader v-model="val" :options="options" placeholder="请选择省市" :props="cprop" clearable :style="customerStyle" @change="changeSelectCity" />
    </div>
  </div>
</template>
<script>
const cityList = require('province-city-china/dist/level.json')
// import cityList from '@/utils/citys'

const only = ['82', '81', '50', '31', '12', '11'] //特殊省份

// console.log(cityList)
export default {
  name: 'yp-city',
  props: {
    type: {
      default: 1,
      type: Number
    },
    filterable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array],
      default: ''
    },

    placeholder: {
      type: String,
      default: '请选择'
    },
    customerStyle: {
      type: Object,
      default() {
        return {}
      }
    }
    // defaultValue: {
    //   type: [Number, String, Array]
    // }
  },
  data() {
    return {
      cityList: cityList, //省市区文件
      val: this.type == 1 ? '' : [],

      options: [],
      cprop: {
        value: 'code',
        label: 'name',
        children: 'children',
        multiple: this.multiple
      }
    }
  },
  watch: {},

  mounted() {
    this.getSelectOption()
  },
  methods: {
    //@xh专属注释
    //@name:直接设置 默认值   溯级处理
    //@params: treeLevel true-需要溯级   false  直接赋值
    //@des:
    setValue(v, treeLevel = false) {
      if (this.multiple && (typeof v == 'string' || typeof v == 'number')) {
        console.error('多选状态下 ,默认值必须为数组')
        return
      }
      if (!treeLevel) {
        if (this.multiple) {
          // debugger
          let arr = []
          switch (this.type) {
            case 1:
              this.val = v
              // debugger
              break
            case 2:
              arr = v.map((it) => {
                return this.code2area(it[it.length - 1])
              })
              this.val = arr
              break
            case 3:
              arr = v.map((it) => {
                return this.code2area(it[it.length - 1])
              })
              this.val = arr
              break
            default:
              break
          }
        } else {
          this.val = v
          // debugger
        }
      } else {
        let arr
        //自动构造数据
        switch (this.type) {
          case 1:
            // 省级
            this.val = v
            break
          case 2:
            // 省级 市级
            arr = v.map((it) => {
              return this.code2area(it)
            })
            if (this.multiple) {
              this.val = arr
            } else {
              this.val = arr[0]
            }
            break
          case 3:
            // 省级 市级 县级
            arr = v.map((it) => {
              return this.code2area(it)
            })
            if (this.multiple) {
              this.val = arr
            } else {
              this.val = arr[0]
            }
            break
          default:
            break
        }
      }
    },

    // 地域编码 转为三位地域数组地区多选用到
    arr2area(arr) {
      if (!arr[0]) {
        return
      }
      const str = arr[0]
      let a = str.slice(0, 2)
      let b = str.slice(2, 4)
      let c = str.slice(4, 6)
      c = `${a}${b}${c}`
      b = `${a}${b}00`
      a = `${a}0000`
      return [a, b, c].slice(0, this.type)
    },
    code2area(str) {
      let a = str.slice(0, 2)
      let b = str.slice(2, 4)
      let c = str.slice(4, 6)
      let spec = only.includes(a)
      c = `${a}${b}${c}`
      b = `${a}${b}00`
      a = `${a}0000`
      if (spec) {
        // 特殊省份
        return [a, c].slice(0, this.type)
      } else {
        return [a, b, c].slice(0, this.type)
      }
    },

    //@xh专属注释
    //@name:
    //@params:
    //@des:重置
    resetVale() {
      if (this.type === 1) {
        this.val = ''
      } else {
        this.val = []
      }
    },

    //@xh专属注释
    //@name:
    //@params:
    //@des:初始化选型
    getSelectOption() {
      // 如果是1 只拿省的数据
      if (this.type === 1) {
        this.getProvinceList()
      } else if (this.type === 2) {
        this.getCityList()
      } else {
        this.options = this.cityList
      }
    },

    // 获取省分下拉
    getProvinceList() {
      let res = []
      this.cityList.forEach((item) => {
        let obj = {}
        obj.code = item.code
        obj.name = item.name
        res.push(obj)
      })
      this.options = res
    },

    // 获取省市数据
    getCityList() {
      let res = []
      this.cityList.forEach((item) => {
        let obj = {
          code: '',
          name: '',
          children: []
        }
        obj.code = item.code
        obj.name = item.name
        item.children.forEach((val) => {
          let or = {}
          or.code = val.code
          or.name = val.name
          obj.children.push(or)
        })
        res.push(obj)
      })
      this.options = res
    },
    // 结果返回
    changeSelectCity(val) {
      console.log(val)
      let res = {
        data: val,
        result: null
      }
      if (this.multiple) {
        switch (this.type) {
          case 1:
            // 省级
            res = {
              data: val,
              result: val
            }
            break
          case 2:
            // 省级 市级
            res = {
              data: val,
              result: val.map((it) => {
                return it[1]
              })
            }
            break
          case 3:
            // 省级 市级 县级
            res = {
              data: val,
              result: val.map((it) => {
                return it[it.length - 1]
              })
            }
            break
          default:
            break
        }
      } else {
        if (this.type == 1) {
          res = {
            data: val,
            result: val
          }
        } else {
          res = {
            data: val,
            result: val[val.length - 1]
          }
        }
      }
      this.$emit('change', res)
      // debugger
    }
  }
}
</script>

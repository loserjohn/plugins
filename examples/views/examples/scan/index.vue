<!--
 * @Author       : xh
 * @Date         : 2022-06-21 20:06:49
 * @LastEditors  : xh
 * @FileName     :   
-->
<template>
  <div>
    <h3>城市筛选组件</h3>
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <h5>默认 <el-button class="btns" clas size="mini" type="primary" @click="setValue(0)">设置默认值</el-button></h5>
        <yp-city ref="demo0" @change="change" />
        <h5>省市<el-button class="btns" size="mini" type="primary" @click="setValue(1)">设置默认值</el-button></h5>
        <yp-city ref="demo1" :type="2" @change="change" />
        <h5>省市区<el-button class="btns" size="mini" type="primary" @click="setValue(2)">设置默认值</el-button></h5>
        <yp-city ref="demo2" :type="3" @change="change" />
        <el-divider></el-divider>
        <h5>默认,多选，自动构建上级<el-button class="btns" size="mini" type="primary" @click="setValue(3)">设置默认值</el-button></h5>
        <yp-city ref="demo3" multiple @change="change" />
        <h5>省市,多选，自动构建上级<el-button class="btns" size="mini" type="primary" @click="setValue(4)">设置默认值</el-button></h5>
        <yp-city ref="demo4" :type="2" multiple @change="change" />
        <h5>省市区,多选，自动构建上级<el-button class="btns" size="mini" type="primary" @click="setValue(5)">设置默认值</el-button></h5>
        <yp-city ref="demo5" :type="3" multiple @change="change" />
      </el-col>
      <el-col :span="12" :offset="0">
        <h5>默认原始数据，多选<el-button class="btns" size="mini" type="primary" @click="setValue(6)">设置默认值</el-button></h5>
        <yp-city ref="demo6" multiple @change="change" />
        <h5>省市,原始数据，多选<el-button class="btns" size="mini" type="primary" @click="setValue(7)">设置默认值</el-button></h5>
        <yp-city ref="demo7" multiple :type="2" @change="change" />
        <h5>省市区,原始数据，多选<el-button class="btns" size="mini" type="primary" @click="setValue(8)">设置默认值</el-button></h5>
        <yp-city ref="demo8" multiple :type="3" @change="change" />
        <el-divider></el-divider>
        <h5>默认原始数据，单选<el-button class="btns" size="mini" type="primary" @click="setValue(9)">设置默认值</el-button></h5>
        <yp-city ref="demo9" @change="change" />
        <h5>省市,原始数据，单选<el-button class="btns" size="mini" type="primary" @click="setValue(10)">设置默认值</el-button></h5>
        <yp-city ref="demo10" :type="2" @change="change" />
        <h5>省市区,原始数据，单选<el-button class="btns" size="mini" type="primary" @click="setValue(11)">设置默认值</el-button></h5>
        <yp-city ref="demo11" :type="3" @change="change" />
      </el-col>
    </el-row>

    <h4>返回结果</h4>
    <pre>
      
      {{ JSON.stringify(result) }}
    </pre>
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
          break
        case 1:
          this.$refs.demo1.setValue(['530400'], true)
          break
        case 2:
          this.$refs.demo2.setValue(['130304'], true)
          break
        case 3:
          this.$refs.demo3.setValue(['430000', '350000', '360000'])
          break
        case 4:
          this.$refs.demo4.setValue(['530400', '150300', '110102'], true)
          break

        case 5:
          this.$refs.demo5.setValue(['110102', '130606', '140921', '120103', '820003'], true)
          break
        case 6:
          // debugger
          this.$refs.demo6.setValue(['110000', '130000', '140000'])
          break
        case 7:
          this.$refs.demo7.setValue([
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
          break
        case 9:
          this.$refs.demo9.setValue('130000')
          break
        case 10:
          this.$refs.demo10.setValue(['110000', '110102'])
          break
        case 11:
          this.$refs.demo11.setValue(['130000', '130600', '130606'])
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
  margin-left: 30px;
}
</style>

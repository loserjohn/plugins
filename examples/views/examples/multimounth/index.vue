<!--
 * @Author       : xh
 * @Date         : 2022-06-21 20:06:49
 * @LastEditors  : xh
 * @FileName     :   
-->
<template>
  <div>
    <h3>月份多选</h3>

    <h4>{{ JSON.stringify(mounth) }}</h4>
    <h5>默认,不必选，没有默认值</h5>
    <yp-mounth-picker v-model="mounth" :yearlength="20" show-sum />
    <el-divider></el-divider>
    <h4>{{ JSON.stringify(mounth1) }}</h4>
    <h5>必选（默认选中当前时间）</h5>
    <yp-mounth-picker v-model="mounth1" :yearlength="40" required />
    <el-divider></el-divider>
    <h4>{{ JSON.stringify(mounth2) }}</h4>
    <h5>预制时间,非必选</h5>
    <yp-mounth-picker v-model="mounth2" :yearlength="40" show-tips />
    <el-divider></el-divider>
    <h4>{{ JSON.stringify(mounth3) }}</h4>
    <h5>预制时间,必选</h5>
    <yp-mounth-picker v-model="mounth3" :yearlength="10" required />
  </div>
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

<style lang="scss" scoped>
.box-card {
  margin-bottom: 10px;
  overflow: auto;
}
</style>

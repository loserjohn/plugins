<!--
 * @Author       : xh
 * @Date         : 2022-06-21 20:06:49
 * @LastEditors  : xh
 * @FileName     :   
-->
<template>
  <div>
    <h3>快捷月份筛选</h3>
    <YpMounthRanges />

    <div id="demo"></div>
  </div>
</template>

<script>
// import Vue from 'vue'
// import YpDan from '~/dan/dan.vue'
export default {
  name: 'IndexHome',
  components: {},
  data: function () {
    return {
      value: 0
    }
  },
  mounted() {
    // const a = new Vue({
    //   render: (h) => h(YpDan)
    // }).$mount()
    // console.log(a)
  }
}
</script>

<style lang="scss" scoped></style>

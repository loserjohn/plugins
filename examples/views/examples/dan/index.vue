<!--
 * @Author       : xh
 * @Date         : 2022-06-21 20:06:49
 * @LastEditors  : xh
 * @FileName     :   
-->
<template>
  <div>
    <h3>子弹图组件</h3>
    <YpDan title="默认" />

    <YpDan title="客户" :value="value" :target="79" active-color="#ca731a" back-color="#f9dfc5" />

    <YpDan title="客户" :value="80" :target="12" target-color="red" />

    <YpDan title="默认" active-color="-webkit-linear-gradient(right, rgb(236, 112, 149), rgb(51, 66, 231), rgb(18, 173, 162), rgb(236, 112, 149))" back-color="-webkit-linear-gradient(right, rgb(255, 255, 255), rgb(245, 215, 237), rgb(255, 255, 255), rgb(245, 215, 237))" stip-text="示例1" target-color="yellow" target-text="示例2" />

    <!-- <YpDan title="默认" active-color="#6fd86d" :value="50" :target="34" back-color="#d5fdd5" stip-text="示例1" target-text="示例2">
      <div slot="title">插槽 title</div>
      <div slot="current">插槽 current</div>
      <div slot="right">插槽 right</div>
      <div slot="target">插槽 target</div>
    </YpDan> -->
  </div>
</template>

<script>
export default {
  name: 'IndexHome',
  data: function () {
    return {
      value: 0
    }
  },
  created() {
    let that = this
    setTimeout(() => {
      that.value = 20
    }, 1000)
  }
}
</script>

<style lang="scss" scoped></style>

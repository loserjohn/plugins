/*
 * @Author       : xh
 * @Date         : 2022-06-21 20:10:24
 * @LastEditors  : xh
 * @FileName     :
 */
import Skus from './skus.vue'
Skus.install = function (Vue) {
  // extend组件构造器
  // const newTables = Vue.extend(Tables)
  Vue.component('YpSkus', Skus)
  console.log('执行注册函数', 'Skus')
}

export default Skus

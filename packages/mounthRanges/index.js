/*
 * @Author       : xh
 * @Date         : 2022-06-21 20:10:24
 * @LastEditors  : xh
 * @FileName     :
 */
import Compenents from './mounthRanges.vue'
Compenents.install = function (Vue) {
  // extend组件构造器
  // const newTables = Vue.extend(Tables)
  Vue.component('YpMounthRanges', Compenents)
  console.log('执行注册函数', 'yp-mounthRanges')
}

export default Compenents

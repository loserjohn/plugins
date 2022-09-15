/*
 * @Author       : xh
 * @Date         : 2022-06-21 19:59:42
 * @LastEditors  : xh
 * @FileName     :
 */
import Citys from './citys.vue'
Citys.install = function (Vue) {
  // extend组件构造器
  // const newTables = Vue.extend(Tables)
  Vue.component('YpCity', Citys)
  console.log('执行注册函数', 'yp-city')
}

export default Citys

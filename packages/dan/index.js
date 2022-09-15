/*
 * @Author       : xh
 * @Date         : 2022-06-21 20:10:24
 * @LastEditors  : xh
 * @FileName     :
 */
import Dan from './dan.vue'
Dan.install = function (Vue) {
  // extend组件构造器
  // const newTables = Vue.extend(Tables)
  Vue.component('YpDan', Dan)
  console.log('执行注册函数', 'yp-dan')
}

export default Dan

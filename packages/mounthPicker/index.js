/*
 * @Author       : xh
 * @Date         : 2022-06-21 20:10:24
 * @LastEditors  : xh
 * @FileName     :
 */
import MounthPicker from './mounthPicker.vue'
MounthPicker.install = function (Vue) {
  // extend组件构造器
  // const newTables = Vue.extend(Tables)
  Vue.component('YpMounthPicker', MounthPicker)
  console.log('执行注册函数', 'yp-mounth-picker')
}

export default MounthPicker

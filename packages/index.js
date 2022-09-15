/*
 * @Author       : xh
 * @Date         : 2022-06-21 19:59:42
 * @LastEditors  : xh
 * @FileName     :
 */
import Citys from './citys/citys.vue'
// import Buttons from './buttons/buttons.vue'
import Dan from './dan/dan.vue'
import MounthPicker from './mounthPicker/mounthPicker.vue'
import MounthRanges from './mounthRanges/mounthRanges.vue'
import Skus from './skus/skus.vue'
import './style/common.css'

const install = function (Vue) {
  // extend组件构造器
  // const newTables = Vue.extend(Tables)
  Vue.component('YpCity', Citys)
  // Vue.component('XhButtons', Buttons)
  Vue.component('YpDan', Dan)
  Vue.component('YpMounthPicker', MounthPicker)
  Vue.component('YpSkus', Skus)
  Vue.component('YpMounthRanges', MounthRanges)
}

// 注入 Vue
if (typeof window.Vue !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  Citys,
  // Buttons,
  Dan,
  MounthPicker,
  Skus
}

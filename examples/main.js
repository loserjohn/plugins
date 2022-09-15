/*
 * @Author       : xh
 * @Date         : 2022-06-21 19:45:09
 * @LastEditors  : xh
 * @FileName     :
 */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'github-markdown-css'
import 'highlight.js/styles/github.css'
import Vue from 'vue'
import Yp from '../packages/index'
import App from './App.vue'
import './assets/common.scss'
import DemoBlock from './components/DemoBlock.vue'
import router from './router'
// import xh_plugins from 'xh_plugins'
// import 'xh_plugins/lib/xh.css'
Vue.component('DemoBlock', DemoBlock)

Vue.config.productionTip = false
Vue.use(ElementUI)
// Vue.use(xh_plugins)
// import Tables from '../lib/tables/tableTest.umd.min.js'
// Vue.use(Tables)

// import xHui from '../lib/index/index.js'

Vue.use(Yp)
Vue.component('DemoBlock', DemoBlock)
// Vue.use(vueCardsDemo)
import request from './utils/request'
Vue.prototype.$request = request
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')

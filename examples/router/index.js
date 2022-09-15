/*
 * @Author       : xh
 * @Date         : 2022-06-21 19:45:09
 * @LastEditors  : xh
 * @FileName     :
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Home from '@/views/home'

export const constantRoutes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/dan',
    name: 'dan',
    component: () => import(/* webpackChunkName: "about" */ '@/views/examples/dan/index.md')
  },

  {
    path: '/multimounth',
    name: 'multimounth',
    component: () => import(/* webpackChunkName: "about" */ '@/views/examples/multimounth/index.md')
  },
  {
    path: '/skus',
    name: 'skus',
    component: () => import(/* webpackChunkName: "about" */ '@/views/examples/skus/index.md')
  },
  {
    path: '/citys',
    name: 'citys',
    component: () => import(/* webpackChunkName: "about" */ '@/views/examples/citys/index.md')
  },
  {
    path: '/mounthRanges',
    name: 'mounthRanges',
    component: () => import(/* webpackChunkName: "about" */ '@/views/examples/mounthRanges/index.vue')
  }
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import(/* webpackChunkName: "about" */ '@/docs/test1.md')
  // }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export default router

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routers = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    meta: {},
    component: ()=> import(/* webpackChunkName: 'home' */ './../views/home.vue')
  }
]

const routerConfig = {
  mode: '{{page-spa-mode}}',
  base: '{{page-spa-base}}',
  routes: routers,
  scrollBehavior (to, from, savedPosition) {
    // 滑动到指定位置
    if (to.meta.keepAliveScrollTop > 0) {
      document.querySelector('#app').scrollTop = to.meta.keepAliveScrollTop
      return {x: 0, y: 0}
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
}

const router = new Router(routerConfig)

export default router

import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

import Frame1 from './views/frame1'
import './style.css'

Vue.use(Router)
Vue.use(Meta)
export default new Router({
  mode: 'history',
  routes: [
    {
      name: 'Frame1',
      path: '/frame1',
      component: Frame1,
    },
  ],
})

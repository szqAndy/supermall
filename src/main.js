import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false

// 在原型上添加事件总线的属性，赋值的是一个vue的实例作为事件的总线
Vue.prototype.$bus = new Vue()

// 安装toast插件
Vue.use(toast)

// 解决移动端300ms延迟
Fastclick.attach(document.body)

// 使用图片懒加载插件
  Vue.use(VueLazyLoad, {
    loading: require('./assets/img/common/placeholder.png') // 占位图片 加载中显示
  });

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

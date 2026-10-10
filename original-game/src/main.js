import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/base.scss'

// The original author's feedback server (couy.xyz) is not used in this build: the game is fully offline.
Vue.prototype.$api = { post: () => Promise.reject(new Error('offline')) }

const vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Message from './views/uiComponent/message/index'
Vue.prototype.$message = Message

Vue.prototype.$deepCopy = function(data){
  data = JSON.stringify(data).length>1?data:{}
  return JSON.parse(JSON.stringify(data))
}

export default vue;
import Vue from 'vue'
import App from './App'
// 1. 导入 store 的实例对象
import store from './components/store/store.js'
// 导入网络请求的包
import {
  $http
} from '@escook/request-miniprogram'
// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

// 请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 请求开始之前做一些事情(请求拦截器)
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...'
  })
  // 判断请求的是否为有权限的 API 接口
  if (options.url.indexOf('/my/') !== -1) {
    // 为请求头添加身份认证字段
    options.header = {
      // 字段的值可以直接从 vuex 中进行获取
      Authorization: store.state.m_user.token,
    }
  }
}
// 请求完成之后做一些事情(响应拦截器)
$http.afterRequest = function() {
  uni.hideLoading()
}
// 封装弹框的方法
uni.$showMsg = function(title = '数据请求失败!', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  // 2. 将 store 挂载到 Vue 实例上
  store,
})
app.$mount()

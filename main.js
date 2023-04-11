import App from './App'
// uView
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

import request from '@/utils/request'
// 将创建好的请求实例挂载在 uni 对象上
uni.$ajax = request
//全局方法
import {
	parseTime,handleTree
} from '@/utils/common'
Vue.prototype.parseTime = parseTime
Vue.prototype.handleTree = handleTree
import {
	handleCampusUrl,
	diffTime,
	handelTimeFormat
} from '@/utils/campus'
Vue.prototype.handleCampusUrl = handleCampusUrl
Vue.prototype.diffTime = diffTime
Vue.prototype.handelTimeFormat = handelTimeFormat
import MyConfig from "config.js"
 
Vue.prototype.MyConfig = MyConfig;

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif

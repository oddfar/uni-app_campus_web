import ajax from '@/uni_modules/u-ajax'
import {
	getToken,
	removeToken
} from '@/utils/auth'

import {
	toast
} from '@/utils/common'
import config from '@/config'

const baseUrl = config.baseURL
// 创建请求实例
const instance = ajax.create({
	// 默认配置
	baseURL: baseUrl,

})

// 添加请求拦截器
instance.interceptors.request.use(
	config => {
		// 在发送请求前做些什么
		const isToken = config.header['isToken'] === false
		if (getToken() && !isToken) {
			config.header['Authorization'] = 'Bearer ' + getToken()
		}
		// console.log('发送请求前', config)
		return config
	},
	error => {
		// 对请求错误做些什么
		// console.log('发请求错误', error)
		uni.showToast({
			icon: 'error',
			title: '后端接口请求异常'
		})
		return Promise.reject(error)
	}
)

// 添加响应拦截器
instance.interceptors.response.use(
	//响应成功后
	response => {
		// console.log('响应成功后', response)
		// 未设置状态码则默认成功状态
		const code = response.data.code || 200;
		// 获取错误信息
		const msg = response.data.msg
		if (code == 401) {
			removeToken();
			uni.showModal({
				title: '提示',
				content: '登录状态已过期，您可以继续留在该页面，或者重新登录?',
				confirmText: '登录',
				success: function (res) {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/me/me'
						})
						return Promise.reject("")
					} else if (res.cancel) {
						// console.log('用户点击取消');
					}
				}
			});
			toast('无效的会话，或者会话已过期，请重新登录。')
			return Promise.reject("无效的会话，或者会话已过期，请重新登录。")
		} else if (code == 500) {
			toast(msg)
			return Promise.reject(msg)
		} else if (code !== 200) {
			toast(msg)
			return Promise.reject(msg)
		}
		return response
	},
	error => {
		// 对响应错误做些什么
		uni.showToast({
			icon: 'error',
			title: '后端接口响应异常'
		})
		// console.log('响应错误后', error)
		return Promise.reject(error)
	}
)

export default instance

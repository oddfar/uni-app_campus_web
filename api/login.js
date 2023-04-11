import request from '@/utils/request'

//设置code
export const setWxampCode = (uuid, code) => {
	return request({
		url: '/wxampCode',
		header: {
			isToken: false
		},
		method: 'GET',
		data: {
			uuid: uuid,
			code: code
		}

	})
}
//小程序登录
export const wxampLoginApi = (code) => {
	return request({
		url: '/wxampLogin/' + code,
		header: {
			isToken: false
		},
		method: 'GET',
	})
}

// 登录方法
export function login(userInfo) {
	return request({
		url: '/login',
		header: {
			isToken: false
		},
		method: 'post',
		data: userInfo
	})
}

// 注册方法
export function register(data) {
	return request({
		url: '/register',
		header: {
			isToken: false
		},
		method: 'post',
		data: data
	})
}

//绑定邮箱验证
export function bindMail(data) {
	return request({
		url: '/campus/bindMail',
		method: 'post',
		data: data
	})
}

//绑定邮箱验证
export function emailValidate(uuid) {
	return request({
		url: '/campus/email-validate',
		method: 'get',
		params: {
			uuid
		}
	})
}


//校验用户名称是否唯一
export function checkUserNameUnique(userName) {
	return request({
		url: '/userNameUnique',
		method: 'get',
		params: {
			userName
		}
	})
}

//校验用户名称是否唯一
export function checkEmailUnique(email) {
	return request({
		url: '/emailUnique',
		method: 'get',
		params: {
			email
		}
	})
}

// 退出方法
export function logout() {
	return request({
		url: '/logout',
		method: 'post'
	})
}

// 获取验证码
export function getCodeImg() {
	return request({
		url: '/captchaImage',
		header: {
			isToken: false
		},
		method: 'get',
		timeout: 20000
	})
}

//小程序绑定账号
export function wxampBind(loginBody) {
	return request({
		url: '/wxampBind',
		header: {
			isToken: false
		},
		method: 'post',
		data: loginBody
	})
}
//小程序注册账号
export function wxampRegister(loginBody) {
	return request({
		url: '/wxampRegister',
		header: {
			isToken: false
		},
		method: 'post',
		data: loginBody
	})
}

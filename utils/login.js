import {
	getToken,
	setToken,
	removeToken,
	setUserId
} from '@/utils/auth.js'

import {
	wxampLoginApi
} from '@/api/login.js'

export function wxampLogin(code) {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '登录中'
		});
		uni.login({
			provider: "weixin",
			success: (res) => {
				wxampLoginApi(res.code).then(({
						data
					}) => {
						uni.hideLoading();
						//登录成功
						setToken(data.token)
						uni.showToast({
							icon: 'success',
							title: '登录成功'
						})
						resolve('success');
					})
					.catch(({
						...error
					}) => {
						uni.hideLoading();
						uni.showToast({
							icon: 'error',
							title: '登录失败'
						})
						reject('error');
					})
			},
			fail: (error) => {
				reject('error');
			}
		});
	})

}

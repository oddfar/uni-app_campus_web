<!-- 蓝色简洁登录页面 -->
<template>
	<view class="login-bg">
		<image class="img-a" src="https://zhoukaiwen.com/img/loginImg/bg1.png"></image>
		<view class="t-login">
			<view class="t-b">绑 定 账 号</view>
			<u--form labelPosition="left" :model="loginForm" :rules="loginRules" ref="loginForm">
				<u-form-item prop="username" borderBottom>
					<view style="display: flex;">
						<u-icon name="account" size="32px"></u-icon>
						<input style="width: 100%;" type="text" placeholder="请输入账号" 
						v-model="loginForm.username" />
					</view>
				</u-form-item>
				<u-form-item prop="password" borderBottom>
					<view style="display: flex;">
						<u-icon name="lock" size="32px"></u-icon>
						<input style="width: 100%;" type="password" placeholder="请输入密码" 
						v-model="loginForm.password" />
					</view>
				</u-form-item>

				<view class="t-c">忘记密码</view>
				<button @tap="handleLogin()">登 录</button>
			</u--form>
		</view>
		<view class="cardBox" @click="toRegieter">
			<view>
				注册新账号
			</view>
		</view>
		<image class="img-b" src="https://zhoukaiwen.com/img/loginImg/bg2.png"></image>
	</view>
</template>
<script>
	import {
		wxampBind
	} from "@/api/login";
	import {
		getToken,
		setToken,
		removeToken
	} from "@/utils/auth";
	export default {
		data() {
			return {
				loginForm: {
					username: "",
					password: "",
					code: ""
				},
				codeUrl: "",
				loginRules: {
					username: [{
						required: true,
						trigger: "blur",
						message: "请输入您的账号"
					}, ],
					password: [{
						required: true,
						trigger: "blur",
						message: "请输入您的密码"
					}, ],
				},
			};
		},
		onLoad() {
			if (getToken() !== "" && getToken() !== "no_account") {
				uni.reLaunch({
					url: '/pages/index/tab',
					fail: function(e) {}
				})
			}
		},
		methods: {

			toRegieter() {
				uni.redirectTo({
					url: '/pages/login/bind-register'
				});
			},
			// 用户登录
			handleLogin() {

				this.$refs.loginForm.validate().then(res => {
					uni.showLoading({
						title: '绑定中'
					});
					uni.login({
						provider: "weixin",
						success: (res) => {
							this.loginForm.code = res.code;
							//登录接口
							wxampBind(this.loginForm)
								.then(({
									data
								}) => {
									uni.hideLoading();
									uni.showToast({
										title: '绑定成功！',
										icon: 'none'
									});
									// 登录成功 设置cookie
									this.setCookies(data);
									//跳转到me
									uni.reLaunch({
										url: '/pages/index/tab?PageCur=2',
										fail: function(e) {}
									})
								})
								.catch((response) => {
									uni.hideLoading();

								});

						},
					});

				}).catch(errors => {
					// uni.$u.toast('校验失败')
				})

			},
			//设置COOKIE
			setCookies(res) {
				setToken(res.token);
			},
		}
	};
</script>
<style>
	.img-a {
		width: 100%;
	}

	.img-b {
		width: 100%;
		height: 45px;
		bottom: 0;
		position: absolute;
	}

	.login-bg {
		height: 100vh;
		background: linear-gradient(to bottom, #ff6a9a, #fe7d76);
	}

	.t-login {
		padding: 55rpx;
		margin: 0 auto;
		font-size: 28rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		position: relative;
		margin-top: -100rpx;
		box-shadow: 0 5px 7px 0 rgba(0, 0, 0, 0.15);
		z-index: 9;
	}

	.t-login button {
		font-size: 28rpx;
		background: linear-gradient(to right, #ff8f77, #fe519f);
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 50rpx;
	}

	.t-login input {
		padding: 0 20rpx 0 120rpx;
		height: 90rpx;
		line-height: 90rpx;
		background: #f6f6f6;
		border: 1px solid #f6f6f6;
		border-radius: 50rpx;
	}



	.t-login .t-b {
		text-align: left;
		font-size: 46rpx;
		color: #ff939b;
		font-weight: bold;
		margin: 0 0 50rpx 20rpx;
	}

	.t-login .t-d {
		text-align: center;
		color: #999;
		margin: 80rpx 0;
	}

	.t-login .t-c {
		text-align: right;
		color: #c0c0c0;
		margin: 10px 16px 22px 0;
	}

	.t-login .t-f {
		text-align: center;
		margin: 200rpx 0 0 0;
		color: #666;
	}

	.t-login .t-f text {
		margin-left: 20rpx;
		color: #aaaaaa;
		font-size: 27rpx;
	}

	.t-login .uni-input-placeholder {
		color: #aeaeae;
	}

	.cl {
		zoom: 1;
	}

	.cl:after {
		clear: both;
		display: block;
		visibility: hidden;
		height: 0;
		content: '\20';
	}

	.cardBox {
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		-webkit-flex-direction: row;
		flex-direction: row;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		padding: 5rpx;
		background: #ffffff;
		opacity: 0.9;
		-webkit-border-radius: 20rpx;
		border-radius: 0 0 20rpx 20rpx;
		height: 70rpx;
		width: 600rpx;
		margin: 0 auto;
		position: relative;
		text-align: center;
		line-height: 70rpx;
		color: #aaa;
		font-size: 28rpx;
	}

	.cardBox .txt {
		margin-left: 10rpx;
	}

	.login-code {
		width: 33%;
		height: 38px;
		float: right;
	}

	.login-code-img {
		width: 100%;
		cursor: pointer;
		vertical-align: middle;
	}
</style>

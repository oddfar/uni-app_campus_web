<!-- 蓝色简洁登录页面 -->
<template>
	<view class="login-bg">
		<image class="img-a" src="https://zhoukaiwen.com/img/loginImg/bg1.png"></image>
		<view class="t-login">
			<view class="t-b">登 录</view>
			<u--form labelPosition="left" :model="loginForm" :rules="loginRules" ref="loginForm">
				<u-form-item prop="username" borderBottom>
					<u-icon name="account" size="32px"></u-icon>
					<input type="text" placeholder="请输入账号" v-model="loginForm.username" />
				</u-form-item>
				<u-form-item prop="password" borderBottom>
					<u-icon name="lock" size="32px"></u-icon>
					<input type="password" placeholder="请输入密码" v-model="loginForm.password" />
				</u-form-item>

				<u-form-item prop="code" borderBottom>
					<u-icon name="lock" size="32px"></u-icon>
					<input v-model="loginForm.code" auto-complete="off" placeholder="验证码"
						@keyup.enter.native="handleLogin">
					<svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
					</input>
					<div class="login-code">
						<img :src="codeUrl" @click="getCode" class="login-code-img" />
					</div>
				</u-form-item>

				<view class="t-c">忘记密码</view>
				<button @tap="handleLogin()">登 录</button>
			</u--form>
		</view>
		<view class="cardBox">
			<view>
				注册新账号
			</view>
		</view>
		<image class="img-b" src="https://zhoukaiwen.com/img/loginImg/bg2.png"></image>
	</view>
</template>
<script>
	import {
		getCodeImg,
		login
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
					code: "",
					uuid: "",
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
					code: [{
						required: true,
						trigger: "change",
						message: "请输入验证码"
					}],
				},
				loading: false,
				// 验证码开关
				captchaEnabled: true,
			};
		},
		onLoad() {
			if (getToken() !== "") {
				uni.reLaunch({
					url: '/pages/index/tab',
					fail: function(e) {}
				})
			}
			this.getCode();
		},
		methods: {
			//获取验证码
			getCode() {
				getCodeImg().then(({
					data
				}) => {
					this.captchaEnabled =
						data.captchaEnabled === undefined ? true : data.captchaEnabled;
					if (this.captchaEnabled) {
						this.codeUrl = "data:image/gif;base64," + data.img;
						this.loginForm.uuid = data.uuid;
					}
				});
			},
			//当前登录按钮操作
			login() {
				var that = this;
				if (!that.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return;
				}
				if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(that.phone)) {
					uni.showToast({
						title: '请输入正确手机号',
						icon: 'none'
					});
					return;
				}
				if (!that.pwd) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					});
					return;
				}
				uni.showToast({
					title: '登录成功！',
					icon: 'none'
				});
			},
			// 用户登录
			handleLogin() {
				this.$refs.loginForm.validate().then(res => {
					this.loading = true;
					//登录接口
					login(this.loginForm)
						.then(({
							data
						}) => {
							uni.showToast({
								title: '登录成功！',
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
							this.loading = false;
							if (this.captchaEnabled) {
								this.getCode();
							}
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

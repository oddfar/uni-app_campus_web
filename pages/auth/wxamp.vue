<template>
	<view style="text-align:center">
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="uuid!=''">
			<image class="icon-image" src="../../static/icon/info-fill.png"></image>

			<h2 style="margin-top: 20px;">登录确认</h2>
			<p style="margin-top: 20px;"> 请求获取您的微信唯一身份标识码</p>

			<view style="width: 50%;margin: 30px auto">
				<button type="primary" @click="login()">确定</button>
				<view style="margin-top: 15px;">
					<button type="warn">取消</button>
				</view>

			</view>
		</view>
		<!-- #endif -->

		<!-- <p style="font-size: 10px;">登录即代表您已阅读并同意用户协议</p> -->

	</view>
</template>

<script>
	import {
		setWxampCode
	} from "@/api/login"

	export default {
		data() {
			return {
				code: "",
				uuid: "",
				avatarUrl: ""
			}
		},
		onLoad(query) {
			// scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
			if (typeof(query.scene) == 'undefined') {
				uni.reLaunch({
					url: '/pages/index/tab',
					fail: function(e) {}
				})

			} else {
				//uuid
				let scene = decodeURIComponent(query.scene)
				this.uuid = scene;

			}
			// this.uuid = "d043367e6d5c4d03a786d0762c25e9c5";

		},
		methods: {
			login() {
				uni.showLoading({
					title: '加载中'
				});
				//第一步 login 获取 code
				uni.login({
					provider: "weixin",
					success: (res) => {
						this.code = res.code;
						setWxampCode(this.uuid, this.code).then(({
								data
							}) => {
								uni.hideLoading();
								uni.reLaunch({
									url: '/pages/auth/wxampSuccess',
									fail: function(e) {}
								})
							})
							.catch(({
								...error
							}) => {
								uni.hideLoading();
								uni.reLaunch({
									url: '/pages/auth//wxampError',
									fail: function(e) {}
								})
							})

					},
				});


			},


		}

	}
</script>

<style>
	.icon-image {
		margin-top: 25%;
		width: 80px;
		height: 80px;
	}
</style>

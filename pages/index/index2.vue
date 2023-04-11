<template>
	<view class="content">
		<u-toast ref="uToast"></u-toast>
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<navigator url="/pages/auth/wxamp"> 跳转 </navigator>
		<navigator url="/pages/index/index2"> 跳转 </navigator>
		<view @click="test()">弹窗</view>

	</view>
</template>

<script>
	export default {

		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		onReady() {

		},
		created() {

		},
		methods: {
			test() {
				this.$refs.uToast.show({
					type: 'default',
					message: "锦瑟无端五十弦",
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>

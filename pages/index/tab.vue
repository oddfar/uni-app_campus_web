<template>
	<view>
		<view class="main">
			<index v-if="PageCur==0"> </index>

			<me v-if="PageCur==2"></me>
		</view>

		<view>
			<u-overlay :show="show" @click="show = false" opacity="0.8">
				<view class="transition">
					<u-transition :show="show" mode="fade-left" :duration="800">
						<view class="popup-icon" @click="toPublish(0)">
							<image src="../../static/images/text.png" style="height: 50px;width: 50px;"></image>
							<div><span class="popup-span">发布文字</span></div>
						</view>
					</u-transition>

					<u-transition :show="show" mode="fade-up" :duration="800">
						<view class="popup-icon" @click="toPublish(1)" style="margin: 0 40px;">
							<image src="../../static/images/image.png" style="height: 50px;width: 50px;"></image>
							<div><span class="popup-span">发布图文</span></div>
						</view>
					</u-transition>

					<u-transition :show="show" mode="fade-right" :duration="800">
						<view class="popup-icon" @click="toPublish(2)">
							<image src="../../static/images/video.png" style="height: 50px;width: 50px;"></image>
							<div><span class="popup-span">发布视频</span></div>
						</view>
					</u-transition>

				</view>
			</u-overlay>

		</view>


		<u-tabbar :value="PageCur" @change="change" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true">
			<u-tabbar-item text="首页" icon="home"></u-tabbar-item>

			<u-tabbar-item>
				<image class="u-page__item__slot-icon icon_no_select" slot="inactive-icon"
					src="../../static/tabBar/add.png"></image>
				<image class="u-page__item__slot-icon icon_select" slot="active-icon" src="../../static/tabBar/add.png">
				</image>

			</u-tabbar-item>
			<u-tabbar-item text="我的" icon="account"></u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script>
	import index from "./index.vue"; //首页
	import add from "./add.vue"; //➕
	import me from "../me/me"; //我的

	import {
		isLogin
	} from "@/utils/auth";

	export default {
		components: {
			index,
			add,
			me
		},
		data() {
			return {
				PageCur: 0,
				show: false,
			}
		},
		onLoad(option) {
			var page = parseInt(option.PageCur)
			this.PageCur = option.PageCur
		},
		onReady() {

		},
		methods: {
			change(name) {
				if (name == 1) {
					this.show = true;
				} else {
					this.PageCur = name;
				}
			},
			toPublish(type) {
				if (isLogin()) {
					uni.navigateTo({
						url: '/pages/index/add?type=' + type
					});
				} else {
					uni.navigateTo({
						url: '/pages/me/me'
					})
				}

			}
		}
	}
</script>

<style>
	.u-page__item__slot-icon {
		width: 25px;
		height: 25px;
	}

	.icon_select {
		transform: rotate(225deg);
		transition: transform 0.5s, top 0.5s;
	}

	.icon_no_select {
		transform: rotate(0deg);
		transition: transform 0.5s, top 0.5s;
	}

	.transition {
		position: fixed;
		bottom: 100px;
		left: 0;
		right: 0;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.popup-span {
		color: #fff;
		font-size: 14px;
	}

	.popup-icon {
		text-align: center;
		justify-content: center;
	}
</style>
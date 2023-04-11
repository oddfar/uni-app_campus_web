<template>
	<view>
		<view class="main">
			<index v-if="PageCur==0"> </index>
			<add v-if="PageCur==1"></add>
			<me v-if="PageCur==2"></me>
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

	export default {
		components: {
			index,
			add,
			me
		},
		data() {
			return {
				PageCur: 0,
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
				if (name == 1) {}
				this.PageCur = name
			},
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
</style>

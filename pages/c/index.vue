<template>
	<view class="container">
		<u-loading-page :loading="loading"></u-loading-page>
		<Content :contentObj="contentObj" v-if="contentObj != null" :loveContentIds="loveContentIds"></Content>

	</view>
</template>

<script>
	//getContentById
	import touristApi from "@/api/tourist";
	//引用组件
	import Content from "@/components/content/index";

	export default {
		components: {
			Content
		},
		data() {
			return {
				contentId: "",
				loading: true,
				//墙内容
				contentObj: null,
				//点赞的墙列表
				loveContentIds: [],
				//是否加载
				loading: true,
			};
		},
		onLoad(options) {
			var id = options.id;
			if (typeof(id) != 'undefined') {
				this.contentId = options.id;
				this.getContent(this.contentId);
			}

		},
		methods: {
			getContent(contentId) {
				touristApi
					.getContentById(contentId)
					.then(({
						data
					}) => {
						let isLove = data.isLove;
						if (isLove) {
							this.loveContentIds.push(contentId);
						}
						this.loading = false;
						this.contentObj = data.data;

					})
					.catch(({
						...error
					}) => {
						this.loading = false;
					});
			}
		}

	}
</script>

<style>
	.container {
		padding: 10px 10px 0 10px;
	}
</style>

<template>
	<view class="ContentFile" id="fileWidth">
		<view class="picture" style="display: flex;" v-if="contentType == 1">
			<view class="picture_item" v-for="(item, index) in fileList" :key="index">
				<u--image v-if="fileList.length>1" :src="item" width="20vw" mode="aspectFill" height="20vw"
					:lazy-load="true" @click="previewImage(index)">

				</u--image>

				<u--image v-else :src="item" width="25vw" mode="aspectFill" height="25vw" :lazy-load="true"
					@click="previewImage(index)">

				</u--image>

			</view>
		</view>

		<view v-if="contentType == 2">
			<!-- style="border-radius: 10px" -->
			<video id="myVideo" :src="fileList[0]" :enable-play-gesture="true">

			</video>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ContentFile",
		props: ["fileUrls", "contentType"],
		components: {},
		data() {
			//这里存放数据
			return {
				host: this.MyConfig.baseURL,
				//修改后的文件列表
				fileList: "",
			};
		},
		created() {

		},
		watch: {
			fileUrls: {
				immediate: true,
				handler(newValue, oldValue) {
					if (newValue !== null && newValue != undefined && newValue.length > 0) {
						this.setFileUrls();
					}
				}
			}
		},
		//方法集合
		methods: {

			//处理url
			setFileUrls() {
				this.fileList = this.fileUrls.map((item) => {
					if (item.trim().startsWith("http") == false) {
						return (item = this.host + item);
					}
				});

			},
			previewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.fileList,
					loop: true,
					longPressActions: ''
				});
			}
		},
	};
</script>

<style>
	.picture_item {
		display: inline;
		padding-left: 0.25rem;
		padding-top: 0.25rem;
	}
</style>
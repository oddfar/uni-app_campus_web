<template>
	<view class="publish-content">
		<view>

			<scroll-view class="scrollContainer" scroll-x="true" scroll-left="120">
				<view class="scroll-view-item_H" style="margin-right: 20px;">选择分区</view>
				<view class="scroll-view-item_H" v-for="(item, index) in categoryOptions" :key="index">
					<view class="category-tag" v-if="item.parentId!='0'" @click="clickCategory(item.categoryId)">
						<view v-if="contentParam.categoryId==item.categoryId" style="color: #216af3;">
							{{item.categoryName}}
						</view>
						<view v-else>{{item.categoryName}}</view>
					</view>
				</view>

			</scroll-view>


			<view style="margin-top: 20px;">

				<u--textarea autoHeight placeholder="写下你想说的" v-model="contentParam.content" count maxlength="240"
					:focus="true" border="bottom">
				</u--textarea>


			</view>
		</view>

		<view style="margin-top: 20px;">
			<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" multiple 
			:maxCount="upload.limit" :maxSize="5*1024*1024"	:previewFullImage="true">
			</u-upload>
		</view>

		<view style="margin-top: 20px;">

			<view class="woo-box-flex woo-box-alignCenter">
				<view class="woo-box-item-flex" style="align-self: center">
					<view class="woo-box-item-inlineBlock">

					</view>

					<view class="woo-box-item-inlineBlock">

					</view>

				</view>
				<view style="width: 70px;">
					<button type="primary" round style="margin-top: 15px"
						:disabled="contentParam.content.length <= 0 || contentParam.categoryId==''"
						@click="publishContent()">
						发布
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import touristApi from "@/api/tourist";
	import operateApi from "@/api/operate";

	import {
		getToken,
		isLogin
	} from '@/utils/auth.js'
	export default {
		data() {
			return {
				//请求参数
				contentParam: {
					categoryId: "",
					type: 0,
					isAnonymous: 0,
					content: "",
					fileList: [],
				},
				upload: {
					limit: 3,
					headers: {},
				},
				//分类列表
				categoryOptions: [],
				fileList: [],

			}
		},
		onReady() {
			this.getTreeselect();

		},
		methods: {
			// 删除图片
			deletePic(event) {
				this['fileList'].splice(event.index, 1);
			},
			// 新增图片
			async afterRead(event) {
				if (!isLogin()) {
					uni.navigateTo({
						url: '/pages/me/me'
					})
					return;
				} else {
					//var res = await 
					this.upload.headers["Authorization"] = "Bearer " + getToken();
					let lists = [].concat(event.file)
					let fileListLen = this['fileList'].length

					lists.map((item) => {
						this[`fileList`].push({
							...item,
							status: 'uploading',
							message: '上传中'
						})
					})

					for (let i = 0; i < lists.length; i++) {
						// const result = await this.uploadFilePromise(lists[i].url)

						let item = this[`fileList`][fileListLen]
						this.uploadFilePromise(lists[i]).then((res) => {

							uni.showToast({
								icon: 'none',
								title: '上传成功'
							})
							this[`fileList`].splice(fileListLen, 1, Object.assign(item, {
								status: 'success',
								message: res,
								url: lists[i].url
							}))
							fileListLen++

							console.log(this.fileList)

						}).catch((res) => {

							uni.showToast({
								icon: 'error',
								title: '上传失败'
							})
						})
					}

				}

			},
			uploadFilePromise(item) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: this.MyConfig.baseURL + '/campus/imageUpload', // 仅为示例，非真实的接口地址
						filePath: item.url,
						name: 'file',
						header: this.upload.headers,
						success: (res) => {
							var data = JSON.parse(res.data)
							if (data.code == "200") {
								resolve(data)
							} else {
								reject(data)
							}

						},
						fail: (res) => {
							reject(res)
						},
					});
				})
			},
			/** 查询下拉树结构 */
			getTreeselect() {
				touristApi.getCategoryList().then(({
					data
				}) => {
					// this.categoryOptions = this.handleTree(data.data, "categoryId");
					this.categoryOptions = data.data;
					this.show = true;
				});
			},
			publishContent() {
				if (!isLogin()) {
					uni.navigateTo({
						url: '/pages/me/me'
					})
					return;
				}
				this.contentParam.fileList = [];
				for (let file of this.fileList) {
					if (file.type.startsWith("image")) {
						this.contentParam.type = 1;
					}
					if (file.type.startsWith("video")) {
						this.contentParam.type = 2;
					}
					if (file.message !== undefined && file.message.code == 200) {
						this.contentParam.fileList.push(file.message.data.fileId);
					} else {
						console.log("禁止");
					}
				}
				if (this.contentParam.categoryId == '') {
					uni.showToast({
						icon: 'none',
						title: '请选择分类'
					})
					return;
				}
				//请求
				operateApi.publishContent(this.contentParam).then(({
					data
				}) => {
					uni.showToast({
						icon: 'none',
						title: '发表成功，请等待审核'
					})

					uni.navigateTo({
						url: '/pages/me/me'
					})
				});
			},
			//点击分类
			clickCategory(categoryId) {
				this.contentParam.categoryId = categoryId
			}
		}

	}
</script>

<style>
	.scrollContainer {
		white-space: nowrap;
		width: 100%;
	}

	.scroll-view-item_H {
		display: inline-block;

	}

	.publish-content {
		padding: 20px;
		height: 100vh;
	}

	.category-tag {
		margin-right: 10px;
		font-size: 14px;
		display: inline-block;
		min-width: 26px;
		border: 1px solid #ccc;
		border-radius: 40px/50px;
		line-height: 13px;
		color: #939393;
		text-align: center;
		padding: 2px 5px;
	}
</style>

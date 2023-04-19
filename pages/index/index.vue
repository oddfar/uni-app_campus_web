<template>
	<view>
		<view v-if="categoryList!=null">
			<u-sticky bgColor="#fff">
				<u-tabs :list="categoryList" keyName="categoryName" @click="clickTabs"></u-tabs>
			</u-sticky>
		</view>

		<view class="index-bg">

			<u-loading-page :loading="loading"></u-loading-page>
			<view class="campus-main">
				<view class="woo-box-flex">
					<!-- 消息盒子 -->
					<view class="content-t">
						<scroll-list ref="contentObj" :option="option" @load="getContent" @refresh="refresh">
							<view class="content-box" v-for="(item, key) in contentObj" :key="key">
								<Content :contentObj="item" :loveContentIds="loveContentIds" @openPopup="openPopup">
								</Content>
							</view>
						</scroll-list>
					</view>
				</view>

			</view>
		</view>

		<!-- 拓展点击弹出层 -->
		<view>
			<ArrowDown :contentObj="popupData.contentObj" :show="popupData.show" :time="popupData.time"></ArrowDown>
		</view>
	</view>

</template>

<script>
	//api
	import touristApi from "@/api/tourist";
	import operateApi from "@/api/operate";

	import {
		isLogin
	} from "@/utils/auth";

	import {
		wxampLogin
	} from "@/utils/login.js"
	//引用组件
	import Content from "@/components/content/index";
	import ArrowDown from "@/components/content/ArrowDown";

	export default {
		components: {
			Content,
			ArrowDown
		},
		data() {
			return {
				option: {
					page: 1,
					size: 5,
					auto: true,
					safeArea: true,
					offsetBottom: 150,
					loadingText: ''
				},
				//菜单分类
				categoryList: null,
				//墙内容
				contentObj: [],
				//点赞的墙列表
				loveContentIds: [],
				contentVo: {
					pageNum: 1,
					categoryId: null,
				},
				//是否加载
				loading: true,
				total: 0,
				//拓展弹出层
				popupData: {},
			};
		},

		//创建的时候自动调用
		onReady() {
			if (isLogin()) {
				// #ifdef  MP-WEIXIN
				// wxampLogin();
				// #endif
			}

			this.getAllCategorys();
			// this.getContent();
		},
		//创建后
		mounted() {
			// this.contentVo.categoryId = 0;
		},
		methods: {

			clickTabs(item) {
				this.contentVo.categoryId = item.categoryId;
				this.refresh();
			},
			//获取全部分类
			getAllCategorys() {
				touristApi
					.getCategoryList()
					.then((response) => {
						this.categoryList = [];
						for (let item of response.data.data) {

							if (item.parentId != "0" || item.type == "Y") {
								this.categoryList.push(item);
							}

						}
					})
					.catch();
			},
			//获取所有内容(加载数据)
			getContent(paging) {
				this.contentVo.pageNum = paging.page;

				touristApi
					.getContent(this.contentVo)
					.then(({
						data
					}) => {
						for (var i of data.rows) {
							this.contentObj.push(i)
						};
						this.total = parseInt(data.total);
						this.loveContentIds = data.loveContentIds;
						this.loading = false;

						this.$refs.contentObj.loadSuccess({
							list: this.contentObj,
							total: this.total
						});
					})
					.catch(({
						...error
					}) => {
						this.loading = false;
						this.$refs.contentObj.loadFail()
					});

			},
			//下拉刷新数据
			refresh(paging) {
				this.contentVo.pageNum = 1;

				touristApi
					.getContent(this.contentVo)
					.then(({
						data
					}) => {
						this.contentObj = data.rows;
						this.total = parseInt(data.total);
						this.loveContentIds = data.loveContentIds;

						this.$refs.contentObj.refreshSuccess({
							list: this.contentObj,
							total: this.total
						});
					})
					.catch(({
						...error
					}) => {
						this.$refs.contentObj.loadFail()
					});

			},
			//打开拓展弹出层
			openPopup(data) {
				this.popupData = data;
			}

		},
	};
</script>

<style>
	.index-bg {
		/* box-shadow: 0 25px 45px rgb(0 0 0 / 10%); */
		/* border: 1px solid rgba(255, 255, 255, 0.5); */
		border-right: 1px solid rgba(255, 255, 255, 0.2);
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 10px;
		margin: auto;
	}

	.content-box {
		/* box-shadow: 0 10px 12px 0 rgba(0, 0, 0, 0.2); */
		margin: 0 0 25px 0;
		padding: 20px 20px 0;
		background-color: #fff;
		box-shadow: 0px 0px 25px rgb(0 0 0 / 10%);
		border: 1px solid rgba(255, 255, 255, 0.5);
		border-right: 1px solid rgba(255, 255, 255, 0.2);
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 10px;
	}

	.tag-group {
		text-align: center;
	}

	/* 分页 */
	.fenye {
		width: 100%;
		margin: 0 auto;
		text-align: center;
	}

	/* 标签 */
	.clickable {
		margin-top: 5px;
		cursor: pointer;
	}

	.content-t {
		width: 100%;
		margin: 20px 0 0 0;
	}
</style>
<template>
	<view>
		<view v-if=" nickName!='' ">
			<view class="header">
				<view class="kong"></view>
				<!-- 头像和设置 -->
				<view class="row-1">
					<view class="image">
						<u-avatar size="65" :src="handleCampusUrl(user.avatar)"></u-avatar>

					</view>
					<view class="set">
						<view class="content">
							<image style="height: 25px; width: 25px;" src="../../static/icon/set-up.svg"></image>
							<p>设置</p>
						</view>

					</view>
				</view>

				<view class="row-1">
					<view class="nickName">
						<span>{{nickName}}</span>
					</view>
				</view>
			</view>

			<view class="container">
				<view style="width: 30vh;">
					<u-subsection :list="list" :current="curNow" @change="sectionChange" mode="button"
						bgColor="#FFFFFF"></u-subsection>
				</view>

				<!-- 消息盒子 -->
				<view class="content">
					<view v-if="curNow==0">
						<scroll-list ref="contentObj" :option="option" @load="getContent" @refresh="refreshContent">
							<view class="content-box" v-for="(item, key) in contentObj" :key="key">
								<Content :contentObj="item" :loveContentIds="loveContentIds" @openPopup="openPopup"></Content>
							</view>
						</scroll-list>
					</view>
					<view v-if="curNow==1">
						<scroll-list ref="commentObj" :option="option" @load="getComment" @refresh="refreshComment">
							<view class="content-box" v-for="(item, key) in commentList" :key="key">
								<ownComment :commentObj="item"></ownComment>
							</view>
						</scroll-list>
					</view>
					<view v-if="curNow==2">
					</view>
				</view>
			</view>


		</view>

		<view v-if="!isLogin">
			<view style="width: 50%;margin: 50vh auto; height: 30px;">
				<view style="height: 30px;">
					<u-button type="primary" @click="loginHandle()" text="点击授权登录"></u-button>
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
	import userInfoApi from "@/api/userInfo.js"
	import operateApi from "@/api/operate";
	import {
		wxampLogin
	} from "@/utils/login.js"
	import {
		isLogin,
		setUserId
	} from "@/utils/auth";

	//引用组件
	import Content from "@/components/content/index";
	import ownComment from "@/components/comment/ownComment";
	import ArrowDown from "@/components/content/ArrowDown";

	export default {
		components: {
			Content,
			ownComment,
			ArrowDown
		},
		data() {
			return {
				isLogin: false,
				option: {
					page: 1,
					size: 5,
					auto: true,
					safeArea: true,
					offsetBottom: 50,
					loadingText: ''
				},
				list: ['动态', '评论', '点赞'],
				curNow: 0,
				result: "",
				//用户
				user: {},
				nickName: "",
				//墙列表
				contentObj: [],
				//评论列表
				commentList: [],
				//查询参数
				contentVo: {
					pageNum: 1,
				},
				total: 0,
				loveContentIds: [],
				//拓展弹出层
				popupData: {},
			}
		},
		created() {
			if (isLogin()) {
				this.isLogin = true;
				this.getUserInfo();
			}
			// this.loginHandle();
		},

		methods: {
			async loginHandle() {
				if (!isLogin()) {
					// #ifndef  MP-WEIXIN
					//非微信小程序平台没登录则跳转到登录
					uni.navigateTo({
						url: '/pages/login/accountLogin'
					})
					// #endif

					// #ifdef  MP-WEIXIN
					//微信小程序平台登录
					await wxampLogin();
					if (!isLogin()) {
						//没绑定或注册账号则跳转
						uni.navigateTo({
							url: '/pages/login/bind'
						})
					}

					// #endif
				} else {
					this.isLogin = true;
				}

				if (isLogin()) {
					await this.getUserInfo();
				}

			},
			sectionChange(index) {
				this.curNow = index;
			},
			getUserInfo: function() {
				return new Promise((resolve, reject) => {
					userInfoApi.getUserInfo().then(({
							data
						}) => {
							this.user = data.user
							this.nickName = data.user.nickName
							setUserId(data.user.userId)
							resolve("sueccess")
						})
						.catch(({
							...error
						}) => {
							reject("error")
						});

				})

			},
			getContent(paging) {
				this.contentVo.pageNum = paging.page;

				operateApi
					.ownContents(this.contentVo, "")
					.then(({
						data
					}) => {
						for (var i of data.rows) {
							this.contentObj.push(i)
						};
						this.total = parseInt(data.total);
						this.loveContentIds = data.loveContentIds;

						this.$refs.contentObj.loadSuccess({
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
			//下拉刷新数据
			refreshContent(paging) {
				this.contentVo.pageNum = 1;

				operateApi
					.ownContents(this.contentVo)
					.then(({
						data
					}) => {
						this.commentList = data.rows;
						console.log(this.commentList)
						this.total = parseInt(data.total);
						this.loveContentIds = data.loveContentIds;

						this.$refs.contentObj.refreshSuccess({
							list: this.commentList,
							total: this.total
						});
					})
					.catch(({
						...error
					}) => {
						this.$refs.contentObj.loadFail()
					});

			},
			getComment(paging) {
				this.contentVo.pageNum = paging.page;

				operateApi
					.getOwnComment(this.contentVo)
					.then(({
						data
					}) => {
						for (var i of data.rows) {
							this.commentList.push(i)
						};
						this.total = parseInt(data.total);

						this.$refs.commentObj.loadSuccess({
							list: this.commentList,
							total: this.total
						});
					})
					.catch(({
						...error
					}) => {
						this.$refs.commentObj.loadFail()
					});
			},
			//下拉刷新数据
			refreshComment(paging) {
				this.contentVo.pageNum = 1;

				operateApi
					.getOwnComment(this.contentVo)
					.then(({
						data
					}) => {
						this.commentList = data.rows;
						this.total = parseInt(data.total);

						this.$refs.commentObj.refreshSuccess({
							list: this.commentList,
							total: this.total
						});
					})
					.catch(({
						...error
					}) => {
						this.$refs.commentObj.loadFail()
					});

			},
			testAjax2() {
				getYuLu().then(({
						data
					}) => {
						this.result = JSON.stringify(data, null, 4);
					})
					.catch(({
						...error
					}) => {
						console.log("错误信息：", error);
					})

			},
			//打开拓展弹出层
			openPopup(data) {
				this.popupData = data;
			}
		}

	}
</script>

<style>
	.header {
		background: url("/static/images//background.png") no-repeat;
		background-size: cover;
		padding: 20px;
	}

	.kong {
		height: 10vh;
	}

	.row-1 {
		display: flex;
		align-content: center;
		justify-content: space-between;
	}

	.set {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.set .content {

		display: flex;
		align-items: center;
		justify-content: center;
		background: #f6f6f6;
		border: 2px solid #f6f6f6;
		border-radius: 40px/50px;
		height: 40px;
		width: 100px;
	}

	.set p {
		margin-left: 10px;
		line-height: 40px;
	}

	.row-1 .nickName {
		margin-top: 10px;
		font-size: 20px;
		color: white;
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

	.container .content {
		margin: 20px 0 0 0;
	}
</style>
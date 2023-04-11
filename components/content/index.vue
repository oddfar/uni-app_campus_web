<template>
	<!-- 消息盒子 -->
	<view>
		<view class="content-main">
			<!-- 头像，用户名 -->
			<view class="content-box-top woo-box-flex">
				<view class="content-box-avatar">
					<u--image shape="circle" width="50px" height="50px"
						:src="handleCampusUrl(contentObj.params.avatar)">
					</u--image>
				</view>

				<view class="box--flex woo-box-item-flex" style="justify-content: center; flex-direction: column">
					<view class="box--flex" style="margin-bottom: 7px; font-weight: bolder">
						<span class="nickName">
							{{ contentObj.params.nickName }}
						</span>
					</view>
					<view class="box--flex">
						<view class="content-category-tag">
							<view>{{ contentObj.params.categoryName }}</view>
						</view>
						<view class="content-category-tag" v-if="contentObj.status==0">
							<view style="color: red;">审核中</view>
						</view>
						<span class="content-box-time">
							{{ parseTime(contentObj.createTime, "{y}-{m}-{d} {h}:{i}") }}
						</span>
					</view>
				</view>
				<div class="woo-box-flex" @click="show = true">
					<div class="woo-pop-wrap">
						<span class="woo-pop-ctrl">
							<div class="woo-box-flex woo-box-alignCenter woo-box-justifyCenter">
								<u-icon name="arrow-down"></u-icon>
							</div>
						</span>
					</div>
				</div>

			</view>
			<!-- 内容 -->
			<view class="content-feed-content" style="padding-left: 60px; margin: 0px 10px 0 0">
				<view class="content-feed-ogText" @click="clickContent()">
					<!-- 文字 -->
					<view style="white-space: pre-wrap">{{ contentObj.content }}</view>
				</view>
				<!-- 信息墙的图片/视频 -->
				<view style="margin-top: 10px">
					<ContentFile v-if="contentObj.type != 0" :fileUrls="contentObj.fileUrl"
						:contentType="contentObj.type">
					</ContentFile>
				</view>
			</view>
		</view>


		<!-- 信息墙底部 -->
		<ContentBottom :zanBoolean="zanBoolean" :contentObj="contentObj"></ContentBottom>
		<!-- 弹出框 -->
		<u-popup :show="show" mode="bottom" @close="close" :round="10">
			<view style="padding: 20px; margin-bottom: 50px;">
				<view class="woo-box-flex">

					<view class="popup-icon">
						<button id="share" open-type="share">
							<u-icon name="weixin-circle-fill" size="50"></u-icon>
							<span class="popup-span">分享微信</span>
						</button>
					</view>

					<view class="popup-icon" v-if="loginUserId==contentObj.userId"
						@click="deleteContent(contentObj.contentId)">
						<u-icon name="trash" size="50"></u-icon>
						<span class="popup-span">删除</span>
					</view>
				</view>
				<view style="height: 30px;margin-top: 20px;">
					<button type="default" @click="show = false">取消</button>
				</view>
			</view>

		</u-popup>

	</view>

</template>

<script>
	//组件
	import ContentBottom from "@/components/content/ContentBottom";
	import ContentFile from "@/components/content/ContentFile";
	import {
		isLogin,
		getUserId
	} from "@/utils/auth";

	import operateApi from "@/api/operate";

	export default {
		name: "Content",
		props: ["contentObj", "loveContentIds"],
		//import引入的组件需要注入到对象中才能使用
		components: {
			ContentBottom,
			ContentFile
		},
		data() {
			//这里存放数据
			return {
				//是否点赞
				zanBoolean: false,
				show: false,
				loginUserId: 0
			};
		},
		//生命周期 - 创建完成（可以访问当前this实例）
		created() {
			this.isZan(this.contentObj.contentId);
			if (isLogin()) {
				this.loginUserId = getUserId();
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮

			}
			return {
				title: this.contentObj.content,
				path: "/pages/c/index?id=" + this.contentObj.contentId
			}
		},
		//生命周期 - 挂载完成（可以访问DOM元素）
		mounted() {},
		//方法集合
		methods: {
			//点击信息墙
			clickContent() {
				let routes = getCurrentPages();
				// 获取当前页面路由，也就是最后一个打开的页面路由
				let curRoute = routes[routes.length - 1].route

				if (curRoute != "pages/c/index") {
					uni.navigateTo({
						url: "/pages/c/index?id=" + this.contentObj.contentId
					});
				}
			},
			//判断是否被点赞
			isZan(contentId) {
				if (this.loveContentIds.indexOf(contentId) == -1) {
					this.zanBoolean = false;
				} else {
					this.zanBoolean = true;
				}
			},
			close() {
				this.show = false
				// console.log('close');
			},
			//删除方法
			deleteContent(contentId) {
				uni.showModal({
					title: '提示',
					content: '你确定要删除吗',
					success: function(res) {
						if (res.confirm) {
							operateApi.deleteContent(contentId).then((response) => {
								uni.showToast({
									icon: 'none',
									title: '删除成功，请手动刷新'
								})

							});
						} else if (res.cancel) {
							uni.showToast({
								icon: 'none',
								title: '取消删除！'
							})
						}
					}
				});


			},
		},
	};
</script>
<style>
	.box--flex {
		display: flex;
	}

	.content-box-top {
		height: 50px;
	}

	.content-feed-ogText {
		color: #333;
		font-size: 14px;
		line-height: 24px;
	}

	.content-footer {
		height: 40px;
		line-height: 40px;
		margin: 0 15px;
	}

	.box--flex .nickName {
		font-size: 15px;
		font-weight: bold;
	}

	.content-box-time {
		font-size: 12px;
		color: darkgrey;
	}

	.content-category-tag {
		margin-right: 4px;
		font-size: 12px;
		display: inline-block;
		min-width: 26px;
		height: 13px;
		border: 1px solid #ccc;
		border-radius: 2px;
		line-height: 13px;
		color: #939393;
		text-align: center;
	}

	.content-box-avatar {
		margin-right: 10px;
	}

	.popup-span {
		color: #939393;
		font-size: 12px;
	}

	.popup-icon {
		text-align: center;
		margin-right: 10px;

	}
</style>

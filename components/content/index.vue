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
							<view style="color: blue;">审核中</view>
						</view>
						<view class="content-category-tag" v-if="contentObj.status==2">
							<view style="color: red;">已下架</view>
						</view>
						<view class="content-category-tag" v-if="contentObj.status==3">
							<view style="color: red;">审核不通过</view>
						</view>
						<span class="content-box-time">
							{{ parseTime(contentObj.createTime, "{y}-{m}-{d} {h}:{i}") }}
						</span>
					</view>
				</view>
				<div class="woo-box-flex" @click="openArrowDown()" style="width: 30px;">
					<div class="woo-pop-wrap">
						<span class="woo-pop-ctrl">
							<div class="woo-box-flex woo-box-alignCenter woo-box-justifyCenter"
								style="padding-left: 10px;">
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
			//打开弹出层
			openArrowDown() {
				const data = {
					contentObj: this.contentObj,
					show: true,
					time: new Date().getTime(),
				}
				this.$emit("openPopup", data);
			},
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
</style>
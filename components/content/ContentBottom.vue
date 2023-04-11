<template>
	<view class="ContentBottom">
		<view class="content-bootom-svg woo-box-flex woo-box-alignCenter" style="margin: 10px 15px 15px 0px">
			<!-- 分享链接 -->
			<view class="woo-box-item-flex">
				<view class="content-bottom-hover woo-box-flex woo-box-alignCenter woo-box-justifyCenter">
					<button id="share" open-type="share">
						<view class="woo-pop-wrap">
							<image class="image_icon" src="@/static/icon/share.png" />
							<span class="icon_text">分享</span>
						</view>

					</button>

				</view>
			</view>
			<!-- 评论 -->
			<view class="woo-box-item-flex">
				<view class="content-bottom-hover woo-box-flex woo-box-alignCenter woo-box-justifyCenter"
					@click="clickComment()">
					<view class="woo-pop-wrap">
						<image class="image_icon" src="@/static/icon/comment.png" />
						<span class="icon_text">评论</span>
					</view>
				</view>
			</view>
			<!-- 赞 -->
			<view class="woo-box-item-flex">
				<view class="content-bottom-hover woo-box-flex woo-box-alignCenter woo-box-justifyCenter"
					@click="setZan(contentObj.contentId)">
					<view class="woo-pop-wrap">
						<image class="image_icon" :src="zanImg" />
						<span class="zan-num">{{loveCount}}</span>
					</view>
				</view>
			</view>
		</view>
		<!-- 评论列表 -->
		<view v-if="showComment">
			<Comment :contentObj="contentObj"></Comment>
		</view>

	</view>
</template>

<script>
	const dzNotImage = require('@/static/icon/dz.png')
	const dzImage = require('@/static/icon/dz1.png')

	import operateApi from "@/api/operate";

	//复制
	// import Clipboard from "clipboard";
	//认证
	import {
		isLogin
	} from "@/utils/auth";
	// 组件
	import Comment from "@/components/comment/index.vue";

	export default {
		name: "ContentBottom",
		props: ["zanBoolean", "contentObj"],
		//import引入的组件需要注入到对象中才能使用
		components: {
			Comment
		},
		data() {
			//这里存放数据
			return {
				//点赞/没点赞的图片地址
				zanImg: "",
				//是否显示评论
				showComment: false,
				isZanBoo: false,
				//路由地址
				curRoute: '',
				//点赞数量
				loveCount: 0,
			};
		},
		//生命周期 - 创建完成（可以访问当前this实例）
		created() {
			this.loveCount = this.contentObj.loveCount;
			let routes = getCurrentPages();
			// 获取当前页面路由，也就是最后一个打开的页面路由
			let curRoute = routes[routes.length - 1].route

			if (curRoute == "pages/c/index") {
				this.showComment = true;
			}
			this.curRoute = curRoute
		},
		//生命周期 - 挂载完成（可以访问DOM元素）
		mounted() {
			this.isZanBoo = this.zanBoolean;
			this.isZan();

		},
		onShareAppMessage(res) {

			if (res.from === 'button') { // 来自页面内分享按钮

			}
			return {
				title: this.contentObj.content,
				path: "/pages/c/index?id=" + this.contentObj.contentId
			}
		},
		//方法集合
		methods: {
			//判断是否被点赞
			isZan() {
				if (this.isZanBoo == false) {
					this.zanImg = dzNotImage;
					return false;
				} else {
					this.zanImg = dzImage;
					return true;
				}
			},
			//点击评论
			clickComment() {

				if (this.curRoute != "pages/c/index") {
					uni.navigateTo({
						url: "/pages/c/index?id=" + this.contentObj.contentId
					});
				} else {
					// this.showComment = !this.showComment;
				}

			},
			//点赞
			setZan(contentId) {
				if (!isLogin()) {
					uni.showToast({
						icon: 'none',
						title: '清先登录！'
					})
				} else {
					if (this.isZanBoo == true) {
						//取消点赞
						this.isZanBoo = false;
						this.loveCount--;
					} else {
						//设置点赞
						this.isZanBoo = true;
						this.loveCount++;
					}
					this.isZan(contentId);
					//发送api
					operateApi.zanContent(contentId).then((response) => {
						if (response.data == 1) {
							//点赞
						}
						if (response.data == 0) {
							//取消点赞
						}
					});
				}
			},
			share() {

				document.getElementById("share").click()

			},

			//复制分享链接
			// copys(e, contentId) {
			//   const hostname = window.location.origin;
			//   const clipboard = new Clipboard(e.target, {
			//     text: () => hostname + "/c/" + contentId,
			//   });
			//   clipboard.on("success", (e) => {
			//     const h = this.$createElement;
			//     this.$notify({
			//       title: "复制成功：",
			//       message: h("i", { style: "color: teal" }, "快去分享给好盆友吧!"),
			//     });
			//     // 释放内存
			//     clipboard.destroy();
			//   });

			//   clipboard.on("error", (e) => {
			//     // 不支持复制
			//     Message({
			//       message: "该浏览器不支持自动复制",
			//       type: "warning",
			//     });
			//     // 释放内存
			//     clipboard.destroy();
			//   });
			// },
		},
	};
</script>
<style>
	.content-bootom-svg {
		font-size: 10px;
		font-weight: bolder;
		color: rgb(110, 110, 110);
	}

	.zan-num {
		font-weight: bolder;
		cursor: pointer;
		font-size: 10px;
		margin-left: 5px;
	}

	.content-bottom-hover {
		cursor: pointer;
		color: rgb(110, 110, 110);
	}

	.content-bottom-hover:hover {
		color: coral;
	}

	.image_icon {
		width: 20px;
		height: 20px
	}

	.icon_text {
		color: rgb(110, 110, 110);
		font-size: 12px;
		font-weight: normal;
	}

	button::after {
		border: none;
	}

	button {
		position: relative;
		display: block;
		margin-left: auto;
		margin-right: auto;
		padding-left: 0px;
		padding-right: 0px;
		box-sizing: border-box;
		// font-size: 18rpx;
		text-align: center;
		text-decoration: none;
		// line-height: 1;
		line-height: 1.35;
		// border-radius: 5rpx;
		-webkit-tap-highlight-color: transparent;
		overflow: hidden;
		color: #000000;
		background-color: #fff;
		width: 100%;
		height: 100%;
	}
</style>

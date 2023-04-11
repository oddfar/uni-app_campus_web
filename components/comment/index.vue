<template>
	<view>
		<view>
			<u-line></u-line>
			<!-- 暂无评论 -->
			<!-- 	<view class="no-comment" v-if="commentTotal == 0">
				<u-empty text="评论为空" icon="http://cdn.uviewui.com/uview/empty/comment.png">
				</u-empty>
			</view> -->
			<view class="comment-list">
				<scroll-list ref="commentList" :option="option" @load="getCommentList" @refresh="refresh">
					<view class="comment-row">
						<!-- 评论列表 -->
						<view class="comment-item" v-for="(item, keys) in commentRows" :key="keys"
							style="margin-top: 20px">
							<view class="woo-box-flex">
								<!-- 头像 -->
								<u--image shape="circle" width="40px" height="40px"
									:src="handleCampusUrl(contentObj.params.avatar)" />
								<!-- 昵称、评论内容、时间 -->
								<view class="woo-box-item-flex" style="margin: -2px 0 0 10px">
									<view>
										<span class="comment-nick"> {{ item.userNickName }}</span>
										<!-- 是否是作者 -->
										<span class="comment-item-tag" v-if="item.userId == contentObj.userId"
											style="background: rgb(254, 44, 85)"><span>作者</span>
										</span>
									</view>

									<view style="margin-top: 4px">
										{{ item.coContent }}
									</view>

									<view class="comment-info woo-box-flex woo-box-alignCenter woo-box-justifyBetween">
										<view>
											<span> {{ handelTimeFormat(item.createTime) }} </span>
											<span>·{{ item.address }}</span>
										</view>
										<!-- 删除 回复 -->
										<view class="woo-box-flex" style="margin-right: 20px">
											<view
												class="comment-iconbed woo-box-flex woo-box-alignCenter woo-box-justifyCenter">

											</view>
											<!-- 添加子评论 -->
											<view
												class="comment-iconbed woo-box-flex woo-box-alignCenter woo-box-justifyCenter"
												@click="openCommentChild(item.commentId,keys)">
												<image class="comment-tool-iconbed" src="../../static/icon/comment.png">
												</image>
											</view>
										</view>
									</view>
								</view>
							</view>

							<!-- 更多回复 -->
							<view class="comment-more-replies">
								<MoreReplies :oneLevelId="item.commentId" :commentIndex="keys"
									:commentList="item.children" :contentObj="contentObj"
									:childrenCount="item.childrenCount"></MoreReplies>
							</view>


						</view>
					</view>
				</scroll-list>
			</view>

		</view>

		<u-overlay :show="dialogToComment" v-if="dialogToComment" @click="dialogToComment = false">
			<view class="comment-dialog" @tap.stop :style="{top:comment_css}">
				<view class="woo-box-item-flex" style="padding: 10px;">
					<u--textarea height="70px" :adjust-position="false" placeholder="发布你的回复" v-model="dialogText" count
						maxlength="100" :focus="true">
					</u--textarea>
				</view>
				<view class="woo-box-flex woo-box-alignCenter" style="padding: 10px;">
					<view class="woo-box-item-flex" style="align-self: center"></view>
					<view style="width: 70px;"><button type="primary" round :disabled="dialogText.length <= 0"
							@click="addComment()">
							回复
						</button></view>
				</view>

			</view>
		</u-overlay>

		<!-- 底部 -->
		<view class="footer" v-if="!dialogToComment">
			<view class="comment-box" @click="openCommentChild()">
				<!-- 评论框 -->
				<view class="woo-box-flex">
					<view>
						<u--image shape="circle" width="40px" height="40px"
							:src="handleCampusUrl(contentObj.params.avatar)" />
					</view>
					<view style="padding: 0 10px; width: 90%;">
						<view class="footer-input">
							<view style="padding-left: 10px;">
								发布你的评论
							</view>

						</view>

					</view>

					<view class="woo-box-item-flex">
					</view>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	import touristApi from "@/api/tourist";
	import operateApi from "@/api/operate";


	import {
		isLogin,
		getUserId
	} from "@/utils/auth";
	//组件
	import CommentChild from "@/components/comment/CommentChild";
	import MoreReplies from "@/components/comment/MoreReplies";

	export default {
		name: "Comment",
		props: ["contentObj"],
		components: {
			CommentChild,
			MoreReplies
		},
		data() {
			//这里存放数据
			return {
				option: {
					page: 1,
					size: 5,
					auto: true,
					emptyText: '暂无评论', // 空数据提示文字
					offsetBottom: 100
					// emptyImage: '', // 空数据提示图片
					// emptyText: '', // 空数据提示文字
				},
				commentRows: [],
				//评论请求参数
				commentQuery: {
					contentId: "",
					pageNum: 1,
				},
				//添加评论参数
				toCommentQuery: {
					contentId: null,
					commentId: null,
					coContent: "",
				},
				//登录账户的用户id
				loginUserId: 0,
				//评论总数量
				commentTotal: 0,
				//****分页 */
				total: 0, //一级评论数量
				//****评论弹出框 */
				dialogToComment: false,
				dialogText: "",
				//评论id
				dialogCommentId: "",
				dialogIndex: -1,
				//一级评论内容
				commentOneLevelObj: {},
				comment_css: "",
			};
		},
		//生命周期 - 创建完成（可以访问当前this实例）
		created() {
			// const paging = {
			// 	page: 1,
			// }
			// this.getCommentList(paging);

		},
		//生命周期 - 挂载完成（可以访问DOM元素）
		mounted() {
			if (isLogin()) {
				this.loginUserId = getUserId();
			}
		},
		provide() {
			return {
				openTwoLevelComment: this.openTwoLevelComment,
			}
		},

		//方法集合
		methods: {
			close() {
				this.dialogToComment = false;
				this.dialogText = "";
			},
			//加载一级评论
			getCommentList(paging) {
				this.commentQuery.contentId = this.contentObj.contentId;
				this.commentQuery.pageNum = paging.page;

				touristApi.getOneLevelComment(this.commentQuery).then(({
					data
				}) => {
					for (var i of data.rows) {
						this.commentRows.push(i)
					};
					this.commentRows = this.handleTree(this.commentRows, "commentId");
					console.log(this.commentRows)
					this.commentTotal = parseInt(data.allTotal);
					this.total = parseInt(data.total);

					this.$refs.commentList.loadSuccess({
						list: this.commentRows,
						total: this.total
					});

				});
			},
			refresh(paging) {
				this.commentQuery.contentId = this.contentObj.contentId;
				this.commentQuery.pageNum = 1;

				touristApi.getOneLevelComment(this.commentQuery).then(({
					data
				}) => {
					this.commentRows = this.handleTree(data.rows, "commentId");
					this.commentTotal = parseInt(data.allTotal);
					this.total = parseInt(data.total);

					this.$refs.commentList.loadSuccess({
						list: this.commentRows,
						total: this.total
					});

				});

			},
			//评论成功后
			commentSuccess(response) {
				console.log(response)
			},
			//添加评论或回复评论
			addComment() {
				if (this.dialogCommentId == null) {
					this.addOneLevelComment();
				} else {
					this.addCommentChild();
				}

			},
			addOneLevelComment() {
				this.toCommentQuery.commentId = null;
				this.toCommentQuery.contentId = this.contentObj.contentId;
				this.toCommentQuery.coContent = this.dialogText;
				operateApi.toComment(this.toCommentQuery).then(({
					data
				}) => {
					uni.showToast({
						icon: 'none',
						title: '评论成功'
					})

					this.close();
					this.toCommentQuery.coContent = "";
					var commentId = data.data
					touristApi.getComment(commentId).then(({
						data
					}) => {
						this.commentRows.unshift(data.data)
					});

				});
			},

			//子评论弹出框
			openCommentChild(commentId, keys) {
				this.dialogIndex = -1
				uni.onKeyboardHeightChange(res => {

					// 键盘高度
					let height = res.height;
					height = height + 154 + "px"
					this.comment_css = "calc(100vh - " + height + ");"
				})
				this.dialogToComment = true;
				if (commentId !== undefined) {
					this.dialogCommentId = commentId;
					this.dialogIndex = keys
				} else {
					this.dialogCommentId = null;
				}

			},
			//打开评论框，给二级评论的回复
			openTwoLevelComment(commentId, index) {
				uni.onKeyboardHeightChange(res => {
					// 键盘高度
					let height = res.height;
					height = height + 154 + "px"
					this.comment_css = "calc(100vh - " + height + ");"
				})
				this.dialogToComment = true;
				this.dialogCommentId = commentId;
				this.dialogIndex = index

			},
			//给 一级评论/二级评论 回复
			addCommentChild() {
				this.toCommentQuery.commentId = this.dialogCommentId;
				this.toCommentQuery.contentId = null;
				this.toCommentQuery.coContent = this.dialogText;
				operateApi.toComment(this.toCommentQuery).then(({
					data
				}) => {
					uni.showToast({
						icon: 'none',
						title: '评论成功'
					})

					this.close();
					this.dialogText = "";
					this.toCommentQuery.coContent = "";

					var commentId = data.data
					touristApi.getComment(commentId).then(({
						data
					}) => {
						// this.commentRows.unshift(data.data)
						let commentObj = this.commentRows[this.dialogIndex]
						if (commentObj.children == undefined) {
							this.commentRows[this.dialogIndex].children = [data.data]
							this.commentRows[this.dialogIndex].childrenCount = 1
						} else {
							this.commentRows[this.dialogIndex].children.push(data.data)
							this.commentRows[this.dialogIndex].childrenCount++
						}
					});

				});
			},
		},
	};
</script>
<style>
	.footer {
		width: 100%;
		background-color: white;
		height: 60px;
		line-height: 60px;
		position: sticky;
		bottom: 0;
		z-index: 99999;
	}

	.comment-box {
		height: 50px;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		margin: auto;
	}

	.comment-nick {
		font-weight: bolder;
		font-size: 12px;
		color: #eb7350;
		text-align: left;
	}

	.comment-list {
		font-size: 12px;
		/* font-weight: bolder; */
		line-height: 20px;
		color: #333;
		/* height: 90vh; */
		min-height: 80vh;
	}

	.comment-info {
		height: 22px;
		margin: 1px 0 0;
		color: #939393;
	}

	.comment-iconbed {
		width: 22px;
		height: 22px;
		margin: 0 0 0 10px;
	}

	.comment-more-replies {
		position: relative;
		margin: 6px 0 2px 44px;
	}

	.comment-more-replies::before {
		content: "";
		position: absolute;
		top: 4px;
		bottom: 4px;
		left: 0;
		border-left: 2px solid #f2f2f2;
	}



	.composer_btn {
		width: 68px;
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	/* 作者标签 */
	.comment-item-tag {
		flex-shrink: 0;
		font-size: 10px;
		height: 16px;
		margin-left: 8px;
		color: #fff;

		align-items: center;
		border-radius: 4px;
		display: inline-flex;
		font-weight: 500;
		justify-content: center;
		line-height: 20px;
		padding: 0 4px;
	}

	/* 工具栏图标 */
	.comment-tool-iconbed {
		font-size: 14px;
		color: grey;
		width: 14px;
		height: 14px;
	}

	.CommentFeed_more {
		height: 44px;
		background: #fff;
		font-size: 14px;
		color: #333;
		cursor: pointer;
	}

	.CommentFeed_more:hover {
		color: #eb7350;
	}

	.footer-input {
		display: flex;
		/*垂直居中*/
		align-items: center;
		border: 1px solid #ccc;
		border-radius: 16px;
		font-size: 14px;
		height: 40px;
		color: #939393;
	}

	.comment-dialog {
		position: sticky;
		background-color: #fff;
		width: 100vw;
	}
</style>
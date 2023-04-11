<template>
	<view style="margin-top: 5px">
		<!-- 评论 -->
		<view class="comment-list">
			<!-- 评论列表 -->
			<view class="comment-item" style="margin-top: 10px">
				<view class="woo-box-flex">
					<!-- 头像 -->
					<u--image shape="circle" width="40px" height="40px"
						:src="handleCampusUrl(contentObj.params.avatar)" />
					<!-- 昵称、评论内容、时间 -->
					<view class="woo-box-item-flex" style="margin: -2px 0 0 10px">
						<view>
							<span class="comment-nick"> {{ commentObj.userNickName }}
								<span v-if="commentObj.toUserNickName!=null">
									<!-- <i class="el-icon-caret-right" style="color:black"></i> -->
									<span style="color:black"> -> </span>
									@{{ commentObj.toUserNickName }}
								</span>
							</span>
							<!-- 是否是作者 -->
							<span class="comment-item-tag" style="background: rgb(254, 44, 85)"
								v-if="commentObj.userId == contentObj.userId"><span>作者</span>
							</span>
						</view>

						<view style="text-align: left; margin-top: 5px">
							{{ commentObj.coContent }}
						</view>

						<view class="comment-info woo-box-flex woo-box-alignCenter woo-box-justifyBetween">
							<view>
								<span> {{ handelTimeFormat(commentObj.createTime) }} </span>
								<span>·{{ commentObj.address }}</span>
							</view>
							<view class="woo-box-flex" style="margin-right: 20px">
								<view class="comment-iconbed woo-box-flex woo-box-alignCenter woo-box-justifyCenter">
									<!-- 	<image class="comment-tool-iconbed" v-if="commentObj.userId == loginUserId"
										src="../../static/icon/comment.png"></image> -->
								</view>

								<view class="comment-iconbed woo-box-flex woo-box-alignCenter woo-box-justifyCenter"
									@click="openCommentChild(commentObj.commentId)">
									<image class="comment-tool-iconbed" src="../../static/icon/comment.png"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-overlay :show="dialog" v-if="dialog" @click="close">
			<view class="comment-dialog" @tap.stop :style="{top:comment_css}">
				<view class="woo-box-item-flex" style="padding: 10px;">
					<u--textarea height="70px" :adjust-position="false" placeholder="发布你的回复" v-model="dialogText" count
						maxlength="100" :focus="true">
					</u--textarea>
				</view>
				<view class="woo-box-flex woo-box-alignCenter" style="padding: 10px;">
					<view class="woo-box-item-flex" style="align-self: center"></view>
					<view style="width: 60px;"><button type="primary" round :disabled="dialogText.length <= 0"
							@click="addCommentChild()">
							回复
						</button></view>
				</view>

			</view>
		</u-overlay>

	</view>
</template>

<script>
	import {
		getToken,
		getUserId
	} from "@/utils/auth";
	import operateApi from "@/api/operate";


	export default {
		name: "CommentUser",
		props: ["commentObj", "contentObj", "commentIndex"],
		inject: ["openTwoLevelComment"],
		data() {
			//这里存放数据
			return {
				loginUserId: 0,
				//添加评论参数
				toCommentQuery: {
					contentId: null,
					commentId: null,
					coContent: "",
				},
				//****评论弹出框 */
				dialog: false,
				dialogText: "",
				dialogCommentId: "",
				comment_css: "0",
			};
		},
		//生命周期 - 创建完成（可以访问当前this实例）
		created() {},
		//生命周期 - 挂载完成（可以访问DOM元素）
		mounted() {
			if (getToken() !== undefined) {
				this.loginUserId = getUserId();
			}
		},
		//方法集合
		methods: {
			//添加子评论
			openCommentChild(commentId) {
			
				this.openTwoLevelComment(commentId, this.commentIndex)
			},
			addCommentChild() {
				this.toCommentQuery.commentId = this.dialogCommentId;
				this.toCommentQuery.contentId = null;
				this.toCommentQuery.coContent = this.dialogText;
				this.dialog = false;
				operateApi.toComment(this.toCommentQuery).then((response) => {

					uni.showToast({
						icon: 'none',
						title: '评论成功'
					})
					this.dialogText = "";
					const res = {
						params: this.toCommentQuery,
						response: response
					}
					this.$emit("co-success", res);
				});
			},
			close() {
				this.dialog = false;
			}
		},
	};
</script>
<style>
	.comment-nick {
		font-weight: bolder;
		font-size: 12px;
		color: #eb7350;
		text-align: left;
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
		width: 14px;
		height: 14px;
		color: grey;
		margin: 0 0 0 10px;
		position: relative;
	}

	.comment-info {
		height: 22px;
		margin: 1px 0 0;
		color: #939393;
	}

	.comment-dialog {
		position: absolute;
		background-color: #fff;
		width: 100vw;
	}
</style>
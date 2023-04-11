<template>
	<view class="comment-more-list">
		<view class="comment-more-item">
			<!-- 作者评论内容 -->
			<view v-for="(item, keys) in commentRows" :key="keys">
				<CommentUser :commentObj="item" :contentObj="contentObj" :commentIndex="commentIndex" @co-success="commentSuccess" />
			</view>
		</view>

		<!-- 更多评论的数量 -->
		<view class="comment-more-item" v-if="childrenCount >0" @click="getMoreComment()">
			<view style="color: #eb7350; text-align: left">
				<span v-if="(commentList !== undefined && childrenCount>1)&&childrenCount>commentList.length
				&&!clickMoreComment">
					共{{childrenCount-commentList.length}}条回复
				</span>
				<span v-if="(commentList == undefined && childrenCount>1)
					&&!clickMoreComment">
					共{{childrenCount}}条回复
				</span>

				<span v-if="clickMoreComment">
					{{moreCommentTip}}
				</span>

			</view>
		</view>


	</view>


</template>

<script>
	import CommentUser from "@/components/comment/CommentUser";
	import {
		isLogin,
		getUserId
	} from "@/utils/auth";
	import operateApi from "@/api/operate";
	import touristApi from "@/api/tourist";

	export default {
		name: "MoreReplies",
		components: {
			CommentUser
		},
		//commentObj一级评论
		// props: ["commentList", "contentObj", "childrenCount"],
		props: {
			commentList: {
				type: Array,
			},
			contentObj: {
				type: Object,
			},
			childrenCount: {
				type: Number,
			},
			//一级评论id
			oneLevelId: {
				type: String,
			},
			commentIndex:{
				type: Number
			}
		},
		data() {
			//这里存放数据
			return {
				loginUserId: 0,
				commentRows: null,
				//根据查询的二级评论id
				twoLevelCommentId: "0",
				clickMoreComment: false,
				//提示
				moreCommentTip: "查看更多回复",
				moreChildrenCount: 0,
				//自己评论的数量
				commentCount: 0,
			};
		},
		//生命周期 - 创建完成（可以访问当前this实例）
		created() {

		},
		//生命周期 - 挂载完成（可以访问DOM元素）
		mounted() {
			if (isLogin()) {
				this.loginUserId = getUserId();
			}
		},
		watch: {
			commentList: {
				immediate: true, // 很重要！！！
				handler(newValue, oldValue) {
					this.commentRows = newValue
				}
			},

		},
		//方法集合
		methods: {
			//评论成功回调
			commentSuccess(res) {
				console.log(res);
				this.commentCount++;
				var commentId = res.response.data.data
				touristApi.getComment(commentId).then(({
					data
				}) => {
					this.commentRows.push(data.data)
				});
			},
			getMoreComment() {
				if (this.commentRows.length >= this.childrenCount + this.commentCount) {
					this.moreCommentTip = "没有评论啦～"
					return;
				}
				if (this.clickMoreComment) {
					var commentId = this.commentRows[this.commentRows.length - 1].commentId
				} else {
					var commentId = this.oneLevelId;
					this.clickMoreComment = true;
				}

				touristApi.getCommentChildrenList(commentId).then(({
					data
				}) => {

					for (var i of data.data) {
						//没有此评论则添加
						if (JSON.stringify(this.commentRows).indexOf(JSON.stringify(i.commentId)) == -1) {
							this.commentRows.push(i)
						}
					};
					if (this.commentRows.length >= this.childrenCount) {
						this.moreCommentTip = "没有评论啦～"
					}
				});


			}
		},
	};
</script>
<style>
	.comment-more-list {
		padding: 0 0 0px 10px;
		line-height: 20px;
		font-size: 12px;
	}

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
</style>
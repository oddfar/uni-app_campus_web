<template>
	<view>
		<view class="row">
			<view class="left">
				<view class="title">
					<span v-if="commentObj.toUserId==-1">发表评论</span>
					<span v-else>回复 {{commentObj.toUserNickName}} 评论</span>
				</view>
				<view class="coContent"><span>{{commentObj.coContent}}</span></view>
			</view>
			<view class="right" @click="clickContent">
				<view class="content-text"><span>{{commentObj.contentText}}</span></view>
			</view>
		</view>
		<view class="time"><span>{{commentObj.createTime}}</span></view>

	</view>
</template>

<script>
	export default {
		name: "ownComment",
		props: ["commentObj"],
		data() {
			return {};
		},
		onReady() {

		},
		methods:{
				
			clickContent(){
				uni.navigateTo({
					url: '/pages/c/index?id=' + this.commentObj.contentId
				})
			}
		}

	}
</script>

<style>
	.row {
		display: flex;
		align-content: center;
		justify-content: space-between;
	}

	.left {
		/* margin-left: 10px; */
	}

	.left .title {
		font-size: 18px;
		color: grey;
	}

	.left .coContent {
		padding-top: 10px;
		font-size: 16px;
	}

	.right {
		/* margin-right: 10px; */
		width: 100px;
		background-color: #DCDCDC;
		border-radius: 10px;
	}

	.right .content-text {
		padding: 20px;
		width: 70px;
		line-height: 25px;
	}


	.time {
		font-size: 12px;
		/* margin-left: 10px; */
	}
</style>

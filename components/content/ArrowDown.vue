<template>
	<view>
		<!-- 弹出框 -->
		<u-popup :show="arrShow" mode="bottom" @close="close" :round="10">
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
					<button type="default" @click="arrShow = false">取消</button>
				</view>
			</view>

		</u-popup>
	</view>
</template>

<script>
	import {
		isLogin,
		getUserId
	} from "@/utils/auth";
	import operateApi from "@/api/operate";
	
	export default {
		name: "ArrowDown",
		props: ["contentObj", "show", "time"],
		data() {
			return {
				arrShow: false,
				loginUserId: 0
			};
		},
		watch: {
			time: {
				immediate: true,
				handler(newValue, oldValue) {
					if (newValue != null) {
						this.arrShow = true
					}
				}
			},

		},
		created() {
			if (isLogin()) {
				this.loginUserId = getUserId();
			}
		},
		methods: {
			close() {
				this.arrShow = false
			},
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
								this.close();
			
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

		}

	}
</script>

<style>
	.popup-span {
		color: #939393;
		font-size: 12px;
	}

	.popup-icon {
		text-align: center;
		margin-right: 10px;

	}
</style>
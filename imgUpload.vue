<template>
	<view class="section">
	
		<view class="top">
			<view class="title">11111</view>
			<view v-if="require" class="status">*</view>
			<image class="icon"></image>
		</view>
		<image class="add" @click="choosePhoto"></image>
		<view v-if="tipTxt">
			{{tipTxt}}
			111111<br />22222
		</view>
		<slot name="tip"></slot>
	</view>
</template>

<script>
	export default{
		props:{
			
			title:{
				type:String,
				default:''
			},
			require:{
				type:Boolean,
				default:false,
			},
			tipTxt:{
				type:String,
				default:''
			},
			limit:{
				type:Number,
				default:0
			}
		},
		
		methods:{
			choosePhoto(){
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function (res) {
						console.log(JSON.stringify(res.tempFilePaths));
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.section{
		.top{
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			.title{
				
			}
			.status{
				
			}
			.icon{
				width: 30rpx;
				height: 30rpx;
				background: yellow;
			}
		}
		.add{
			width: 100rpx;
			height: 100rpx;
			background: red;
		}
	
	}
</style>
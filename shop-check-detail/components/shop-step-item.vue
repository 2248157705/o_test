<template>
	<!-- <view :class="{'step-item':true,  last:!isLast}"> -->
	<view :class="['step-item separation',process]">
		<view class="head">
			<image v-if="process==='finish'" class="icon"></image>
			<view v-else class="status">{{status}}</view>
			<view class="title">{{title}}</view>
		</view>
		<view class="subject">
			<slot />
		</view>
	</view>
</template>

<script>
	export default{
		name:'ShopStepItem',
		props:{
			title:{
				type:String,
				default:''
			},
			status:{
				type:Number,
				default:1
			},
			isLast:{
				type:Boolean,
				default:false
			},
			current:{
				type:Number,
				default:1,
			}
		},
		data(){
			return{
				
			}
		},
		computed:{
			process(){
				if(this.status==1){
					return 'finish'
				}
				if(this.status< this.current){
					return 'finish'
				}
				if(this.status==this.current){
					return 'active'
				}
				if(this.status>this.current){
					return 'inactive'
				}
				
			}
		}
	}
</script>


<style lang="scss" scoped>
	
	
	.separation{
		&:before{
			content: '';
			height: 100%;
			left: 24px;
			position: absolute;
			//实线
			width: 8rpx;
		}
	}
	
	.finish{
		&:before{
			background: blue;
		}
	}
	
	.inactive{
		&:before{
			background: gray;
		}
	}

	
	.last{
		&:before{
			content: '';
			height: 100%;
			left: 24px;
			position: absolute;
			//实线
			width: 8rpx;
			background: blue;
			//虚线
			// border: 4rpx dashed red;
		}
	}
	.step-item{
		position: relative;
		// background: red;
		.head{
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			background: white;
			position: absolute;
			top: 0rpx;
			left: 20rpx;
			padding: 16rpx 0rpx;
			
			
			.icon{
				width: 50rpx;
				height: 50rpx;
				background: greenyellow;
			}
			
		
			.status{
				background: orange;
				font-size: 28rpx;
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				text-align: center;
				line-height: 60rpx;
				font-size: 28rpx;
				margin-right: 20rpx;
			}
			.title{
				font-size: 32rpx;
			}
		}
		.subject{
			font-size: 28rpx;
			padding: 80rpx 0rpx 0rpx 120rpx;
			// background: green;
		}
	}
</style>
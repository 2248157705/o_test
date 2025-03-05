<template>
	<u-popup :show="show" class="p-address">
		<view class="p-content">
			<view class="head">
				<view class="title">{{title}}</view>
				<image class="close" @click="close"></image>
			</view>
			<u-search class="search" :showAction="false"></u-search>
			<view class="area">
				<view class="area-item" v-for="(item,index) in address" :key="item">
					<view class="top">
						<view class="left">
							<image class="icon"></image>
							<view class="name">{{item}}</view>
						</view>
						<image class="next"></image>
					</view>
					<view class="separation" v-if="index<address.length-1"></view>
				</view>
			</view>
			
			<view class="list">
				<view class="cell" v-for="(item,index) in 8">
					<view class="title">111111</view>
					<image class="icon"></image>
				</view>
			</view>
		</view>
	
	</u-popup>

		
	</view>
</template>

<script>
	export default{
		props:{
			title:{
				type:String,
				default:''
			}
		},
		data(){
			return{
			 show:false,
				 // address:['选择省份','选择城市','选择区域']
				  address:['选择省份']
			}
		},
		methods:{
			open(){
				this.show=true
			},
			close(){
				this.show=false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.p-address{
		.p-content{
			height: 80vh;
			padding: 24rpx;
			.head{
				position: relative;
				.title{
					width: 100%;
					text-align: center;
					
				}
				.close{
					width: 50rpx;
					height: 50rpx;
					position: absolute;
					right: 40rpx;
					top:30rpx;
					background: yellow;
				}
			}
			.search{
				
			}
			.area{
				.area-item{
					.separation{
						width: 4rpx;
						height: 50rpx;
						margin: 8rpx 0rpx 16rpx 16rpx;
						background: red;
					}
					.top{
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						.left{
							display: flex;
							flex-direction: row;
							justify-content: flex-start;
							align-items: center;
							.icon{
								width: 40rpx;
								height: 40rpx;
								background: yellow;
							}
							.name{
								text-align: left;
								font-size: 28rpx;
								margin: 0rpx 16rpx;
							}
						}
						.next{
							width: 50rpx;
							height: 50rpx;
							background: blue;
						}
					}
					
				}
			}
			.list{
				.cell{
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1rpx solid red;
					.title{
						
					}
					.icon{
						width: 50rpx;
						height: 50rpx;
						background: yellow;
					}
				}
			}
		}

	}
</style>
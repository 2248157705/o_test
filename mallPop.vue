<template>
	<u-popup :show="show" class="mall">
		<view class="wrap">
			<view class="head">
				<view class="cancel" @click="close">取消</view>
				<view class="confirm" @click="confirm">确定</view>
				<view class="title">11111</view>
			</view>
			<u-search class="search"></u-search>
			<u-list class="list">
				<view class="cell" v-for="(item,index) in list" :key="index" @click="select(item)">
					<view class="txt">{{item}}</view>
					<image class="icon"></image>
				</view>
			</u-list>
		</view>
	</u-popup>
</template>

<script>
	export default{
		props:{
			list:{
				type:Array,
				default:()=>[]
			},
		
		},
		data(){
			return{
				show:false,
				value:{}
			}
		},
		methods:{
			open(){
				this.show=true
			},
			close(){
				console.log('9999999')
				this.show=false
			},
			confirm(){
				this.$emit('change',this.value)
				this.close()
			},
			select(item){
				console.log('8777777',item)
				this.value=item
			}
		}
	}
</script>

<style>
	.mall{
		.wrap{
			height: 75vh;
			.head{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				position: relative;
				
				.cancel{
					width: 100rpx;
					height: 100rpx;
					background: yellow;
				}
				.confirm{
					width: 100rpx;
					height: 100rpx;
				}
				.title{
					position: absolute;
					left: 0rpx;
					width: 100%;
					text-align: center;
					z-index: -1;
				}
			}
			.list{
				flex:1;
			
				.cell{
					flex:1;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
				
					.txt{
						
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
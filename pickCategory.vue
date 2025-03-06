<template>
	<view class="cate-page">
		<view class="head">
			<view class="title">ddd</view>
			<image class="close"></image>
		</view>
		<u-search class="search"></u-search>
		<view class="category">
			<u-list class="left">
				<view class="l-cell" v-for="(itemL,index) in listL" :key="index">
					<text>{{itemL}}</text>
				</view>
			</u-list>
			<u-list class="right">
				<view class="r-cell" v-for="(rItem,rIndex) in listR" :key="rIndex">
					<text>{{rItem}}</text>
				</view>
			</u-list>
		</view>
		<view class="footer">
			<view class="clear">clear</view>
			<view class="confirm">confirm</view>
		</view>
	</view>

</template>

<script>
	export default{
		data(){
			
			let listL=[]
			let listR=[]
			for(let i=0;i<50;i++){
				listL.push(i)
				listR.push(i+200)
			}
			
			return{
				listL,
				listR
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.cate-page{
		margin-bottom: 90rpx;
		
		.head{
			position: relative;
			.title{
				background: orange;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				
			}
			.close{
				top: 0rpx;
				position: absolute;
				right: 30rpx;
				background: red;
				width: 60rpx;
				height: 60rpx;
			}
		}
		.search{
			
		}
		.category{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-start;
			height: 800rpx;
			overflow: hidden;
			// flex: 1;
			.left{
				background: yellow;
				flex: 1;
				.l-cell{
					padding: 20rpx 0rpx;
					border-bottom: 1rpx solid red;
				}
			}
			.right{
				background: blue;
				flex: 6;
				.r-cell{
					padding: 20rpx 0rpx;
					border-bottom: 1rpx solid green;
				}
			}
		}
		.footer{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			height: 120rpx;
			position: absolute;
			left: 0rpx;
			width: 100%;
			background: green;
			.clear{
				height: 120rpx;
				flex: 1;
				background: red;
			}
			.confirm{
				height: 120rpx;
				flex: 1;
				background: blue;
			}
		}
	}

</style>
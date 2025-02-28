<template>
	<view>
		<view>华润前海万象城</view>
		<u-form :model="form">
			<u-form-item label="ggg" prop="form.name">
				<u-radio-group v-model="form.sex">
					<u-radio label="man" name="man"></u-radio>
					<u-radio label="woman" name="woman"></u-radio>
				</u-radio-group>
			</u-form-item>
		</u-form>
		<view>
			<view>行业</view>
			<view>品牌</view>
			<view>经营状态</view>
		</view>
		
		<view>
			<view> 校准步骤</view>	
			<shop-step :current="current"/>
			
		</view>
		
	</view>
</template>

<script>
	 import ShopStep from "./components/shop-step.vue"
	export default{
		components:{
			ShopStep,
		},
		data(){
			return{
				current:1,
				form:{
					name:'11',
					sex:''
				}
			}
		}
	}
</script>

<style lang="scss">
	.step-item{
		position: relative;
		// background: red;
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
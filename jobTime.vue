<template>
	<view class="job">
		
<!-- 		<u-form style="padding: 30rpx;" labelPosition="top">
			<u-form-item borderBottom label="0000">
				<u-textarea autoHeight border="none" count  maxlength="20""></u-textarea>

			</u-form-item>
			
			<u-form-item borderBottom label="0000">
				<u-input border="none">
					
					<text class="phone-prefix" slot="prefix">99999</text>
				</u-input>
			</u-form-item>
			
			
			
			
		</u-form> -->
		
		
		
		
		
		<view class="title"></view>
		<view class="section">
			<view class="head">
				<view class="name"></view>
				<image class="del"></image>
			</view>
			
			<view class="list">
				<view v-for="(item,index) in 9" :key="index" class="item">
					{{index}}
				</view>
			</view>
			
			
			
			<view class="time-section">
				<view class="left" @click="handleTime">
					<view class="start">09:30</view>
					<view class="separate"></view>
					<view class="end">12:30</view>
				</view>
				<image class="time-del"></image>
			</view>
			
			
			<u-tabs :scrollable="false" :list="tabList"></u-tabs>
			
			
			
			
		</view>
		
		   <u-datetime-picker
		                :show="dateShow"
		                v-model="value"
		                mode="date"
		        ></u-datetime-picker>
		
		
	</view>
</template>

<script>
	
	export default{
		data(){
			return{
				dateShow:false,
				value:'',
				tabList:[
					{name:'基本信息'},
					{name:'照片信息'},
					{name:'联系方式'}
					]
			}
		},
		methods:{
			handleTime(){
				this.dateShow=true
			}
		}
	}
</script>

<style>
	
	
	.phone-prefix{
		background: red;
		color: blue;
	}
	.job{
		.title{
			
		}
		.section{
			.head{
				.name{
					
				}
				.del{
					
				}
			}
			.list{
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				flex-wrap: wrap;
				.item{
					width: 28%;
					margin: 2%;
					background: red;
				}
			}
			.time-section{
				display: flex;
				flex-direction: row;
				/* justify-content: space-between; */
				align-items: center;
				background: greenyellow;
				.left{
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
						flex: 1;
					.start{
						background: yellow;
						height: 50rpx;
						flex: 1;
					
					}
					.separate{
						width: 80rpx;
						height: 20rpx;
						background: blue;
						margin: 0rpx 20rpx;
					}
					.end{
						background: orange;
						height: 50rpx;
						flex: 1;
					}
				}
				.time-del{
					background: red;
					width: 40rpx;
					height: 40rpx;
				}
			}
			
			
		}
	}
</style>
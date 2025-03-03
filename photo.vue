<template>
	<view class="photo">
		
		
		<img-upload title='000000'
				></img-upload>
				
				
		<gallary></gallary>
	
			
	
		
		<view class="section">
			<view class="top">
				<view class="title">11111</view>
				<view v-if="require" class="status">*</view>
				<image class="icon"></image>
			</view>
			<image class="add"></image>
			<view v-if="tipTxt">
				{{tipTxt}}
				111111<br />22222
			</view>
			<slot name="tip"></slot>
		</view>
		
		
		
	</view>
</template>

<script>
	import ImgUpload from './components/imgUpload.vue'
	import Gallary from './components/gallary.vue'
	export default{
		components:{
			ImgUpload,
			Gallary
		},
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
		data(){
			return{
				
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.photo{
		
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
	
	}
</style>
<template>
	<view>
		<view>华润前海万象城</view>
		<u-form :model="form" style="margin: 20rpx;padding: 20rpx;">
			<u-form-item class="form-item" label="ggg" prop="form.name">
				
				
				  <button @click="autoLocation">定位当前位置</button>
				    <button @click="setMapMarker">添加标记物</button>
				    <button @click="clearMapMarker">清空标记物</button>
			<!-- <my-radio></my-radio> -->
				
	<!-- 			<view @click="form.sex='man'">
					<image v-if="form.sex==='man'"  src="/static/2.webp" style="width: 40rpx;height: 40rpx"></image>
					<image v-else  src="/static/3.webp" style="width: 40rpx;height: 40rpx"></image>
					<text>man</text>
				</view>
				
				<view @click="form.sex='woman'">
					<image v-if="form.sex==='woman'"  src="/static/1.webp" style="width: 40rpx;height: 40rpx"></image>
					<image v-else  src="/static/3.webp" style="width: 40rpx;height: 40rpx"></image>
					<text>woman</text>
				</view> -->
				
				
				
		<!-- 		<u-radio-group v-model="form.sex">
					<u-radio label="man" name="man">
						<image slot="icon" src="/static/2.webp" style="width: 40rpx;height: 40rpx"></image>
					</u-radio>
					<u-radio label="woman" name="woman">
						<image slot="icon" src="/static/1.webp" style="width: 40rpx;height: 40rpx"></image>
					</u-radio>
				</u-radio-group> -->
			</u-form-item>
			
			<u-form-item label="name" prop="form.name" required>
				<u--input v-model="form.name"/>
			</u-form-item>
			
			
		</u-form>
		<view>
			<view>行业</view>
			<view>品牌</view>
			<view>经营状态</view>
		</view>
		
		
		  <lyf-googleMap style="width: width: 100%;height: 500rpx;" ref="googleMapInstace" :marketList="markers"
		      :centerPoint="selfLocation" @markerClick="markerClick" @gMapRenderComplete="gMapRenderComplete"
		      :googleKey="googleKey"></lyf-googleMap>
		
		<!-- <lyf-googleMap google-key="AIzaSyChbJQQ5ieFkKn2T5aDurZSyIxYywsMCmw"></lyf-googleMap> -->
		
	<!-- 	<view>
			<view> 校准步骤</view>	
			<shop-step :current="current"/>
			
		</view> -->
		
	</view>
</template>

<script>
	 import ShopStep from "./components/shop-step.vue"
	 import MyRadio from "./components/my-radio.vue"
	export default{
		components:{
			ShopStep,
			MyRadio
		},
		data(){
			return{
				
				
				     googleKey: 'AIzaSyChbJQQ5ieFkKn2T5aDurZSyIxYywsMCmw', // 需要去申请谷歌key
				        /*
				          设置地图中心点
				          格式: 
				            {
				              lat: 23.15063,
				              lng: 113.38599
				            }
				        */
				        selfLocation: {},
				        /*
				          设置标记物
				          格式：
				          {
				            icon: 'https://tpsite.oss-cn-hangzhou.aliyuncs.com/1/material/5f899981-c836-47d8-b8ed-d6b83da59aa4.png',
				            position: {
				              lat: 23.222,
				              lng: 121.122
				            }
				          }
				        */
				        markers: [],
				
				
				current:1,
				form:{
					name:'11',
					sex:''
				}
			}
		},
		    methods: {
		      // google地图渲染完成
		      gMapRenderComplete() {
		        console.log('google地图渲染完成');
		
		        // 可以在这里设置地图标记物和设置地图中心点
		        this.selfLocation = {
		          // lat: 23.15063,
		          // lng: 113.38599,
				  
				  lat: 22.53,
				  lng:  113.97,
				  
				  
				 
		        }
		      },
		      // 自动定位
		      autoLocation() {
		        this.$refs.googleMapInstace.autoLocation();
		      },
		      // 标记物被点击
		      markerClick(e) {
		        console.log('markder点击啦', e);
		      },
		      // 清除标记物
		      clearMapMarker() {
		        this.markers = [];
		      },
		      // 设置标记物
		      setMapMarker() {
		
		        this.markers = [{
		          icon: 'https://tpsite.oss-cn-hangzhou.aliyuncs.com/1/material/5f899981-c836-47d8-b8ed-d6b83da59aa4.png',
		          position: {
		          lat: 23.15086,
		          lng: 113.38599
		          }
		        }, {
		          icon: 'https://tpsite.oss-cn-hangzhou.aliyuncs.com/1/material/5f899981-c836-47d8-b8ed-d6b83da59aa4.png',
		          position: {
		            lat: 23.15086,
		            lng: 113.38579
		          }
		        }]
		
		      }
		    },
	}
</script>

<style lang="scss" scoped>
	

	// /deep/.u-form-item__body__left__content{
	// 	padding-right: 0rpx;
	// 	background: red;
	// 	flex: 0;
	// }
	
	
	// /deep/.u-form-item__body__left__content__label{
	// 	&::after{
	// 		content: '*';
	// 		margin-left: 10rpx;
	// 	}
	// }
	
	
	::v-deep .u-form-item__body__left__content__label{
		&::after{
			content: '*';
			margin-left: 10rpx;
		}
	}
	
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
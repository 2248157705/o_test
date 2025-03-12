<template>
	<view class="photo">
		
		
		      <u-navbar
		        title="99999"
		        :placeholder="true"
		        :safeAreaInsetTop="true"
		        :autoBack="false"
		        bgColor="transparent"
		      >
		        <template #left>
		          <!-- <text class="u -nav-title"> 消息!999 </text> -->
		          <u--image
		            style="background: yellow;"
		            width="148rpx"
		            height="36rpx"
		          />
		        </template>
	<!-- 	        <template #right>
		          <view class="i-right">
		            <text class="title">清除未读</text>
		            <u--image
		              style="background: red;"
		              width="48rpx"
		              height="48rpx"
		            />
		          </view>
		        </template> -->
		      </u-navbar>
		
		
		
		
		
		
		<pick-address title="City" ref="pickAddressRef"></pick-address>
		
		<img-upload title='000111000' :number="1"></img-upload>
		
		
		

		
		
		
		<!-- <job-time></job-time> -->
		
		<view class="test" @click="chooseMall"  style="width: 150rpx;height: 150rpx;background: red;">pop</view>
		
		
		<mall-pop ref="mallPop" :list="['1','2','3','4']" @change="getMall">
			
		</mall-pop>
				
				
		<!-- <gallary></gallary> -->
	
			
	
		
<!-- 		<view class="section">
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
		 -->
		
		
	</view>
</template>

<script>
	import ImgUpload from './components/imgUpload.vue'
	import Gallary from './components/gallary.vue'
	import MallPop from './components/mallPop.vue'
	import JobTime from './components/jobTime.vue'
	import PickAddress from './components/pickAddress.vue'
	// import { debounce } from "lodash-es";
	// import Cascader from '@/components/vant/lib/cascader/index.js'
	export default{
		components:{
			ImgUpload,
			Gallary,
			MallPop,
			JobTime,
			PickAddress,
			// Cascader
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
				show1:false
				
			}
		},
		methods:{
			
			
			
			
			
		 // markBargainMsg : debounce((msg) => {
			//   const template = msg.attach?.option?.template;
			//   const { content } = msg.attach?.option || {};
			
			//   if (
			//     template === MsgTemplate.PRODUCT_COUNTER_OFFER ||
			//     template === MsgTemplate.PRODUCT_COUNTER_OFFER_ACCEPTED ||
			//     template === MsgTemplate.PRODUCT_COUNTER_OFFER_REJECTED ||
			//     template === MsgTemplate.PRODUCT_PRICE_REDUCE_ACCEPTED
			//   ) {
			//     const userStore = useUserStore();
			//     userStore.getMyInfoV2({ order_unread_resp: true });
			//   }
			// }, 800),
			
			
			
			
			
			getMall(){
				
			},
			chooseMall(){
				// this.$refs.mallPop.open()
				this.$refs.pickAddressRef.open()
			},
		
		/**
		 * 添加水印到图片
		 * @param {File} file 图片文件
		 * @param {string} gasName 油站名称
		 * @param {string} location 地址
		 * @returns {Promise<Blob>} 返回添加水印后的 Blob 对象
		 */
		addWatermarkToImage(file, gasName, location) {
		  return new Promise((resolve, reject) => {
		    const img = new Image();
		    img.src = URL.createObjectURL(file);
		
		    img.onload = () => {
		      const canvas = document.createElement("canvas");
		      const ctx = canvas.getContext("2d");
		
		   
		      const watermarkWidthPercentage = 0.9;
		
		      canvas.width = img.width;
		      canvas.height = img.height;
		
		      ctx.drawImage(img, 0, 0);
		
		     
		      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
		      ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		     
		      const watermarkWidth = canvas.width * watermarkWidthPercentage;
		      const watermarkX = (canvas.width - watermarkWidth) / 2; 
		
		      const currentDate = new Date();
		      const timeString = currentDate.toLocaleTimeString([], {
		        hour: "2-digit",
		        minute: "2-digit",
		      });
		
		      
		      const dateString = currentDate.toLocaleDateString();
		      const dayOfWeek = new Intl.DateTimeFormat("en-US", {
		        weekday: "long",
		      }).format(currentDate);
		      CanvasUtils.drawText(
		        ctx,
		        `${dateString} ${dayOfWeek} ${timeString}`,
		        CanvasUtils.calculateFontSize(watermarkWidth),
		        CanvasUtils.calculateFontSize(watermarkWidth) * 2,
		        watermarkX + watermarkWidth / 2
		      );
		
		     
		      CanvasUtils.drawText(
		        ctx,
		        gasName,
		        CanvasUtils.calculateFontSize(watermarkWidth),
		        CanvasUtils.calculateFontSize(watermarkWidth) * 3.5,
		        watermarkX + watermarkWidth / 2
		      );
		
		   
		      CanvasUtils.drawText(
		        ctx,
		        location,
		        CanvasUtils.calculateFontSize(watermarkWidth),
		        CanvasUtils.calculateFontSize(watermarkWidth) * 5,
		        watermarkX + watermarkWidth / 2
		      );
		
		      canvas.toBlob((blob) => {
		        resolve(blob);
		      }, file.type);
		    };
		
		    img.onerror = (error) => {
		      reject(error);
		    };
		  });
		},
		
			
			/**
			 * 将图像文件压缩以减小其大小。
			 * @param {File} file - 要压缩的图像文件。
			 * @param {number} maxSizeMB - 压缩后图像的最大大小，以兆字节为单位。
			 * @returns {Promise<File>} 一个解析为压缩后图像文件的 Promise。
			 */
			compressImage(file, maxSizeMB) {
			  return new Promise((resolve, reject) => {
			    let reader = new FileReader();
			
			    reader.onload = function () {
			      let img = new Image();
			
			      img.onload = function () {
			        let canvas = document.createElement("canvas");
			        let ctx = canvas.getContext("2d");
			        let maxSizeBytes = maxSizeMB * 1024 * 1024;
			        let scaleFactor = 0.5;
			
			        if (file.size > maxSizeBytes) {
			          scaleFactor = Math.min(
			            scaleFactor,
			            Math.sqrt(maxSizeBytes / file.size)
			          ); // 计算缩放比例，保持宽高比
			        }
			
			        canvas.width = img.width * scaleFactor;
			        canvas.height = img.height * scaleFactor;
			        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			
			        canvas.toBlob(
			          (blob) => {
			            const compressedFile = new File([blob], file.name, {
			              type: file.type,
			              lastModified: Date.now(),
			            });
			            resolve(compressedFile);
			          },
			          file.type,
			          0.8 // 设置压缩质量参数为 0.8
			        );
			      };
			
			      img.onerror = reject;
			
			      img.src = reader.result;
			    };
			
			    reader.onerror = reject;
			
			    reader.readAsDataURL(file);
			  });
			},
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
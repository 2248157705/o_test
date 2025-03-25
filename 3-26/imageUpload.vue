<template>
	<view class="section">
		
		
	

		<view class="top">
			<view class="title">11111</view>
			<view v-if="require" class="status">*</view>
			<image class="icon"></image>
		</view>
		<image v-if="!imageList.length"  @click="pickMedia" class="add screenshot"></image>
		
		
		
		
		
		    <view style="width: 680rpx;background: red" class="con" :class="{ active: imageList.length }">
		      <movable-area
		        class="area"
		        :style="{ height: areaHeight }"
		        @mouseenter="mouseenter"
		        @mouseleave="mouseleave"
		      >
		        <block v-for="(item, index) in imageList" :key="item.id">
		          <movable-view
		            class="view"
		            :x="item.x"
		            :y="item.y"
		            direction="all"
		            :damping="40"
		            :disabled="item.disable"
		            :style="{
		              width: viewWidth + 'px',
		              height: viewWidth + 'px',
		              'z-index': item.zIndex,
		              opacity: item.opacity,
		            }"
		            @change="onChange($event, item)"
		            @touchstart="touchstart(item)"
		            @mousedown="touchstart(item)"
		            @touchend="touchend(item)"
		            @mouseup="touchend(item)"
		          >
		            <view class="area-con">
		              <image
		                class="pre-image"
		                :src="item.src"
		                mode="aspectFill"
		              ></image>
		              <view
		                v-show="item.progress > 0 && item.progress < 100"
		                class="progress"
		              >
		                {{ item.progress }}%
		              </view>
					  
					        <view
					                  class="del-con"
					                  @click="delImage(item, index)"
					                  @touchstart.stop="delImageMp(item, index)"
					                  @touchend.stop="nothing()"
					                  @mousedown.stop="nothing()"
					                  @mouseup.stop="nothing()"
					                >
					                  <view class="del-wrap">
					                    <image
					                      class="del-image"
					                    
					                    ></image>
					                  </view>
					                </view>
		    
		            </view>
		          </movable-view>
		        </block>
		        <view
		          v-if="imageList.length < number"
		          class="add"
		          :style="{
		            top: add.y,
		            left: add.x,
		            width: viewWidth + 'px',
		            height: viewWidth + 'px',
		          }"
		          @click="addImages"
		        >
		    		<image src="/static/live-camera/back.png"   @click="addImages" class="add screenshot"></image>
		        </view>
		      </movable-area>
		    </view>
		
		
		
		
		
		
		

		
			<u-action-sheet :actions="sheetList" title="请选择" :show="sheetShow" @select="sheetSelect"></u-action-sheet>
	</view>
</template>

<script>
	export default {
		props: {

			title: {
				type: String,
				default: ''
			},
			require: {
				type: Boolean,
				default: false,
			},
			tipTxt: {
				type: String,
				default: ''
			},
			limit: {
				type: Number,
				default: 0
			},


			isSell: {
				type: Boolean,
				default: true,
			},
			placeholder: {
				type: String,
				default: "",
			},
			// 选择图片数量限制
			number: {
				type: Number,
				default: 9,
			},
			// 图片父容器宽度（实际显示的图片宽度为 imageWidth / 1.1 ），单位 rpx
			imageWidth: {
				type: Number,
				default: 100,
			},
			// 图片列数（cols > 0 则 imageWidth 无效）
			cols: {
				type: Number,
				default: 3,
			},
			// 图片周围空白填充，单位 rpx
			padding: {
				type: Number,
				default: 8,
			},
			// 拖动图片时放大倍数 [0, ∞)
			scale: {
				type: Number,
				default: 1.1,
			},
			// 拖动图片时不透明度
			opacity: {
				type: Number,
				default: 0.7,
			},
			// 自定义添加（需配合 @aaddImage 事件使用）
			custom: {
				type: Boolean,
				default: false,
			},
			previewImageUrl: {
				type: String,
				default: "",
			},
			previewImageViewUrl: {
				type: String,
				default: "",
			},
			popupTitle: {
				type: String,
				default: "",
			},
		},


		computed: {
			areaHeight() {
				if (this.imageList.length < this.number) {
					return (
						Math.ceil((this.imageList.length + 1) / this.colsValue) *
						this.viewWidth +
						"px"
					);
				} else {
					return (
						Math.ceil(this.imageList.length / this.colsValue) * this.viewWidth +
						"px"
					);
				}
			},
			childWidth() {
				return this.viewWidth - this.rpx2px(this.padding) * 2 + "px";
			},
		},
		
		
		
		  created() {
		    this.width = uni.getSystemInfoSync().windowWidth;
		    this.viewWidth = this.rpx2px(this.imageWidth);
		
		  },
		  mounted() {
		    const query = uni.createSelectorQuery().in(this);
		    query.select(".area").boundingClientRect((data) => {
		      if (data?.width) {
		        this.colsValue = Math.floor(data.width / this.viewWidth);
				console.log('ssss',this.colsValue,data.width,this.viewWidth,this.cols)
		        if (this.cols > 0) {
		          this.colsValue = this.cols;
		          this.viewWidth = data.width / this.cols;
		        }
		      }
		    });
		    query.exec();
		  },


		data() {
			return {
				sheetShow:false,
				sheetList:[
				{name:'拍照'},	
				{name:'相册'},
				{name:'取消'},
				
				],
				imageSrc: "",
				canvasposterStyle: {
					width: "",
					height: "",
				},
				imageList: [],
				width: 0,
				add: {
					x: 0,
					y: 0,
				},
				colsValue: 0,
				viewWidth: 0,
				tempItem: null,
				timer: null,
				changeStatus: true,
				preStatus: true,
				previewList: [],
				ossAuthData: {},
				exampleShow: false,
			};
		},



		methods: {
			pickMedia(){
				this.addImages()
				// this.sheetShow=true
			},
			sheetSelect(val){
				console.log('sjsjsjs',val)
				if(val.name==='相册'){
					this.sheetShow=false
					this.addImages()
				}
			},
			init(imgs) {
				imgs.forEach((img) => {
					this.addProperties(img, 6);
				});
			},
			handleExample() {
				this.$emit("example");
			},
			onChange(e, item) {
				if (!item) return;
				item.oldX = e.detail.x;
				item.oldY = e.detail.y;
				if (e.detail.source === "touch") {
					if (item.moveEnd) {
						item.offset = Math.sqrt(
							Math.pow(item.oldX - item.absX * this.viewWidth, 2) +
							Math.pow(item.oldY - item.absY * this.viewWidth, 2)
						);
					}
					const x = Math.floor(
						(e.detail.x + this.viewWidth / 2) / this.viewWidth
					);
					if (x >= this.colsValue) return;
					const y = Math.floor(
						(e.detail.y + this.viewWidth / 2) / this.viewWidth
					);
					const index = this.colsValue * y + x;
					if (item.index != index && index < this.imageList.length) {
						this.changeStatus = false;
						for (const obj of this.imageList) {
							if (
								item.index > index &&
								obj.index >= index &&
								obj.index < item.index
							) {
								this.change(obj, 1);
							} else if (
								item.index < index &&
								obj.index <= index &&
								obj.index > item.index
							) {
								this.change(obj, -1);
							} else if (obj.id != item.id) {
								obj.offset = 0;
								obj.x = obj.oldX;
								obj.y = obj.oldY;
								setTimeout(() => {
									this.$nextTick(() => {
										obj.x = obj.absX * this.viewWidth;
										obj.y = obj.absY * this.viewWidth;
									});
								}, 0);
							}
						}
						item.index = index;
						item.absX = x;
						item.absY = y;
						this.sortList();
					}
				}
			},
			change(obj, i) {
				obj.index += i;
				obj.offset = 0;
				obj.x = obj.oldX;
				obj.y = obj.oldY;
				obj.absX = obj.index % this.colsValue;
				obj.absY = Math.floor(obj.index / this.colsValue);
				setTimeout(() => {
					this.$nextTick(() => {
						obj.x = obj.absX * this.viewWidth;
						obj.y = obj.absY * this.viewWidth;
					});
				}, 0);
			},
			touchstart(item) {
				this.imageList.forEach((v) => {
					v.zIndex = "auto";
				});
				item.zIndex = 99;
				item.moveEnd = true;
				this.tempItem = item;
				this.timer = setTimeout(() => {
					item.scale = this.scale;
					item.opacity = this.opacity;
					clearTimeout(this.timer);
					this.timer = null;
				}, 200);
			},
			touchend(item) {
				
				console.log('preview',item)
				
				this.previewImage(item);
				item.scale = 1;
				item.opacity = 1;
				item.x = item.oldX;
				item.y = item.oldY;
				item.offset = 0;
				item.moveEnd = false;
				setTimeout(() => {
					this.$nextTick(() => {
						item.x = item.absX * this.viewWidth;
						item.y = item.absY * this.viewWidth;
						this.tempItem = null;
						this.changeStatus = true;
					});
				}, 0);
			},
			previewImage(item) {
				if (
					this.timer &&
					this.preStatus &&
					this.changeStatus &&
					item.offset < 28.28
				) {
					clearTimeout(this.timer);
					this.timer = null;
					const src = this.previewList.findIndex((v) => v === item.src);
					uni.previewImage({
						// urls: this.previewList,
						urls:[item.src],
						current: item.src,
						success: () => {
							this.preStatus = false;
							setTimeout(() => {
								this.preStatus = true;
							}, 600);
						},
					});
				} else if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
			},
			mouseenter() {
				//#ifdef H5
				this.imageList.forEach((v) => {
					v.disable = false;
				});
				//#endif
			},
			mouseleave() {
				//#ifdef H5
				if (this.tempItem) {
					this.imageList.forEach((v) => {
						v.disable = true;
						v.zIndex = v.index + 9;
						v.offset = 0;
						v.moveEnd = false;
						if (v.id == this.tempItem.id) {
							if (this.timer) {
								clearTimeout(this.timer);
								this.timer = null;
							}
							v.scale = 1;
							v.opacity = 1;
							v.x = v.oldX;
							v.y = v.oldY;
							this.$nextTick(() => {
								v.x = v.absX * this.viewWidth;
								v.y = v.absY * this.viewWidth;
								this.tempItem = null;
							});
						}
					});
					this.changeStatus = true;
				}
				//#endif
			},

			async file2Img(src) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src,
						success: (image) => {
							resolve(image);
						},
					});
				});
			},

			// //绘制到canvas
			viewDrawToCanvas: function(src, src2) {
				console.log(src, src2);
				// 创建两个Image对象来加载两张图片
				var image1 = new Image();
				var image2 = new Image();
				const that = this;
				return new Promise((resolve, reject) => {
					uni.$main.toast("上传中...");
					image1.onload = function() {
						// 当第一张图片加载完毕后执行
						image2.onload = function() {
							// 当第二张图片加载完毕后执行
							var canvas = document.createElement("canvas");
							canvas.width = image1.width; // 设置画布宽度为两张图片相加的宽度
							canvas.height = image1.height; // 设置画布高度为两张图片中最大的高度

							let width2 = image2.width;
							let height2 = image2.height;
							if (image1.width / width2 < 1) {
								width2 = image1.width / width2;
								height2 = image1.height / height2;
							}

							var ctx = canvas.getContext("2d");
							ctx.drawImage(image1, 0, 0, image1.width, image1.height); // 绘制第一张图片到画布的左上角
							ctx.drawImage(
								image2,
								image1.width - width2,
								image1.height - height2,
								width2,
								height2
							); // 绘制第二张图片到画布的第一张图片宽度的位置
							// 把合成后的图片转换为Base64格式
							var mergedImage = canvas.toDataURL();
							console.log(canvas.toDataURL, "---");
							that.imageSrc = mergedImage;
							that.addProperties(mergedImage);
							uni.$main.clearToast();
							resolve();
							// 在此处使用合成后的图片
						};

						image2.src = src2; // 加载第二张图片
						image2.setAttribute("crossOrigin", "anonymous");
					};
					image1.setAttribute("crossOrigin", "anonymous");

					image1.src = src; // 加载第一张图片
				});
			},

			//获取临时路径
			getTempFilePath: function() {
				// 当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
				uni.canvasToTempFilePath({
					canvasId: "canvasposter",
					success: (res) => {
						console.log(res);
					},
				});
			},
			
			addImages() {
				
				
			
				
				
				
				
				
				
				if (this.custom) {
					this.$emit("addImage");
				} else {
					const checkNumber = this.number - this.imageList.length;
					uni.chooseImage({
						count: checkNumber,
						sizeType: "original",
						sourceType: ["album", "camera"],
						success: async (res) => {
							const count =
								checkNumber <= res.tempFilePaths.length ?
								checkNumber :
								res.tempFilePaths.length;
								
								console.log('sssss',count,checkNumber,this.number)

							console.log('ddddd',res,count)

							for (let i = 0; i < count; i++) {
							
								
								
								console.log('222222')
								let mergedImage= await this.addWatermarkToImage(res.tempFiles[i],'dhfdhfjdhf','dhfjdhfjdhjd')
								console.log('11111')
								this.imageSrc = mergedImage;
								
								// await this.getPhtotSize(mergedImage)
								let final= await this.compressImage(mergedImage,2)
								// await this.getPhtotSize(final)
								console.log('cccc',final)
								
								this.addProperties(mergedImage);
								// this.addProperties(res.tempFilePaths[i]);
								
								// if (this.isSell) {
								// 	await this.viewDrawToCanvas(
								// 		res.tempFilePaths[i],
								// 		`${import.meta.env.VITE_APP_CDN_HOST}/taogehao/resource/images/icon-watermark.png`
								// 	);
								// } else {
								// 	this.addProperties(res.tempFilePaths[i]);
								// }
							}
							this.upload();
							
							
							setTimeout(()=>{
								console.log('延迟打印：',this.imageList)
							},5000)
						},
						fail: ({
							code
						}) => {
							chooseImagePermission(code);
						},
					});
				}
			},
			
			getPhtotSize(path){
				return new Promise((resolve)=>{
					uni.getSavedFileInfo({
						filePath:path,
						success:(res)=>{
							console.log('dddd',res)
							if(res.errMsg==='getSavedFileInfo:ok'){
								console.log('fize:',res.size)
							}
							resolve('')
						},
						fail:(err)=>{
							console.log('err',err)
							resolve('')
						}
					})
				})

			},
			addImage(image) {
				this.addProperties(image);
				this.upload();
			},
			delImage(item, index) {
				this.imageList.splice(index, 1);
				for (const obj of this.imageList) {
					if (obj.index > item.index) {
						obj.index -= 1;
						obj.x = obj.oldX;
						obj.y = obj.oldY;
						obj.absX = obj.index % this.colsValue;
						obj.absY = Math.floor(obj.index / this.colsValue);
						this.$nextTick(() => {
							obj.x = obj.absX * this.viewWidth;
							obj.y = obj.absY * this.viewWidth;
						});
					}
				}
				this.add.x =
					(this.imageList.length % this.colsValue) * this.viewWidth + "px";
				this.add.y =
					Math.floor(this.imageList.length / this.colsValue) * this.viewWidth +
					"px";
				this.sortList();
			},
			delImageMp(item, index) {
				//#ifdef MP
				this.delImage(item, index);
				//#endif
			},
			sortList() {
				const list = this.imageList.slice();
				list.sort((a, b) => {
					return a.index - b.index;
				});
				// const urlList = [];
				// const previewList = [];
				// let upSuccessCount = 0;
				// let upLoadingCount = 0;
				// list.forEach((img) => {
				// 	if (img.status == 2 || img.status == 6) {
				// 		upSuccessCount++;
				// 		const path = img.path ? img.path : import.meta.env.VITE_APP_CDN_HOST;
				// 		urlList.push(path + img.url);
				// 	}
				// 	previewList.push(img.src);
				// 	if (img.status == 1) {
				// 		upLoadingCount++;
				// 	}
				// });
				// const data = {
				// 	details: list,
				// 	urls: urlList,
				// 	upLoadingCount: upLoadingCount,
				// 	upSuccessCount: upSuccessCount,
				// 	imgCount: this.imageList.length,
				// };
				// this.previewList = previewList;
				// this.$emit("change", data);
			},
			upload(ossAuth) {
				// const that = this;
				// const promises = [];
				// console.log(isArray(ossAuth));
				// this.imageList.forEach((img, index) => {
				// 	if (img.status == 0) {
				// 		img.status = 1;
				// 		const promise = new Promise(function(resolve, reject) {
				// 				const uploadTask = uploadFile(
				// 					isArray(ossAuth) ? ossAuth[index] : ossAuth,
				// 					img.src,
				// 					"png",
				// 					(data) => {
				// 						resolve(data);
				// 					},
				// 					reject
				// 				);
				// 				img.uploadTask = uploadTask;
				// 				uploadTask.onProgressUpdate(async function(res) {
				// 					that.$set(img, "progress", res.progress);
				// 					img.uploadInfo = res;
				// 				});
				// 			})
				// 			.then((res) => {
				// 				console.log("1");
				// 				img.progress = 100;
				// 				img.status = 2;
				// 				img.url = res;
				// 			})
				// 			.catch((e) => {
				// 				console.log("2");
				// 				img.status = 99;
				// 				console.log(e);
				// 			});
				// 		promises.push(promise);
				// 	}
				// });

				// uni.$main.showLoading({
				// 	title: `正在上传...`,
				// });
				// // console.log("promises===>",promises)
				// Promise.all(promises)
				// 	.then((res) => {
				// 		console.log("3");
				// 		uni.$main.hideLoading();
				// 		this.sortList();
				// 	})
				// 	.catch(function(e) {
				// 		uni.$main.hideLoading();
				// 	});
			},
			addProperties(item, status) {
				if (status === undefined) {
					status = 0;
				}
				const absX = this.imageList.length % this.colsValue;
				const absY = Math.floor(this.imageList.length / this.colsValue);
				const x = absX * this.viewWidth;
				const y = absY * this.viewWidth;
				this.imageList.push({
					src: status == 6 ? item.url : item,
					url: status == 6 ? item.url : "",
					path: item.path,
					progress: 0,
					status: status,
					x,
					y,
					oldX: x,
					oldY: y,
					absX,
					absY,
					scale: 1,
					zIndex: 9,
					opacity: 1,
					index: this.imageList.length,
					id: this.guid(),
					disable: false,
					offset: 0,
					moveEnd: false,
				});
				this.add.x =
					(this.imageList.length % this.colsValue) * this.viewWidth + "px";
				this.add.y =
					Math.floor(this.imageList.length / this.colsValue) * this.viewWidth +
					"px";
				this.sortList();
			},
			nothing() {},
			rpx2px(v) {
				return (this.width * v) / 750;
			},
			guid() {
				function S4() {
					return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				}
				return (
					S4() +
					S4() +
					"-" +
					S4() +
					"-" +
					S4() +
					"-" +
					S4() +
					"-" +
					S4() +
					S4() +
					S4()
				);
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
				  console.log('aaaaaaaaaaaaaaad')
				const CanvasUtils = {
				  /**
				   * 在画布上绘制文本
				   * @param {CanvasRenderingContext2D} ctx 画布上下文
				   * @param {string} text 要绘制的文本
				   * @param {number} fontSize 字体大小
				   * @param {number} textY Y轴位置
				   * @param {number} textX X轴位置
				   */
				  drawText: (ctx, text, fontSize, textY, textX) => {
					ctx.font = `${fontSize}px Arial`;
					ctx.fillStyle = "rgba(255, 255, 255, 1)";
					ctx.fillText(text, textX, textY);
				  },
		  
				  /**
				   * 根据画布宽度计算字体大小
				   * @param {number} watermarkWidth 水印宽度
				   * @returns {number} 字体大小
				   */
				  calculateFontSize: (watermarkWidth) => {
					const fontSizeMultiplier = 0.1;
					return watermarkWidth * fontSizeMultiplier;
				  },
				}
				  
				  console.log('aaaaaaaaaaaaaaac002355111',file)
			    const img = new Image()
				console.log('aaaaaaaaaaaaaaac002355',file)
			    img.src = URL.createObjectURL(file);
			console.log('aaaaaaaaaaaaaaac00',file)
			    img.onload = () => {
					console.log('aaaaaaaaaaaaaaac01110')
					
			      const canvas = document.createElement("canvas");
			      const ctx = canvas.getContext("2d");
			console.log('aaaaaaaaaaaaaaac')
			   
			      const watermarkWidthPercentage = 0.5;
			
			      canvas.width = img.width;
			      canvas.height = img.height;
			
			      ctx.drawImage(img, 0, 0);
			
			     
			      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
			      ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			     
			      const watermarkWidth = canvas.width * watermarkWidthPercentage;
			      const watermarkX = (canvas.width - watermarkWidth) / 2; 
				  
				  const watermarkPositionX=60
				  const watermarkPositionY=60
					console.log('aaaaaaaaaaaaaaab')
			
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
					80,
					canvas.height-60*1,
					watermarkPositionX
			      );
				  
				  
				  // CanvasUtils.drawText(
				  //   ctx,
				  //   gasName,
				  //   CanvasUtils.calculateFontSize(watermarkWidth),
				  //   CanvasUtils.calculateFontSize(watermarkWidth) * 3.5,
				  //   watermarkX + watermarkWidth / 2
				  // );
			
			     
			      CanvasUtils.drawText(
			        ctx,
			        gasName,
			        48,
					canvas.height-60*2,
			        // CanvasUtils.calculateFontSize(watermarkWidth) * 3.5,
					watermarkPositionX
			        // watermarkX + watermarkWidth / 2
			      );
			
			   
			      CanvasUtils.drawText(
			        ctx,
			        location,
			        48,
					canvas.height-60*3,
			        // CanvasUtils.calculateFontSize(watermarkWidth) * 5,
					watermarkPositionX
			        // watermarkX + watermarkWidth / 2
			      );
			
			      // canvas.toBlob((blob) => {
			      //   resolve(blob);
			      // }, file.type);
				  
				  console.log('aaaaaaaaaaaaaaa')
				  	let mergedImage = canvas.toDataURL();
					resolve(mergedImage);
				  
				  
				  
			    };
			
			    img.onerror = (error) => {
					console.log('aaaaaaaaaaaaaaac0123450')
					
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
				    // let reader = new FileReader();
					let img = new Image();
					
				    // reader.onload = function () {
				      
				
				      img.onload = function () {
				        let canvas = document.createElement("canvas");
				        let ctx = canvas.getContext("2d");
				        let maxSizeBytes = maxSizeMB * 1024 * 1024;
				        let scaleFactor = 0.5;
				
				        // if (file.size > maxSizeBytes) {
				        //   scaleFactor = Math.min(
				        //     scaleFactor,
				        //     Math.sqrt(maxSizeBytes / file.size)
				        //   ); // 计算缩放比例，保持宽高比
				        // }
				
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
							console.log('777777',compressedFile)
				          },
				          file.type,
				          0.2 // 设置压缩质量参数为 0.8
				        );
				      };
				
				      img.onerror = reject;
				
				      img.src = file;
				    // };
				
				    // reader.onerror = reject;
				
				    // reader.readAsDataURL(file);
				  });
				},
		},

	}
</script>

<style lang="scss" scoped>
	.section {
		.top {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;

			.title {}

			.status {}

			.icon {
				width: 30rpx;
				height: 30rpx;
				background: yellow;
			}
		}

		.add {
			width: 100rpx;
			height: 100rpx;
			background: red;
		}

	}
	
	
	
	
	
	
	
	
	.con {
	  width: 100%;
	  flex: 1;
	  padding: 8rpx 12rpx;
	  background: #f4f5f6;
	  box-sizing: border-box;
	  border-radius: 4rpx;
	  visibility: hidden;
	  height: 0;
	
	  &.active {
	    visibility: visible;
	    height: auto;
	  }
	
	  .area {
	    width: 100%;
	
	
	    .view {
	      display: flex;
	      justify-content: center;
	      align-items: center;
	
	      .area-con {
	        position: relative;
	        width: 158rpx;
	        height: 84rpx;
	
	        .pre-image {
	          border-radius: 10rpx;
	          width: 100%;
	          height: 100%;
	        }
	
	        .del-con {
	          position: absolute;
	          top: -14rpx;
	          right: -14rpx;
	
	          .del-wrap {
	            width: 28rpx;
	            height: 28rpx;
	            border-radius: 0 10rpx 0 5rpx;
	            display: flex;
	            justify-content: center;
	            align-items: center;
	
	            .del-image {
	              width: 100%;
	              height: 100%;
				  background: yellow;
	            }
	          }
	        }
	      }
	    }
	
	    .add {
	      position: absolute;
	      display: flex;
	      justify-content: center;
	      align-items: center;
	
	      .add-wrap {
	        width: 108rpx;
	        height: 84rpx;
	        display: flex;
	        border-radius: 10rpx;
	        justify-content: center;
	        align-items: center;
	        background-color: #e9e9e9;
	      }
	    }
	  }
	}
	.canvas-poster {
	  position: fixed;
	  top: 100%;
	  left: 100%;
	  z-index: -1;
	}
</style>
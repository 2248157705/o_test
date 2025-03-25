<template>
	<view class="page">
		<view style="height: 80rpx;"></view>
		<navigator class="buttons" url="../camera/camera"><button type="primary">打开自定义相机</button></navigator>
		 <view style="height: 20rpx;"></view>
		<navigator class="buttons" url="../camera/portrait/portrait"><button type="primary">打开人像采集相机</button></navigator>
		<view style="height: 60rpx;"></view>
		<navigator class="buttons" url="../camera/idcard/idcard?dotype=face"><button type="primary">打开身份证人像面采集相机</button></navigator>
		<view style="height: 20rpx;"></view>
		<navigator class="buttons" url="../camera/idcard/idcard?dotype=badge"><button type="primary">打开身份证国徽面采集相机</button></navigator>
		<view style="height: 60rpx;"></view>
	
		<view style="height: 60rpx;"></view>
		<navigator class="buttons" url="../camera/watermark/watermark"><button type="primary">打开定制水印相机</button></navigator>
		<view style="height: 80rpx;"></view> 
		
		
		<img-upload  :cols="3" ref="uploadRef"  title='000000' style="background: red;"></img-upload>
		
		
		
		
		<div class="" @click="addImage">add image</div>
		
		
		
		
		
		
		
	
		
		
		<view>拍摄结果预览图，见下方</view>
		<image @click="handlePreview(imagesrc)"  class="preview" :src="imagesrc" mode="aspectFit" style="width:710rpx:height:710rpx;margin: 20rpx;"></image>
		
		<canvas id="canvas-clipper" canvas-id="canvas-clipper" type="2d" :style="{width: canvasSiz.width+'px',height: canvasSiz.height+'px',position: 'absolute',left:'-500000px',top: '-500000px'}" />
		
		
		
		<view v-for="(item) in result.list" :key="item" style="border-bottom: 2rpx solid red;width: 100%;height: 100rpx;text-align: center;line-height: 100rpx;">
			{{item}}
		</view>
		
		
		
	</view>
</template>

<script>
	
	var _this;
	import ImgUpload from './imageUpload.vue';
	
export default {

	data() {
		return {
		
			
			result:{
				isloading:false,
				page:1,
				list:50,
				total:null
			},
			
			
	
				
			
			
			
			windowWidth:'',
			windowHeight:'',
			imagesrc: null,
			canvasSiz:{
				width:188,
				height:273
			}
		};
	},
	mounted() {
		console.log('mounted',)
	},
	onReachBottom(){
		console.log('滚动到底部')
		
		if(this.result.isloading) {
			console.log('加载中')
			return
		}
		this.result.isloading=true
		
		new Promise((resolve,reject)=>{
			setTimeout(()=>{
				
				let response={
					total:100,
					
				}
				
				resolve()
			},3000)
		})
	
	},
	onLoad() {
		_this= this;
		this.init();
		

	},
	components:{
		ImgUpload,
	},
	methods: {
		
		
		addImage(){
			this.$refs.uploadRef.init([
				{url:'http://lz.sinaimg.cn/large/8a65eec0gy1hqv2c366jej207i0b5jvo.jpg'},
				// {url:'http://lz.sinaimg.cn/large/8a65eec0gy1hqqzcfo43lj207i0akn12.jpg'},
				// {url:'http://lz.sinaimg.cn/large/8a65eec0gy1hqqzhurmahj207i0al3zr.jpg'},
				// {url:'http://lz.sinaimg.cn/large/8a65eec0gy1hwmmnf9nw0j207i0aojsp.jpg'},
				// {url:'http://lz.sinaimg.cn/large/8a65eec0gy1htqyitrl8yj207i0al75v.jpg'},
				// {url:'http://lz.sinaimg.cn/large/8a65eec0gy1hqqzhurmahj207i0al3zr.jpg'},

				])
		},
		
	 wrapText(context, text, x, y, maxWidth, lineHeight) {
		    // const words = text.split(' '); // 将文本按空格分割成单词
			const words = Array.from(text) // 将文本按空格分割成单词
		    let line = ''; // 当前行的文本
		
		    for (let i = 0; i < words.length; i++) {
		        const testLine = line + words[i] + ' '; // 测试当前行加上新单词后的宽度
		        const metrics = context.measureText(testLine); // 测量文本宽度
		        const testWidth = metrics.width;
		
				console.log(`testWidth:${testWidth} maxWidth:${maxWidth} i:${i}`)
		        if (testWidth > maxWidth && i > 0) {
		            // 如果当前行宽度超过最大宽度，则绘制当前行
		            context.fillText(line, x, y);
		            line = words[i] + ' '; // 开始新的一行
		            y += lineHeight; // 增加 y 坐标以换行
					console.log('换行')
		        } else {
		            line = testLine; // 继续添加单词到当前行
		        }
		    }
		
		    // 绘制最后一行
		    context.fillText(line, x, y);
		}
		,

		getFileNameWithoutExtension(path) {
		    const fileName = getFileName(path);
		    return fileName.split('.').slice(0, -1).join('.');
		},

		handlePreview(path){
				uni.previewImage({
						urls: [path],
						longPressActions: {
							itemList: ['发送给朋友', '保存图片', '收藏'],
							success: function(data) {
								console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
							},
							fail: function(err) {
								console.log(err.errMsg);
							}
						}
					});
		},
		getFileName(path){
			 const regex = /[^\\/]*$/;
			const match = path.match(regex);
			return match ? match[0] : '';
		},
		getFileExtension(filename) {
		    // 正则表达式匹配文件扩展名
		    const regex = /\.([0-9a-z]+)$/i;
		    const match = filename.match(regex);
		    return match ? match[1] : null;
		},

		
		 
		
		//设置图片
		setImage(e) {
			console.log(e);
			let fileName=this.getFileName(e.path)
			let fileExtension=this.getFileExtension(fileName)
			console.log('09977',fileName,fileExtension)
			
			//显示在页面
			//this.imagesrc = e.path;
			if(e.dotype =='idphoto'){
				_this.zjzClipper(e.path);
			}else if(e.dotype =='watermark'){
				_this.watermark(e.path);
			}else{
				_this.savePhoto(e.path);
			}
		},
		
		//证件照裁切
		zjzClipper(path) {
			uni.getImageInfo({
				src: path,
				success: function(image) {
					console.log(image);
					_this.canvasSiz.width =188;
					_this.canvasSiz.height =273;
					
					
					//因为nvue页面使用canvas比较麻烦，所以在此页面上处理图片
					let ctx = uni.createCanvasContext('canvas-clipper', _this);
					
					ctx.drawImage(
						path,
						parseInt(0.15 * image.width),
						parseInt(0.17 * image.height),
						parseInt(0.69 * image.width),
						parseInt(0.65 * image.height),
						0,
						0,
						188,
						273
					);
					
					ctx.draw(false, () => {
						uni.canvasToTempFilePath(
							{
								destWidth: 188,
								destHeight: 273,
								canvasId: 'canvas-clipper',
								fileType: 'jpg',
								success: function(res) {
									_this.savePhoto(res.tempFilePath);
								}
							},
							_this
						);
					});
				}
			});
		},
		
		//添加照片水印
		watermark(path){
			console.log('09788')
			uni.getImageInfo({
				src: path,
				success: function(image) {
					console.log(image);
					
					_this.canvasSiz.width =image.width;
					_this.canvasSiz.height =image.height;
					
					//担心尺寸重置后还没生效，故做延迟
					setTimeout(()=>{
						let ctx = uni.createCanvasContext('canvas-clipper', _this);
						
						ctx.drawImage(
							path,
							0,
							0,
							image.width,
							image.height
						);
						
						//具体位置如需和相机页面上一致还需另外做计算，此处仅做大致演示
						ctx.setFillStyle('red');
						ctx.setFontSize(40);
						ctx.fillText('live-camera', 20, 100);
						
						
						
						//再来加个时间水印
						var now = new Date();
						var time= now.getFullYear()+'-'+now.getMonth()+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getMinutes();
						ctx.setFontSize(30);
						ctx.fillText(time, 20, 140);
						
						console.log('000000999',time)
						
						_this.wrapText(ctx,'gjghfgfghfjghf jghfjghfdjghfgfdgjfhdjgh fkhgfjkhgfjkgfghfkghfjkghfjkgfghf jkghkfgfgfkgfjkkfgktytu rifdhgf1111111hk3456554433',20,400,200,80)

						ctx.draw(false, () => {
							uni.canvasToTempFilePath(
								{
									destWidth: image.width,
									destHeight: image.height,
									canvasId: 'canvas-clipper',
									fileType: 'jpg',
									success: function(res) {
										_this.savePhoto(res.tempFilePath);
									}
								},
								_this
							);
						});
					},500)
					
					
				}
			});
		},
		
		//保存图片到相册，方便核查
		savePhoto(path){
			this.imagesrc = path;
			
			uni.getSavedFileInfo({
				filePath:path,
				success:(res)=>{
					console.log('dddd',res)
					if(res.errMsg==='getSavedFileInfo:ok'){
						console.log('fize:',res.size)
					}
				},
				fail:(err)=>{
					console.log('err',err)
				}
			})
			
			return
			//保存到相册
			uni.saveImageToPhotosAlbum({
				filePath: path,
				success: () => {
					uni.showToast({
						title: '已保存至相册',
						duration: 2000
					});
				}
			});
		},
		
		//初始化
		init(){
			let _this = this;
			uni.getSystemInfo({
				success: function(res) {
					_this.windowWidth = res.windowWidth;
					_this.windowHeight = res.windowHeight;
				}
			});
		}
		
	}
};
</script>

<style lang="scss">
.page {
	width: 750rpx; 
	justify-content: center;
	align-items: center;
	flex-direction:column;
	display: flex;
	.buttons {
		width: 600rpx;
	}
}


</style>

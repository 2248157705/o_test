<template>
	<view>
		<view class="choose" @click="open">
			<text>选择位置</text>
		</view>
		<view class="box">
			<view class="label">
				<text>名称：</text>
				<text v-text="name"></text>
			</view>
			<view class="label">
				<text>经纬度：</text>
				<text v-text="latlon"></text>
			</view>
			<view class="label">
				<text>行政区：</text>
				<text v-text="compound_code"></text>
			</view>
		</view>
		<genos-googlemap ref="googlemap" googleKey="AIzaSyChbJQQ5ieFkKn2T5aDurZSyIxYywsMCmw" lang="cn" @confirmAddress="confirmAddress"></genos-googlemap>
	</view>
</template>

<script>
	import GenosGooglemap from './genos-googlemap.vue'
	export default {
		components:{
			GenosGooglemap,
		},
		data(){
			return {
				name:'',
				latlon:'',
				compound_code:'',
			}
		},
		methods: {
			open(){
				this.$refs.googlemap.open();
			},
			confirmAddress(e){
				this.name = e.name;
				this.compound_code = e.compound_code;
				this.latlon = e.latlng.lat+','+e.latlng.lng;
				console.log(e);
			},
		}
	}
</script>

<style lang="less">
	.choose{
		margin: 20rpx auto;
		text-align: center;
	}
	.box{
		margin: 20rpx;
		padding: 20rpx;
		border: 1px solid #f8f8f8;
		.label{
			margin: 20rpx auto;
		}
	}
</style>

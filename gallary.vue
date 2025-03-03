<template>
	<view>
		<image v-for="(item,index) in imgs" :key="index"></image>
		<img-upload /></img-upload>
	</view>
</template>

<script>
	import ImgUpload from './imgUpload.vue'
	export default{
		props:{
			imgs:{
				type:Array,
				default:()=>[]
			}
		},
		components:{
			ImgUpload,
		},
		data(){
			return {}
		}
	}
</script>

<style>
</style>
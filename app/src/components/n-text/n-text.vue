<template>
	<view class="ntext">
		<template v-for="(item,index) in text">
			<text @click="$emit('clicktext',{item,index})" v-for="(itemtext,indextext) in item.text" :key='indextext' :style="item.style" :class="item.class">{{itemtext}}</text>
		</template>
	</view>
</template>

<script>
	/**
	 * n-text 文本组件
	 * @description 解决nvue文字无法衔接换行的问题。
	 * @property {Array} text [{text:'',style:''}]文本
	 * @event {Function} clicktext 文字被点击
	 * */
	export default {
		name: "n-text",
		props:{
			text:{
				type:Array,
				default:()=>[]
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style>
.ntext{
	flex-flow: row wrap; 
}
</style>

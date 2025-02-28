<template>
	<view>
		<shop-step-item title="到店打卡1" :status="1" :current="current">
			<view class="distance">距离500m</view>
			<view class="time">19:00</view>
			<view class="note">dhfdhfjdhfjdfhjdh</view>
		</shop-step-item>
		<shop-step-item title="现场拍摄" :status="2" :current="current">
			<view class="distance">距离500m</view>
			<view class="time">19:00</view>
			<view class="note">dhfdhfjdhfjdfhjdh</view>
		</shop-step-item>
		<shop-step-item title="现场拍摄" :status="2" :current="current">
			<view class="distance">距离500m</view>
			<view class="time">19:00</view>
			<view class="note">dhfdhfjdhfjdfhjdh</view>
		</shop-step-item>
		<shop-step-item title="现场拍摄" :status="2" :isLast="true" >
			<view class="distance">距离500m</view>
			<view class="time">19:00</view>
			<view class="note">dhfdhfjdhfjdfhjdh</view>
		</shop-step-item>
	</view>

</template>

<script>
	import ShopStepItem from "./shop-step-item.vue"
	export default {
		components: {
			ShopStepItem
		},
		props:{
			current:{
				type:Number,
				default:1,
			}
		}
	}
</script>

<style>
</style>
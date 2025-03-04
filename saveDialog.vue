<template>
	<u-modal :show="show" :showConfirmButton="false">
	  <view class="dialog">
	    <view class="title">确认清除所有未读消息提示</view>
	    <view class="actions">
	      <view class="cancel" @click="close">再想想</view>
	      <view class="confirm" @click="confirm">确定</view>
	    </view>
	  </view>
	</u-modal>
</template>

<script>
	export default{
		data(){
			return{
				show:false,
			}
		},
		methods:{
			open(){
				this.show=true
			},
			close(){
				this.show=false
			},
			confirm(){
				this.$emit('confirm')
				this.close()
			}
		}
	}
</script>

<style>
	.dialog{
		.title{
			
		}
		.action{
			.cancel{
				
			}
			.confirm{
				
			}
		}
	}
</style>
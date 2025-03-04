<template>
	<view class="job">
		<view class="title"></view>
		<view class="section">
			<view class="head">
				<view class="name"></view>
				<image class="del"></image>
			</view>
			
			<view class="list">
				<view v-for="(item,index) in 9" :key="index" class="item">
					{{index}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style>
	.job{
		.title{
			
		}
		.section{
			.head{
				.name{
					
				}
				.del{
					
				}
			}
			.list{
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				flex-wrap: wrap;
				.item{
					width: 28%;
					margin: 2%;
					background: red;
				}
			}
		}
	}
</style>
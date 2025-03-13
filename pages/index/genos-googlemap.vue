<template>
	<view class="popup" v-show="show">
		<view class="map">
			<view id="map"></view>
			<view class="tools">
				<icon type="cancel" size="35" color="#3478f3" @click="close" />
				<button type="primary" @click="confirm" v-text="lang=='cn'?'完成':'Confirm'"></button>
			</view>
		</view>
		<view class="box">
			<view class="label">
				<icon type="search" size="16" color="#b8b8b8" />
				<input type="text" :placeholder="lang=='cn'?'搜索地点':'search place'" placeholder-style="color:#b8b8b8;" v-model="searchAddress">
			</view>
			<view v-show="false" :curPlace="curPlace" :change:curPlace="renderScript.moveMap"></view>
			<view v-show="false" :googleKey="googleKey" :change:googleKey="renderScript.init"></view>
			<view class="lists">
				<radio-group @change="radioChange">
					<label class="list" v-for="(item,index) in list">
						<view class="flex-1">
							<view class="">
								<text v-text="item.name"></text>
							</view>
							<view class="info">
								<text v-text="item.formatted_address"></text>
							</view>
						</view>
						<view class="radio">
							<radio :value="index.toString()" :checked="index === current" style="transform:scale(0.7)" />
						</view>
					</label>
				</radio-group>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			googleKey:{
				type:String,
				default:''
			},
			lang:{
				type:String,
				default:'cn'
			}
		},
		data() {
			return {
				show:false,
				searchAddress:'',
				current:-1,
				list:[],
				curPlace:false
			}
		},
		watch:{
			searchAddress:{
				handler(newV){
					if(newV){
						this.searchFindAddress();
					}
				},
				deep:true
			}
		},
		methods: {
			radioChange(e){
				this.current = e.detail.value;
				this.curPlace = JSON.stringify(this.list[this.current])
			},
			searchFindAddress(){
				let thar = this;
				this.current = -1;
				this.list = [];
				let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${this.googleKey}&query=${this.searchAddress}&language=${this.lang}`;
				uni.request({
				    url: url,
				    success: (res) => {
						if(res.statusCode == 200){
							let resData = res.data;
							let results = resData.results;
							thar.list = results;
						}
				    }
				});
			},
			confirm(){
				let thar = this;
				let curPlace = JSON.parse(this.curPlace)
				let latlng = {
					lat: curPlace.geometry.location.lat,
					lng: curPlace.geometry.location.lng
				};
				let url = `https://maps.googleapis.com/maps/api/geocode/json?key=${this.googleKey}&latlng=${latlng.lat},${latlng.lng}&language=${this.lang}`;
				uni.request({
				    url: url,
				    success: (res) => {
						if(res.statusCode == 200){
							let resData = res.data;
							let compound_code = resData.plus_code.compound_code;
							compound_code = compound_code.split(' ')
							let obj = {
								compound_code:compound_code[1],
								latlng:latlng,
								name:curPlace.name
							};
							thar.$emit('confirmAddress',obj)
							thar.close();
						}
				    }
				});
			},
			close(){
				this.show = false;
			},
			open(){
				this.searchAddress = '';
				this.show = true;
			}
		}
	}
</script>
<script module="renderScript" lang="renderjs">
	export default {
		data() {
			return {
				map: {},
				haight: null,
				oceanBeach: null,
				directionsService: null,
				directionsRenderer: null,
				key:null,
				curPlace:false
			};
		},
		methods: {
			init(newValue, oldValue, ownerVm, vm) {
				this.key = newValue;
				if (typeof window.google == 'function') {
					this.handleMap();
				} else {
					var script = document.createElement("script");
					script.src =
						`https://maps.googleapis.com/maps/api/js?key=${this.key}&callback=initMap`;
					script.async = true;
					document.head.appendChild(script);
				}
				window.initMap = () => {
					this.handleMap();
				}
			},
			handleMap() {
				this.directionsService = new google.maps.DirectionsService();
				this.directionsRenderer = new google.maps.DirectionsRenderer();
				this.oceanBeach = new google.maps.LatLng(30.53772, 104.04538);
				navigator.geolocation.getCurrentPosition((position) => {
					var pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};
					this.haight = new google.maps.LatLng(+pos.lat, +pos.lng);
					var mapOptions = {
						zoom: 14,
						center: this.haight
					}
					this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
					this.directionsRenderer.setMap(this.map);
					new google.maps.Marker({
						position: this.haight,
						map: this.map,
						title: "",
					});
				});
			},
			moveMap(newValue, oldValue, ownerVm, vm){
				if(newValue){
					var curPlace = JSON.parse(newValue);
					this.haight = new google.maps.LatLng(+curPlace.geometry.location.lat, +curPlace.geometry.location.lng);
					var mapOptions = {
						zoom: 14,
						center: this.haight
					}
					this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
					this.directionsRenderer.setMap(this.map);
					new google.maps.Marker({
						position: this.haight,
						map: this.map,
						title: "",
					});
				}
			}
		},
	};
</script>

<style lang="less">
	uni-radio-group{
		width: 100%;
	}
	.popup{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
		background: #fff;
	}
	.map{
		position: relative;
		height: 50vh;
		#map {
			height: 100%;
		}
		.tools{
			position: absolute;
			padding: 0 20rpx;
			box-sizing: border-box;
			// top: calc(var(--status-bar-height) + 10rpx);
			top: 10rpx;
			left: 0;
			z-index: 99999999;
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			button{
				font-size: 28rpx;
				margin: 0;
			}
		}
	}
	.box{
		padding: 20rpx;
		box-sizing: border-box;
		height: 50vh;
		.label{
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #ebebeb;
			padding: 0 20rpx;
			input{
				padding-left: 10rpx;
				flex:1;
				height: 60rpx;
				line-height: 60rpx;
				box-sizing: border-box;
				border-radius: 10rpx;
				font-size: 28rpx;
			}
		}
		.lists{
			overflow: auto;
			height: calc(100% - 60rpx);
			.list{
				padding: 20rpx 0;
				box-sizing: border-box;
				border-bottom: 1px solid #d4d4d4;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.flex-1{
					flex:1;
				}
				.radio{
					
				}
				.info{
					margin-top: 10rpx;
					color: #a4a4a4;
					font-size: 24rpx;
				}
			}
		}
	}
	/deep/.gmnoprint{
		display: none;
	}
</style>

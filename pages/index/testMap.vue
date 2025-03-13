<template>
  <view class="">

    <lyf-googleMap style="width: width: 100%;height: 500rpx;" ref="googleMapInstace" :marketList="markers"
      :centerPoint="selfLocation" @markerClick="markerClick" @gMapRenderComplete="gMapRenderComplete" @showLocation="showLocation"
      :googleKey="googleKey"></lyf-googleMap>

    <button @click="autoLocation">定位当前位置</button>
    <button @click="setMapMarker">添加标记物</button>
    <button @click="clearMapMarker">清空标记物</button>
  </view>
</template>

<script>
	import LyfGoogleMap from './lyf-googleMap.vue'
  export default {
	  components:{
		  LyfGoogleMap,
	  },
    data() {
      return {
        googleKey: '', // 需要去申请谷歌key
        /*
          设置地图中心点
          格式: 
            {
              lat: 23.15063,
              lng: 113.38599
            }
        */
        selfLocation: {},
        /*
          设置标记物
          格式：
          {
            icon: 'https://tpsite.oss-cn-hangzhou.aliyuncs.com/1/material/5f899981-c836-47d8-b8ed-d6b83da59aa4.png',
            position: {
              lat: 23.222,
              lng: 121.122
            }
          }
        */
        markers: []
      }
    },
    onLoad() {
	
		uni.getLocation({
			type: 'wgs84',
			success:  (res)=> {
				console.log('当前位置的经度：' + res.longitude);
				console.log('当前位置的纬度：' + res.latitude);
			  					
			  					// that.centerPoints={lat:res.latitude,lng:res.longitude}
			  					console.log('开始定位')
								this.selfLocation = {
								  lat: res.latitude,
								  lng: res.longitude
								}
								// that.loadGoogleMap()
			  			
						
						// setTimeout(()=>{
						// 		this.reverseGeocode(this.selfLocation)
						// },10000)
			  				
			  					
			  					
			  					// this.centerPoints.lat, this.centerPoints.lng)
			}
		});
	},
    methods: {
		
		         reverseGeocode(latLng) {
				                const geocoder = new google.maps.Geocoder();
				                geocoder.geocode({ location: latLng }, (results, status) => {
				                    if (status === "OK") {
										console.log('000000',results)
				                        if (results[0]) {
				                            // 显示地址
				                            // document.getElementById("address").innerText = "地址: " + results[0].formatted_address;
				                        } else {
											console.log('ssddd 未找到地址')
				                            // document.getElementById("address").innerText = "未找到地址";
				                        }
				                    } else {
										console.log('9999999反向地理编码失败')
				                        // document.getElementById("address").innerText = "反向地理编码失败: " + status;
				                    }
				                });
				            },
      // google地图渲染完成
      gMapRenderComplete() {
        console.log('google地图渲染完成');
      },
	  
	  showLocation(val){
		  console.log('showLocation',val)
	  },
      // 自动定位
      autoLocation() {
        this.$refs.googleMapInstace.autoLocation();
      },
      // 标记物被点击
      markerClick(e) {
        console.log('markder点击啦', e);
      },
      // 清除标记物
      clearMapMarker() {
        this.markers = [];
      },
      // 设置标记物
      setMapMarker() {

        this.markers = [{
          icon: 'https://tpsite.oss-cn-hangzhou.aliyuncs.com/1/material/5f899981-c836-47d8-b8ed-d6b83da59aa4.png',
          position: {
          lat: 23.15086,
          lng: 113.38599
          }
        }, {
          icon: 'https://tpsite.oss-cn-hangzhou.aliyuncs.com/1/material/5f899981-c836-47d8-b8ed-d6b83da59aa4.png',
          position: {
            lat: 23.15086,
            lng: 113.38579
          }
        }]

      }
    },
  }
</script>

<style lang="less">

</style>
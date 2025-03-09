<template>
  <view class="gmap-container">
      <view 
        id="gmap" 
        :autoLocationNum="autoLocationNum" 
        :centerPoint="centerPoint" 
        :marketList="marketList"
        :change:marketList="gmap.updateMarketList" 
        :change:centerPoint="gmap.updatecenterPoint"
        :change:autoLocationNum="gmap.autoLocationNumFn" 
        :googleKey="googleKey" 
        :change:googleKey="gmap.updateGooglekey"
      ></view>
	  <view id="address"></view>
  </view>
</template>

<script>
  /*
    覆盖物格式
    {
      
        icon: 'https://tpsite.oss-cn-hangzhou.aliyuncs.com/1/material/5f899981-c836-47d8-b8ed-d6b83da59aa4.png',
        position: {
          lat: 23.222,
          lng: 121.122
        }
      
    }
  */
  export default {
    data() {
      return {
        key: "",
        autoLocationNum: 0
      }
    },
    props: {
      googleKey: {
        type: String,
        default: ''
      },
      centerPoint: {
        type: Object,
        default: {}
      },
      marketList: {
        type: Array,
        default: []
      }
    },
    mounted() {

    },
    computed: {},
    methods: {
		
		
		         reverseGeocode(latLng) {
		                const geocoder = new google.maps.Geocoder();
		                geocoder.geocode({ location: latLng }, (results, status) => {
		                    if (status === "OK") {
								console.log('000000',results)
		                        if (results[0]) {
		                            // 显示地址
		                            document.getElementById("address").innerText = "地址: " + results[0].formatted_address;
		                        } else {
		                            document.getElementById("address").innerText = "未找到地址";
		                        }
		                    } else {
								console.log('9999999反向地理编码失败')
		                        document.getElementById("address").innerText = "反向地理编码失败: " + status;
		                    }
		                });
		            },
		
      
      // 定位当前
      autoLocation(val) {
        this.autoLocationNum++;
      },
      // 标记物被点击
      markerClickRender(data) {
        this.$emit('markerClick', data)
      },
      // 地图渲染完成
      mapRenderComplete() {
        this.$emit('gMapRenderComplete')
      }
    }
  }
</script>

<!-- renderjs渲染 -->
<script module="gmap" lang="renderjs">
  let map = null;
  export default {
    data() {
      return {
        ownerInstanceObj: null, //SERVICE层对象
        markers: [], //marker 列表
        currMark: '',
        centerPoints: {},
        // 'AIzaSyDpyOB_95_C3BpdyhYJs7c53Z-0O6eS0GM'
        config: {
          googleKey: 'AIzaSyChbJQQ5ieFkKn2T5aDurZSyIxYywsMCmw',
		    // googleKey: 'AIzaSyDpyOB_95_C3BpdyhYJs7c53Z-0O6eS0GM',
          curPositionIcon: "http://oss.aliyuncs.com/tpsite2/pinpinvn.com/e88af5153b996eac0a2941f22b8c26b5.png"
        }
      }
    },
    mounted() {
      let mapDoc = document.getElementById('gmap')
      mapDoc.innerHTML = `<div id="googleMap" style="width: 100%;height: 100%;"></div>`
	  
	  let that=this
	  uni.getLocation({
	  	type: 'wgs84',
	  	success: function (res) {
	  		console.log('当前位置的经度：' + res.longitude);
	  		console.log('当前位置的纬度：' + res.latitude);
			
			that.centerPoints={lat:res.latitude,lng:res.longitude}
			console.log('开始定位')
			that.updatecenterPoint(that.centerPoints)
			that.reverseGeocode(that.centerPoints)
			
			
			// this.centerPoints.lat, this.centerPoints.lng)
	  	}
	  });
	  
	  
    },
    methods: {
      updateGooglekey(newValue, oldValue, ownerInstance, instance) {
        this.config.googleKey = 'AIzaSyChbJQQ5ieFkKn2T5aDurZSyIxYywsMCmw';
        this.loadGoogleMap();
      },
      // 加载谷歌Map
      loadGoogleMap() {
      
        let mapLib = document.createElement("script")
        mapLib.src = `https://maps.googleapis.com/maps/api/js?key=${ this.config.googleKey }&libraries=places&v=weekly&language=vi`;
        document.head.appendChild(mapLib)
        mapLib.onload = this.initMap;
      
      },
      initMap() {
        // 默认的中心点
        let centerPoint = {
          lat: 23.138136,
          lng: 113.351082
        };
        //新建map
        map = new google.maps.Map(document.getElementById("googleMap"), {
          zoom: 18,
          center: new google.maps.LatLng(centerPoint.lat, centerPoint.lng),
          disableDefaultUI: true
        });


        let markers = []


        this.$ownerInstance.callMethod('mapRenderComplete')

      },
      // 更新标记物
      updateMarketList(newValue, oldValue, ownerInstance, instance) {
        // console.log('新的标记物点', newValue)
        this.setPowerMarker(newValue)
      },

      updatecenterPoint(newValue, oldValue, ownerInstance, instance) {
        // console.log('新的中心点', newValue);
        this.centerPoints = newValue;
        if (map) {
          map.setCenter(newValue)
          this.clearCurrMarker(); // 清空当前中心点
          //绘制中心点icon
          const image = { 
            url: this.config.curPositionIcon,
            scaledSize: new google.maps.Size(28, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0)
          };

          // 创建 中心点标记物
          this.currMark = new google.maps.Marker({
            position: new google.maps.LatLng(this.centerPoints.lat, this.centerPoints.lng),
            map: map,
            icon: image,
            animation: google.maps.Animation.DROP
          })
        }
      },
      // 定位当前位置
      autoLocationNumFn(newValue, oldValue, ownerInstance, instance) {
        // console.log('自定定位的中心坐标', this.centerPoints);
        if (map) {
          map.setCenter(this.centerPoints)
        }
      },
      // 设置标志物
      setPowerMarker(arr = []) {
        //清空之前的markets
        this.clearMarker()
        let item = null
        arr.forEach((item, index) => {
          setTimeout(() => {
            item = new google.maps.Marker({
              position: item.position,
              map: map,
              icon: {
                url: item.icon,
                scaledSize: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 0)
              },
              animation: google.maps.Animation.DROP
            })
            this.markers.push(item)

            
            google.maps.event.addListener(item, "click", () => {
              this.$ownerInstance.callMethod('markerClickRender', index)
            })
          }, index * 700)
        })
      },
      // 清空标志物
      clearMarker() {
        this.markers.forEach((item) => {
          item.setMap(null)
        })
      },
      // 清空当前的标志物
      clearCurrMarker() {
        if (this.currMark) {
          this.currMark.setMap(null)
          this.currMark = null
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  #gmap {
    width: 100%;
    height: 100%;
  }

</style>
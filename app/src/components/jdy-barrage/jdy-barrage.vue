<style lang="scss">
.text-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 4rpx;
  .user-status-text {
    font-weight: 300;
    font-size: 20rpx;
    color: #21120b;
  }
  .cover {
    width: 30rpx;
    height: 30rpx;
    border-radius: 50%;
    margin: 0 8rpx;
  }
}
.pao {
  transform: "translateX(100%)";
  position: absolute;
  top: 0;
  left: 0;
  height: 50rpx;
  display: flex;
  z-index: 99999;
  .bg {
    position: absolute;
    top: 0;
    width: 285rpx;
    height: 44rpx;
  }
}
.all-content {
  position: relative;
  overflow: hidden;
}
</style>

<template>
  <cover-view>
    <view
      class="all-content"
      :style="{ width: `${screenWidth}px`, height: `${maxTop + 150}px` }"
    >
      <view
        class="pao"
        v-for="(item, index) in listData"
        :key="item.id"
        :ref="'pao_' + item.id"
        :style="{ top: `${item.top}px`, width: `${screenWidth}px` }"
      >
        <image class="bg" src="/static/images/raffle/raffle_dm_box.png" />
        <view class="text-box">
          <image class="cover" src="/static/images/raffle/raffle_cover.png" />
          <text class="user-status-text">{{ item.item }}</text>
        </view>
      </view>
    </view>
  </cover-view>
</template>
<script>
// #ifdef APP-PLUS
const animation = weex.requireModule("animation");
// #endif

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export default {
  props: {
    maxTop: {
      type: Number,
      default: 200,
    },
    screenWidth: {
      //弹幕容器宽度
      type: Number,
      default: 375,
    },
  },
  data() {
    return {
      listData: [],
      itemId: 1,
    };
  },
  created() {
    // uni.getSystemInfo({
    // 	success:e => {
    // 		this.screenWidth = e.screenWidth
    // 	}
    // })
  },
  methods: {
    add(obj) {
      this.itemId++;
      let data = {
        item: obj.item,
        id: this.itemId,
        top: Math.round(getRandomArbitrary(170, 230)), //这里的40是弹幕距离弹幕容器底部的距离，可以根据自己需求修改
      };
      this.listData.push(data);
      // #ifdef APP-PLUS
      setTimeout(() => {
        animation.transition(
          this.$refs["pao_" + data.id][0],
          {
            styles: {
              transform: "translateX(-100%)",
              transformOrigin: "center center",
            },
            duration: 10000, //ms
            timingFunction: "linear",
            delay: 0, //ms
          },
          () => {
            // 这里做动画完成 回收节点
            this.listData.shift();
            setTimeout(
              () => {
                this.add(obj);
              },
              getRandomArbitrary(1, 6) * 1000
            );
          }
        );
      }, 500);
      // #endif
    },
  },
};
</script>
<style></style>

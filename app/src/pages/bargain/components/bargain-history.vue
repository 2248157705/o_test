<template>
  <popup ref="popupRef" title="议价详情">
    <scroll-view
      v-if="detail.bid_history"
      scroll-y="true"
      :show-scrollbar="false"
      :style="`height: ${parseInt(screenHeight / 2)}px`"
    >
      <view
        v-for="(dItem, index) in detail?.bid_history?.records"
        :key="index"
        class="bargain-box"
      >
        <view class="item">
          <!--          <image src="/static/images/im/list/20.png" class="icon"></image>-->
          <view class="menu-box">
            <view class="menu" :class="`${getBgColor(dItem, index)}`">
              <view class="left">
                <view
                  ><text class="name">{{ getBidder(dItem) }}</text>
                </view>
                <view
                  ><text class="time">{{ dItem.create_time }}</text></view
                >
              </view>
              <view class="right">
                <view
                  ><text class="price">￥{{ dItem.price }}</text></view
                >
                <view
                  ><text
                    :class="`${getStatusColor(dItem, index)}`"
                    class="status"
                    >{{ getStatus(dItem) }}</text
                  >
                </view>
              </view>
            </view>
            <view style="background: transparent; height: 30rpx"></view>
          </view>
        </view>
      </view>
    </scroll-view>
  </popup>
</template>

<script setup lang="ts">
import { BargainStatus } from "@/enums/order";
import { ref } from "vue";
import { deepClone } from "@/components/im/utils";
import Popup from "@/components/popup/index.vue";
const screenHeight = uni.getSystemInfoSync().windowHeight;
const popupRef = ref<Popup>(null);

const close = () => {
  popupRef.value.close();
};

const detail = ref({});
const getBidder = (item) => {
  const { status, reason } = item;
  switch (status) {
    case BargainStatus.WAIT_SELLER:
      return "买家";
    case BargainStatus.WAIT_BUYER:
      return "卖家";
    case BargainStatus.BUY_AGREE:
      return "买家";
    case BargainStatus.SELLER_AGREE:
      return "卖家";
    case BargainStatus.SELLER_REFUSE:
      return "卖家";
    case BargainStatus.LAPSE:
      return reason;
    case BargainStatus.FINISH:
      return "买家";
    default:
      return "系统";
  }
};
const getStatus = (dItem) => {
  const { status: bargain_status } = dItem;
  if ([BargainStatus.WAIT_SELLER].includes(bargain_status)) {
    return "已出价";
  } else if ([BargainStatus.SELLER_REFUSE].includes(bargain_status)) {
    return "已拒绝";
  } else if ([BargainStatus.WAIT_BUYER].includes(bargain_status)) {
    return "已还价";
  } else if ([BargainStatus.BUY_AGREE].includes(bargain_status)) {
    return "已同意";
  } else if ([BargainStatus.SELLER_AGREE].includes(bargain_status)) {
    return "已同意";
  } else if ([BargainStatus.FINISH].includes(bargain_status)) {
    return "已成交";
  } else if ([BargainStatus.LAPSE].includes(bargain_status)) {
    return "已失效";
  } else {
    return "";
  }
};

const getBgColor = (item) => {
  switch (item.status) {
    case BargainStatus.BUY_AGREE:
    case BargainStatus.SELLER_AGREE:
      return "cyan-bg";
    default:
      return "gray-bg";
  }
};

const getStatusColor = (item) => {
  switch (item.status) {
    case BargainStatus.SELLER_REFUSE:
    case BargainStatus.LAPSE:
      return "disagree";
    case BargainStatus.BUY_AGREE:
    case BargainStatus.SELLER_AGREE:
      return "agree";
    default:
      return "normal";
  }
};

const open = (data) => {
  const temp = deepClone(data);
  temp.bid_history.records.reverse();
  detail.value = temp;
  popupRef.value.open();
};

defineExpose({
  close,
  open,
});
</script>

<style lang="scss" scoped>
.bargain-box {
  .item {
    @include flex(row);
    justify-content: space-between;
    .icon {
      width: 30rpx;
      height: 180rpx;
      margin-right: 20rpx;
    }
    .menu-box {
      flex: 1;
    }

    .gray-bg {
      background-image: linear-gradient(to bottom, #f4f5f6, #fafbfc);
      .price {
        font-size: 36rpx;
        color: #1a1a1a;
      }
    }
    .cyan-bg {
      background-image: linear-gradient(to bottom, #ebfffa, #fafbfc);
      .price {
        font-size: 36rpx;
        color: #fd505e;
      }
    }

    .menu {
      @include flex(row);
      justify-content: space-between;
      border-radius: 24rpx;
      padding: 24rpx 40rpx 18rpx;
      .left {
        @include flex(column);
        justify-content: flex-end;
      }
      .name {
        font-size: 32rpx;
        color: #1a1a1a;
        text-align: left;
        font-weight: bold;
      }
      .time {
        font-weight: 400;
        font-size: 28rpx;
        color: #afafaf;
        text-align: left;
        height: 75rpx;
        line-height: 75rpx;
      }
      .right {
        flex-direction: column;
        align-items: flex-end;
      }
      .price {
        font-weight: bold;
        font-size: 32rpx;
        text-align: right;
      }
      .status {
        font-weight: 500;
        font-size: 28rpx;
        text-align: right;
        height: 72rpx;
        line-height: 72rpx;
      }

      .agree {
        color: #1cc7be;
      }
      .disagree {
        color: #fd505e;
      }
      .normal {
        color: #4a4c5a;
      }
    }
  }
}
</style>

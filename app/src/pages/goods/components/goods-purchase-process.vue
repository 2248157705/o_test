<template>
  <popup
    ref="popupRef"
    title="买号流程"
    :closeable="false"
    :popupStyle="popupStyle"
    @close="close"
  >
    <view class="close" @click="close">
      <u--image
        width="48rpx"
        height="48rpx"
        src="/static/images/common/icon_close_2.png"
      />
    </view>

    <scroll-view scroll-y class="main">
      <template v-if="props.product.product_type == ProductTypeEnum.GUARANTEE">
        <image
          mode="widthFix"
          style="width: 100%"
          src="/static/images/sell/icon_purchase-process-cover-guarantee.png"
        />
      </template>
      <template
        v-else-if="props.product.product_type == ProductTypeEnum.RECYCLE"
      >
        <image
          mode="widthFix"
          style="width: 100%"
          src="/static/images/sell/icon_purchase-process-cover-recycle.png"
        />
      </template>
      <template v-else>
        <image
          mode="widthFix"
          style="width: 100%"
          src="/static/images/sell/icon_purchase-process-cover.png"
        />
      </template>
      <!-- <view class="process-box">
        <view v-for="item in processItem" :key="item.title" class="item">
          <u--image width="40rpx" height="40rpx" :src="item.icon" />
          <view class="content">
            <view class="tit">
              <text class="text">{{ item.title }}</text>
            </view>
            <text class="desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>
      <view class="rule">
        <text class="tit">注意：</text>
        <text class="text"
          >1.交易账号换绑期间及换绑完成后24小时内建议买卖双方不要对该账号进行任何形式的充值和消费，否则引起的-切纠纷与平台无关，
        </text>
        <text class="text"
          >2.账号如发生冻结或异常等造成不能使用的情况,代售君只能协助处理,有无法解冻的可能,由账号绑定方承担。</text
        >
      </view> -->
    </scroll-view>
  </popup>
</template>

<script setup>
import { ref } from "vue";
import Popup from "@/components/popup/index.vue";
import { ProductTypeEnum } from "@/enums/product";

const popupStyle = {
  backgroundColor: "#fff", // 修改背景色
  borderTopLeftRadius: "24rpx", // 修改圆角
  borderTopRightRadius: "24rpx", // 修改圆角
  padding: "32rpx", // 修改内边距
  boxSizing: "border-box", // 修改内边距
  boxShadow: "0rpx -8rpx 32rpx 0rpx rgba(0, 0, 0, 0.04)",
};

const popupRef = ref();
const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
});

// const processItem = ref([
//   {
//     title: "下单",
//     desc: "买家在线付款",
//     icon: "/static/images/sell/icon_purchase-process-1.png",
//   },
//   {
//     title: "拉组",
//     desc: "系统自动拉群，买家进群等待卖家确认发号",
//     icon: "/static/images/sell/icon_purchase-process-2.png",
//   },
//   {
//     title: "验号",
//     desc: "买家验号，查看是否与描述相符",
//     icon: "/static/images/sell/icon_purchase-process-3.png",
//   },
//   {
//     title: "换绑",
//     desc: "验号无误，客服协助买卖双方正常换绑账号，修改密码，具体换绑生效时间以游戏账号类型为准2-24小时不等",
//     icon: "/static/images/sell/icon_purchase-process-4.png",
//   },
//   {
//     title: "签合同",
//     desc: "在[我的-合同中心] 签署订单对应的合同",
//     icon: "/static/images/sell/icon_purchase-process-5.png",
//   },
//   {
//     title: "收货",
//     desc: "合同签毕，买家在 [我的-已成交] 确认收货。若24小时内未操作，系统将自动视为已收货",
//     icon: "/static/images/sell/icon_purchase-process-6.png",
//   },
// ]);

const open = () => {
  popupRef.value?.open();
};

const close = () => {
  popupRef.value?.close();
};

defineExpose({
  open,
  close,
});
</script>

<style lang="scss" scoped>
@import "@/static/style/customicons.scss";

.close {
  position: absolute;
  right: 32rpx;
  top: 32rpx;
}

.main {
  /* padding: 24rpx; */
  height: 1000rpx;
}

.process-box {
  .item {
    margin-bottom: 24rpx;
    display: flex;
    justify-content: flex-start;
  }
  .content {
    margin-left: 24rpx;

    .tit {
      .text {
        font-weight: 600;
        font-size: 28rpx;
        color: #1a1a1a;
      }
    }
    .desc {
      line-height: 50rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #606060;
    }
  }
}
.rule {
  @include flex(column);

  .tit {
    font-weight: 600;
    font-size: 28rpx;
    color: #1a1a1a;
  }
  .text {
    font-weight: 400;
    font-size: 24rpx;
    color: #606060;
    line-height: 44rpx;
  }
}
</style>

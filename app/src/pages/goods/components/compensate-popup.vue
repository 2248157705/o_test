<template>
  <popup
    ref="popupRef"
    :show="visible"
    :closeable="false"
    :popupStyle="popupStyle"
    title=""
    @close="close"
  >
    <view class="compensate-content">
      <image class="bg" src="/static/images/sell/icon-bp-bg.png" />
      <image
        class="close"
        src="/static/images/home/icon-ax-close.png"
        @tap="close"
      />
      <view class="bp-title">
        <image class="title-icon" src="/static/images/sell/icon-bp-title.png" />
      </view>
      <view class="bp-content">
        <scroll-view scroll-y :show-scrollbar="false" style="height: 1080rpx">
          <image
            class="bp-content-text"
            src="/static/images/sell/icon-bp-text.png"
          />
          <view class="bp-item">
            <text class="title">包赔业务介绍</text>
            <text class="text" style="font-weight: 500"
              >【找回包赔是淘个号平台为广大游戏玩家提供的全方位售后服务保障】</text
            >
            <text class="text" style="margin-top: 15rpx; margin-bottom: 15rpx"
              >在淘个号下单购买账号，同时购买包赔服务保障，账号出现卖家恶意找回且账号无转手情况，可提供相关凭证申请赔付。</text
            >
            <text class="text"
              >如若私下将账号出售给其他玩家，视为自动放弃找回包赔服务。</text
            >
          </view>
          <view class="bp-item">
            <text class="title">为什么要选择找回包赔</text>
            <text class="text" style="font-weight: 500"
              >【找回包赔是淘个号平台为广大游戏玩家提供的全方位售后服务保障】</text
            >
            <text class="text" style="margin-top: 15rpx"
              >交易双方提供严谨的交易资料、账号转让合同、实名验证，账号的安全度非常高。被找回且账号发生找回后15天内无法追回（<text
                style="color: #f87024"
                >账号购买后没转手</text
              >），都无条件补偿。</text
            >
          </view>

          <view class="bp-item">
            <text class="title">赔付流程</text>

            <image
              style="width: 100%; height: 692rpx"
              src="/static/images/sell/icon-bp-item1.png"
            />
          </view>

          <view class="bp-item">
            <text class="title">包赔服务选项</text>
            <view class="bp-item-top">
              <view class="text text1">
                <text class="msg">类型</text>
              </view>
              <text class="text text2">介绍</text>
            </view>
            <template v-for="(item, index) in insuranceList" :key="index">
              <view class="bp-item-content">
                <view class="text text1">
                  <text class="msg">{{ item.name }}</text>
                </view>
                <text class="text text2">{{
                  item.insurance_instructions
                }}</text>
              </view>
            </template>

            <!-- <image
              style="width: 100%; height: 622rpx"
              src="/static/images/sell/icon-bp-item2.png"
            /> -->
          </view>

          <view class="bp-item">
            <text class="title">常见问题</text>
            <view class="list">
              <view class="question">
                <text class="icon" style="background-color: #ffcc5e">Q</text>
                <text class="icon-title">中介担保交易可以包赔吗?</text>
              </view>
              <view class="question">
                <text class="icon" style="background-color: #606060">A</text>
                <text class="icon-text"
                  >可以，买家在下单时，可以选择包赔保障服务。</text
                >
              </view>
            </view>

            <view class="list">
              <view class="question">
                <text class="icon" style="background-color: #ffcc5e">Q</text>
                <text class="icon-title">闪电回收交易可以包赔吗?</text>
              </view>
              <view class="question">
                <text class="icon" style="background-color: #606060">A</text>
                <text class="icon-text"
                  >可以，买家在下单时，可以选择包赔保障服务。</text
                >
              </view>
            </view>

            <view class="list">
              <view class="question">
                <text class="icon" style="background-color: #ffcc5e">Q</text>
                <text class="icon-title">只要是账号被找回都可以赔付吗?</text>
              </view>
              <view class="question">
                <text class="icon" style="background-color: #606060">A</text>
                <text class="icon-text"
                  >买方曾在淘个号平台上有账号找回记录的、买卖存在恶意索赔骗保的、账号被盗、账号被删、账号被骗等，不在赔付范围内，只要核实是卖家找回事实的，均可以获得赔付。</text
                >
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </popup>
</template>
<script setup>
import { ref, watch } from "vue";
import Popup from "@/components/popup/index.vue";
import { getQueryProductConfig } from "@/api/order";
import { formatList } from "../js/insurance";
import { InsuranceType } from "@/enums/order";

const popupStyle = ref({
  height: "80vh",
  borderTopLeftRadius: "24rpx", // 修改圆角
  borderTopRightRadius: "24rpx", // 修改圆角
  padding: "0", // 修改内边距
  boxSizing: "border-box", // 修改内边距
});
const popupRef = ref(null);
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  product: {
    type: Object,
    default: () => {},
  },
});
const insuranceList = ref([]);
const visible = ref(props.show);
const emit = defineEmits(["close"]);

getQueryProductConfig({ product_id: props.product.product_id }).then(
  ({ insurance_list }) => {
    insuranceList.value = formatList(
      insurance_list,
      props.product.product_price
    ).filter((item) => item.insurance_type != InsuranceType.NO_BUY);
  }
);

const close = () => {
  visible.value = false;
  emit("close");
};
watch(
  () => props.show,
  (val, oldVal) => {
    if (val != oldVal) {
      visible.value = val;
    }
  },
  {
    deep: false,
  }
);
</script>

<style lang="scss" scoped>
.compensate-content {
  height: 1268rpx;
  position: relative;
  padding: 0 32rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .bg {
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    border-top-left-radius: 24rpx;
    border-top-right-radius: 24rpx;
    z-index: 1;
  }
  .close {
    position: absolute;
    right: 32rpx;
    top: 40rpx;
    width: 48rpx;
    height: 48rpx;
    z-index: 99;
  }
  .bp-title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40rpx;
    margin-bottom: 24rpx;
    z-index: 2;
    position: relative;
    .title-icon {
      width: 176rpx;
      height: 48rpx;
    }
  }
  .bp-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    flex: 1;
    background: linear-gradient(180deg, #f0fffe 0%, #ffffff 2%, #ffffff 100%);
    margin-bottom: 32rpx;
    border-radius: 12rpx;
    padding: 32rpx;
    padding-bottom: 0;
    .bp-content-text {
      width: 630rpx;
      height: 164rpx;
      margin-bottom: 40rpx;
    }
    .bp-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .bp-item-top {
        width: 100%;
        height: 90rpx;
        background-color: #fdd259;
        border-top-left-radius: 6rpx;
        border-top-right-radius: 6rpx;
        display: flex;
        flex-direction: row;
        .text {
          width: 220rpx;
          color: #fff;
          font-size: 28rpx;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          &.text1 {
            .msg {
              width: 80rpx;
            }
          }
          &.text2 {
            flex: 1;
          }
        }
      }
      .bp-item-content {
        width: 100%;
        background-color: #fffdf5;
        border-bottom-left-radius: 6rpx;
        border-bottom-right-radius: 6rpx;
        display: flex;
        flex-direction: row;
        padding: 24rpx 0;
        .text {
          width: 220rpx;
          color: #1a1a1a;
          font-size: 32rpx;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          &.text1 {
            .msg {
              width: 80rpx;
            }
          }
          &.text2 {
            flex: 1;
            font-size: 28rpx;
            font-weight: 400;
            padding: 0 24rpx;
          }
        }
      }
      .title {
        padding: 12rpx 32rpx;
        height: 62rpx;
        background: linear-gradient(90deg, #ffffff 0%, #fff7b4 100%);
        border-radius: 12rpx;
        margin: 24rpx 0;
        display: flex;
        text-align: center;
        line-height: 62rpx;
        font-weight: 600;
        font-size: 32rpx;
        color: #1a1a1a;
      }

      .text {
        font-weight: 400;
        font-size: 28rpx;
        color: #1a1a1a;
        line-height: 44rpx;
      }
      .list {
        padding: 16rpx 0;
        border-bottom: 3rpx solid #f7f9fa;
        .question {
          display: flex;
          flex-direction: row;
          margin-bottom: 10rpx;
          .icon {
            display: flex;
            width: 36rpx;
            height: 36rpx;
            text-align: center;
            align-items: center;
            justify-content: center;
            line-height: 36rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #ffffff;
            margin-right: 12rpx;
            border-radius: 50%;
          }
          .icon-title {
            font-weight: 500;
            font-size: 28rpx;
            color: #1a1a1a;
            flex: 1;
          }
          .icon-text {
            font-weight: 500;
            font-size: 28rpx;
            color: #606060;
            flex: 1;
          }
        }
      }
    }
  }
}
</style>

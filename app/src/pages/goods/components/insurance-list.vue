<template>
  <view class="insurance-list">
    <template v-for="(item, index) in insuranceList" :key="item.id">
      <view
        class="insurance-item"
        :class="{
          active: item.id == active,
        }"
        @click="handleChange(item)"
      >
        <view class="insurance-item-title">
          <view class="title-box">
            <text class="title">{{ item.name }}</text>
          </view>
          <view class="price">
            <u--text
              bold
              color="#1A1A1A"
              size="16"
              mode="price"
              :text="+(item.price || 0)"
              align="right"
            ></u--text>
          </view>
        </view>
        <view class="insurance-item-content">
          <view class="desc-box">
            <text class="text">{{ item.desc }}</text>
          </view>
          <view class="tips-box">
            <text class="tips">若证实被找回，可赔付&nbsp;</text>
            <text class="red text"
              >¥{{ priceFormat(item.claim_price, 2) }}</text
            >
          </view>
        </view>
        <view class="checkbox">
          <u--image
            width="48rpx"
            height="48rpx"
            :src="
              item.id == props.active
                ? '/static/images/common/icon_radio_active.png'
                : '/static/images/common/icon_radio.png'
            "
          />
        </view>
      </view>
    </template>
    <view v-if="false" class="insurance-tips">
      <text class="text"
        >本模块为保险投保页面，请仔细阅读<text
          class="link"
          @click="toTradingRules"
          >《交易游戏平台买卖交易规则》</text
        >、<text class="link" @click="toUserAgreement"
          >《交易游戏平台用户服务协议及规则》</text
        ></text
      >
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";
import { toUserAgreement, toTradingRules, priceFormat } from "@/utils/index";
import { formatList } from "../js/insurance";
import { InsuranceType } from "@/enums/order";

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  active: {
    type: [Number, String],
    default: 1,
  },
  productPrice: {
    type: [String, Number],
    default: 0,
  },
});

const emit = defineEmits(["change"]);

const insuranceList = computed(() => {
  // console.log("props.productPrice", props.productPrice, props.list);
  const list = props.list.filter(
    (item) => item.insurance_type !== InsuranceType.NO_BUY
  );
  return formatList(list, props.productPrice);
});

// 是否必选
const isRequired = computed(() => {
  const index = props.list.findIndex(
    (item) => item.insurance_type === InsuranceType.NO_BUY
  );
  return index !== -1 ? false : true;
});

watch(
  insuranceList,
  (values) => {
    if (values && values.length > 0) {
      emit("change", values[0]);
    } else {
      emit("change", {});
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

const handleChange = (item) => {
  if (isRequired.value) {
    emit("change", item);
  } else {
    // 非必选 选中则取消
    if (props.active === item.id) {
      emit("change", {});
    } else {
      emit("change", item);
    }
  }
};
</script>
<style lang="scss" scoped>
.insurance-list {
  @include flex(column);
  margin-top: 16rpx;
  .free {
    height: 88rpx;
  }
  .insurance-item {
    padding: 18rpx 24rpx;
    background: #ffffff;
    border-radius: 12rpx;
    box-sizing: border-box;
    margin-bottom: 16rpx;
    @include flex(column);
    position: relative;
    border: 2rpx solid #ffffff;
    //min-height: 180rpx;

    &-title {
      @include flex(row);
      justify-content: space-between;
      align-items: flex-start;
      height: 40rpx;
      .title-box {
        @include flex(row);
        margin-bottom: 18rpx;
        .title {
          font-weight: 500;
          font-size: 32rpx;
          color: #1a1a1a;
          margin-right: 8rpx;
        }
      }
    }
    &-content {
      @include flex(column);
      .desc-box {
        margin-top: 8rpx;
      }
      .text {
        font-weight: 400;
        font-size: 28rpx;
        color: #1a1a1a;

        &.red {
          font-weight: 600;
          font-size: 28rpx;
          color: #f42a2a;
        }
      }

      .price {
        font-weight: 600;
        font-size: 24rpx;
        color: #f42a2a;
      }
      .tips-box {
        margin-top: 8rpx;
        .tips {
          font-weight: 400;
          font-size: 28rpx;
          color: #afafaf;
        }
      }
    }
    &.active {
      border: 2rpx solid $app-main-color;
      background: linear-gradient(to bottom, #ebf5f4, #ffffff) !important;
    }
    .checkbox {
      position: absolute;
      right: 24rpx;
      bottom: 18rpx;
    }
  }
  .insurance-tips {
    .text {
      font-weight: 300;
      font-size: 24rpx;
      color: rgba(0, 0, 0, 0.56);
    }
  }
}
</style>

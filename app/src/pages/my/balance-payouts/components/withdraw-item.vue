<template>
  <view class="balance-box">
    <view class="flex">
      <text v-if="item.channel_type === 'ZFB'" class="strong"
        >余额提现-到支付宝</text
      >
      <text v-else-if="item.channel_type === 'WX'" class="strong"
        >余额提现-到微信</text
      >
      <text v-else class="strong">余额提现</text>
      <text v-if="item.trans_status === 'PAYOUTS_REFUND'" class="strong">
        +{{ price }}元
      </text>
      <text v-else-if="item.trans_status === 'PAYOUTS'" class="strong">
        -{{ price }}元
      </text>
      <text v-else class="strong"> {{ price }}元 </text>
    </view>
    <view class="flex">
      <text class="text"> {{ item.create_time }}</text>
      <text v-if="item.trans_status === 'SUCCESS'" class="status success">
        提现成功
      </text>
      <text v-else-if="item.trans_status === 'FAIL'" class="status failed">
        提现失败
      </text>
      <text v-else-if="item.trans_status === 'PAYOUTS'" class="status failed">
        <!-- 提现 -->
      </text>
      <text
        v-else-if="item.trans_status === 'PAYOUTS_REFUND'"
        class="status failed"
      >
        退回
      </text>
      <template v-else>
        <text v-if="item.audit_status === 'ING'" class="status">提现中</text>
        <text v-else-if="item.audit_status === 'AGREE'" class="status"
          >提现中</text
        >
        <text v-else-if="item.audit_status === 'REFUSE'" class="status failed"
          >提现失败</text
        >
        <text v-else class="status">提现中</text>
      </template>
    </view>
    <view v-if="item.channel_type === 'WX'" class="flex">
      <text class="text">收款账号: {{ item.real_name }}</text>
    </view>
    <view v-if="item.channel_type === 'ZFB'" class="flex">
      <text class="text">收款账号: {{ item.identity }}</text>
    </view>
    <view v-if="item.refuse_cause" class="flex">
      <u--text
        :text="`原因: ${item.refuse_cause}`"
        size="28rpx"
        color="#afafaf"
        :lines="3"
      ></u--text>
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed } from "vue";
const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const price = computed(() => {
  const num = props.item?.price * 1;
  console.log("num", num);
  if (("" + num).includes(".")) {
    return uni.$u.priceFormat(num || 0, 2);
  } else {
    return uni.$u.priceFormat(num || 0);
  }
});
</script>
<style lang="scss" scoped>
.balance-box {
  padding: 24rpx;
  background: #fff;
  .flex {
    @include flex(row);
    justify-content: space-between;
    align-items: center;
    margin: 8rpx 0;
  }
  .strong {
    text-align: right;
    font-weight: 500;
    font-size: 30rpx;
    color: #1a1a1a;
  }

  .text {
    font-weight: 400;
    font-size: 28rpx;
    color: #afafaf;
  }
  .status {
    font-weight: 400;
    font-size: 28rpx;
    color: $app-main-color;

    &.success {
      color: #1a1a1a;
    }
    &.failed {
      color: #f42a2a;
    }
  }
}
</style>

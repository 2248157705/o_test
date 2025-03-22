<template>
  <text class="h-menu">关于售后</text>
  <view class="h-section">
    <view class="h-title">
      <text class="h-number">01</text>
      <image class="line-number" src="/static/images/my/bg_number.png"></image>
      <!--      <text class="line"></text>-->
      <text>账号出现问题</text>
    </view>
    <view class="h-subTitle"
      >当发现在淘个号平台交易获取的账号出现密码错误且无法更改、绑定手机号变更时，请在第一时间联系客服。</view
    >
    <view class="h-subTitle"
      >可优先联系交易账号时所建立的群聊内客服，如无法找到对应群聊，可在 [
      我的-专属客服 ]
      快速联系客服，并在客服的引导下向淘个号客服提交账号被找回的具体详情。</view
    >
    <image
      v-if="url"
      mode="widthFix"
      src="/static/images/my/help-center/complaint_suggestions.png"
      width="750rpx"
      @click="
        () =>
          previewImage(
            '/static/images/my/help-center/complaint_suggestions.png'
          )
      "
    />
  </view>

  <view class="h-section mb-40">
    <view class="h-title">
      <text class="h-number">02</text>
      <image class="line-number" src="/static/images/my/bg_number.png"></image>
      <text>售后申请</text>
    </view>
    <view class="h-subTitle"
      >在淘个号APP [我的-我买到的-已成交]
      中，点击对应订单【申请售后】并根据页面指引填写相关信息后，点击【提交】即可发起售后申请哦!</view
    >
    <image
      v-if="url"
      mode="widthFix"
      src="/static/images/my/help-center/after_sales_4.png"
      width="750rpx"
      @click="
        () => previewImage('/static/images/my/help-center/after_sales_4.png')
      "
    />
  </view>

  <text class="h-menu">关于理赔</text>

  <view class="des">
    <view v-for="(item, index) in list" :key="index">
      <view class="rule">
        <view class="rule-head">
          <image
            class="bg-number"
            src="/static/images/my/bg_number.png"
          ></image>
          <text class="number">{{ item.number }}</text>
        </view>
        <view>
          <text class="rule-txt">{{ item.txt }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref } from "vue";
const url = ref(`/static/images/my/help-center/after_sales_1.png`);
const list = [
  {
    number: "01",
    txt: "        在平台购买的账号后续使用中，若发生被卖家恶意申诉的情况，平台将在15天内帮助买家找回账号，若15天内无法追回，（账号购买后没转手），都无条件补偿，若买家谎称账号被找回或隐瞒账号已转手，按诈骗处理。",
  },
  {
    number: "02",
    txt: "        平台在处理周期(十五日)内追回账号，号主需无条件接受账号(再发生找回事件平台还会继续进行售后流程)，如在处理周期(十五日)内追回游戏账号，号主拒收账号将视为默认放弃包赔服务，如号主需要维权平台将辅助维权，并非主导。",
  },
  {
    number: "03",
    txt: "        找回包赔只针对于“账号找回”行为生效，请广大用户妥善保管自己购入的游戏账号，找回包赔不对盗号、骗号、封号、冻结等形式受损生效，淘个号平台售后也会视具体情况对受损买家进行最大程度上的协助。",
  },
  {
    number: "04",
    txt: "        购买包赔服务的订单，若经平合核实确定，在交易完成后账号被卖家或他人申诉找回，导致账号无法正常登录的，卖家需配合平台完成售后退款事宜。未购买包赔服务的订单，平台售后也会协助追偿追损。",
  },
  {
    number: "05",
    txt: "        若您淘个号购买不可二次账号(仅限一年内购买账号)，因实名被删除导致被封禁一个月，由于厂商机制，该封禁无法申请时间减免，因此情况属于偶发事件，发生概率仅为2%，发生此情况，平台将协助处理。",
  },
  {
    number: "06",
    txt:
      "        若买家出现以下情形，则视为自动放弃包赔服务，本包赔证明自动失效:\n" +
      "  ·若买家或账号使用者泄露账号信息，导致账号被盗或者被换绑，非前几任号主找回的。\n" +
      "  ·买家通过非正规租号网站，租赁账号，导致账号信息泄露的。\n" +
      "  ·买家和卖家合伙串通，找回账号，造成合同诈骗的。\n" +
      "  ·买家账号被盗号或洗号造成的游戏内虚拟财产损失的。\n" +
      "  ·买家使用第三方代充导致的封号行为。\n" +
      "  ·账号如存在转手情况，包赔自动失效。\n" +
      "  ·如无法确定封号原因或者封号时间，并且订单交易打款完成之后封号的，无论封号时间，不予包赔。如果有确切证据证明是卖家开挂导致的行为，官方进行的追封，可进行赔付。",
  },
];

const previewImage = (img) => {
  uni.previewImage({
    urls: [img],
    current: 0,
  });
};
</script>
<style scoped lang="scss">
.rule {
  position: relative;
  margin-bottom: 50rpx;
  .rule-head {
    position: absolute;
    width: 60rpx;
    height: 60rpx;
  }
  .number {
    position: absolute;
    font-weight: 600;
    font-size: 40rpx;
    color: #1a1a1a;
    text-align: left;
  }
  .bg-number {
    width: 33rpx;
    height: 25rpx;
    position: absolute;
    top: 8rpx;
    left: 6rpx;
  }
  .rule-txt {
    font-weight: 500;
    font-size: 30rpx;
    color: #1a1a1a;
    text-align: left;
    line-height: 50rpx;
  }
}

.h-menu {
  margin: 20rpx 0rpx 0rpx 20rpx;
  font-weight: bold;
  font-size: 48rpx;
  color: #1a1a1a;
  text-align: left;
}

.des {
  margin: 40rpx 20rpx 20rpx 20rpx;
  padding: 40rpx 20rpx 20rpx 20rpx;
  background: #fbfbfb;
}
.h-section {
  background: #f4f5f6;
  border-radius: 8rpx;
  margin: 40rpx 24rpx 5rpx;
  padding: 40rpx 12rpx;
}

.h-title {
  font-weight: 600;
  font-size: 28rpx;
  color: #1a1a1a;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 24rpx;
  .h-number {
    font-weight: 600;
    font-size: 40rpx;
    color: #1a1a1a;
    width: 50rpx;
    position: relative;
    top: -8rpx;
  }
  .line {
    width: 12rpx;
    height: 54rpx;
    //background: linear-gradient( 147deg, #3AF0E4 0%, #32F0E3 100%);
    background: #3af0e4;
    transform: rotate(-125deg);
    position: absolute;
    left: 10rpx;
    top: -6rpx;
    opacity: 0.8;
  }
  .line-number {
    width: 33rpx;
    height: 25rpx;
    position: absolute;
  }
}
.h-subTitle {
  font-weight: 400;
  font-size: 28rpx;
  color: #1a1a1a;
  margin-left: 40rpx;
  margin: 0rpx 0rpx 24rpx 44rpx;
}
.mb-40 {
  margin-bottom: 60rpx;
}
</style>

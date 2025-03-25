<template>
  <global-view
    ref="global"
    bgColor="#F7F9FA"
    :showBgImage="
      paramsData.enterType == ProductTypeEnum.VALUATION && productId
    "
    bgImage="/static/images/sell/icon_valuation_bg.png"
  >
    <view v-if="productId" class="success-view">
      <template v-if="paramsData.enterType == ProductTypeEnum.VALUATION">
        <view class="view valuation">
          <view class="success-msg">
            <image
              class="valuation-success"
              src="/static/images/sell/icon_valuation_success.png"
            />
            <text class="msg">估价提交成功</text>
            <text class="product"
              >请在
              <text class="msg" @tap="handleGoNotify">“系统通知” </text
              >中查看估价报告~</text
            >
          </view>
          <view class="success-box">
            <my-button
              height="96"
              radius="12"
              text="继续估价"
              type="primary"
              @tap="handlePublish"
            />
            <view style="height: 16rpx"></view>
            <my-button
              height="96"
              radius="12"
              type="primary-info"
              openType="customer_service"
              text="联系客服"
            />
            <view :style="{ paddingBottom: safeAreaPadding() }"></view>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="view">
          <view class="success-msg">
            <u--image
              width="240rpx"
              height="240rpx"
              src="/static/images/sell/icon_success.png"
            />
            <text class="msg">提交成功</text>
            <text class="intro">【审核并上架约30分钟左右】</text>
            <text class="product">商品编号：{{ productId }}</text>
          </view>
          <view class="success-box">
            <view class="btn" @tap="handleDetail"
              ><text class="text">查看商品</text></view
            >
            <view class="btn" @tap="handlePublish"
              ><text class="text">继续发布</text></view
            >
          </view>
        </view>
      </template>
    </view>
    <view v-else>
      <view
        v-if="paramsData.enterType == ProductTypeEnum.VALUATION"
        class="valuation-tips"
      >
        <image class="tips" src="/static/images/sell/icon_valuation_tips.png" />
        <text class="text">如实填写账号信息，估价更准确，成交速度提升80%</text>
        {{ paramsData.ticketId }}
      </view>
      <view class="front-view">
        <view
          v-if="paramsData.enterType == ProductTypeEnum.ACCOUNT"
          class="steps"
        >
          <view class="item active">
            <view class="icon">
              <text class="text">1</text>
            </view>
            <text class="text">选择游戏</text>
          </view>
          <view class="line active"></view>
          <view class="item active">
            <view class="icon">
              <text class="text">2</text>
            </view>
            <text class="text">填写信息</text>
          </view>
          <view class="line"></view>
          <view class="item">
            <view class="icon">
              <text class="text">3</text>
            </view>
            <text class="text">完成发布</text>
          </view>
        </view>
        <view v-if="false" class="game-enter">
          <text class="title">当前选择</text>
          <view class="item">
            <view class="left">
              <u--image
                width="116rpx"
                height="116rpx"
                radius="10"
                :src="currentGame.icon"
              />
              <text class="text">{{ currentGame.game_name }}</text>
            </view>
            <view class="right" @tap="handleGameReset">
              <text class="text">重新选择</text>
              <u-icon name="arrow-right" color="#AFAFAF" size="10"></u-icon>
              <!-- <u--image
                  width="24rpx"
                  height="24rpx"
                  src="/static/images/sell/icon_left.png"
                /> -->
            </view>
          </view>
        </view>
      </view>

      <view class="forms" :style="{ paddingBottom: safeAreaPadding() }">
        <enter-form
          ref="form"
          :enterType="paramsData.enterType"
          :gameId="currentGame.id"
          :formFileds="formFileds"
        ></enter-form>
        <view class="submit-msg">
          <template
            v-if="
              [ProductTypeEnum.ACCOUNT, ProductTypeEnum.RECYCLE].includes(
                paramsData.enterType
              )
            "
          >
            <text class="text">提示：</text>
            <text class="text"
              >1、避免违反平台卖号规则，请仔细阅读
              <text class="text tips" @tap.stop="toSellerAgreement">
                《卖家服务协议》
              </text>
              <text class="text tips" @tap.stop="toTradingRules">
                《虚拟物品交易规则》
              </text></text
            >

            <text class="text"
              >2、默认卖家手续费，并且确保提交信息正确，否则引起纠纷自己承担</text
            >
          </template>
          <template v-if="paramsData.enterType == ProductTypeEnum.GUARANTEE">
            <text class="text">提示：</text>
            <text class="text"
              >1、避免违反平台卖号规则，请仔细阅读
              <text class="text tips" @tap.stop="toSellerAgreement">
                《卖家服务协议》
              </text>
              <text class="text tips" @tap.stop="htoTradingRules">
                《虚拟物品交易规则》
              </text></text
            >

            <text class="text"
              >2、买家承担，需买家支付；卖家承担，需从放款金额内扣除。并且确保提交信息正确，否则引起纠纷自己承担。</text
            >
          </template>
        </view>
      </view>
    </view>

    <view
      v-if="!productId"
      class="submit-btn-view"
      :style="{ paddingBottom: safeAreaPadding() }"
    >
      <view class="submit-btn-operation">
        <view class="submit-btn" @tap="handlerSubmit">
          <text
            v-if="paramsData.enterType == ProductTypeEnum.ACCOUNT"
            class="text"
            >立即发布</text
          >
          <text v-else class="text">提交</text>
        </view>
      </view>
    </view>
    <explain-popup ref="explainPopupRef" @agree="handleAgree" />
    <confirm-popup
      text="是否确定填写的信息正确并且提交估价？"
      :show="confirmPopupShow"
      :showCancelButton="true"
      :showConfirmButton="true"
      @confirm="
        () => {
          confirmIs = true;
          confirmPopupShow = false;
          handlerSubmit();
        }
      "
      @close="confirmPopupShow = false"
    />
  </global-view>
</template>

<script setup lang="ts">
import { nextTick, ref, reactive } from "vue";
import { useUserStore } from "@/stores/user";
import { createProduct, createEstimateProduct } from "@/api/product";
import { onLoad } from "@dcloudio/uni-app";
import GlobalView from "@/components/global-view/index.vue";
import EnterForm from "@/components/enter-form/index.vue";
import ExplainPopup from "@/pages/raffle/components/explain-popup.vue";
import ConfirmPopup from "@/components/my-popup/index.vue";
import { safeAreaPadding } from "@/utils";
import { ProductTypeEnum } from "@/enums/product";
import { useMessageStore } from "@/stores/message";
import Events, { report } from "@/utils/report/report";
import { toSellerAgreement, toTradingRules } from "@/utils/index";

const messageStore = useMessageStore();
const global = ref(null);

const userStore = useUserStore();

const currentGame = userStore.gameHistory[0];

const form = ref(null);
const productId = ref(null);
const explainPopupRef = ref(null);
const confirmPopupShow = ref(false);
const explainIs = ref(false);
const confirmIs = ref(false);
const formFileds = ref({});

const paramsData = reactive({
  enterType: ProductTypeEnum.VALUATION,
  ticketId: "1",
});

function toCamelCase(obj) {
  const newObj = {};
  for (const key in obj) {
    const newKey = key.replace(/(_\w)/g, function (k) {
      return k[1].toUpperCase();
    });
    newObj[newKey] = obj[key];
  }
  return newObj;
}

function combineUrls(data) {
  const result = [];
  Object.keys(data).forEach((key) => {
    data[key].forEach((item) => {
      if (item.url) {
        const obj = {};
        obj[key] = item.url;
        result.push(obj);
      }
    });
  });

  return result;
}

const handleGoNotify = () => {
  uni.switchTab({
    url: `/pages/message/index`,
  });
};

const handlerSubmit = () => {
  form.value.validate(async (state, submitData, params) => {
    // state    为true时则校验通过，false则校验不通过
    // submitData   表单字段key:value集合
    uni.log.info("fronthandlerSubmit", state, submitData);

    if (!state) {
      uni.$main.toast(params.msg ? params.msg : "请填写完整信息");
      const pageScrollTop = await form.value.getPageScrollTop(params.formItem);

      // global.value.pageScrollTo(
      //   uni.getSystemInfoSync().windowHeight - pageScrollTop
      // );
      const query = uni.createSelectorQuery().in(this);

      nextTick(() => {
        query
          .select("#scrollView")
          .boundingClientRect((data) => {
            global.value.pageScrollTo(
              pageScrollTop - uni.getSystemInfoSync().statusBarHeight - data.top
            );
          })
          .exec();
      });

      return;
    }

    // 一件估价不需要弹窗
    if (!explainIs.value && paramsData.enterType != ProductTypeEnum.VALUATION) {
      explainPopupRef.value.open();
      return;
    }
    if (!confirmIs.value && paramsData.enterType == ProductTypeEnum.VALUATION) {
      confirmPopupShow.value = true;
      return;
    }

    //
    if (paramsData.enterType === ProductTypeEnum.GUARANTEE) {
      report(Events.SELL_GUARANTEE_SUBMIT, {
        game_id: currentGame.id,
        game_name: currentGame.game_name,
      });
    } else if (paramsData.enterType === ProductTypeEnum.RECYCLE) {
      report(Events.SELL_RECYCLE_SUBMIT, {
        game_id: currentGame.id,
        game_name: currentGame.game_name,
      });
    } else if (paramsData.enterType === ProductTypeEnum.VALUATION) {
      report(Events.HOME_APPRAISE_SUBMIT, {
        game_id: currentGame.id,
        game_name: currentGame.game_name,
      });
    } else if (paramsData.enterType === ProductTypeEnum.ACCOUNT) {
      report(Events.SELL_CONSIGN_PUBLISH, {
        game_id: currentGame.id,
        game_name: currentGame.game_name,
      });
    }

    if (
      [ProductTypeEnum.GUARANTEE, ProductTypeEnum.RECYCLE].includes(
        paramsData.enterType
      )
    ) {
      submitData.ticketId = paramsData.ticketId;
      submitData.product_title = "";
      submitData.product_covert =
        import.meta.env.VITE_APP_CDN_HOST +
        (paramsData.enterType == ProductTypeEnum.RECYCLE
          ? "/taogehao/resource/images/common_recycle_cover.png"
          : "/taogehao/resource/images/common_guarantee_cover.png");
      const screenshot = {
        real: submitData.real,
        contract: submitData.contract,
        other_order: submitData.other_order,
      };
      if (submitData.goodsInfo?.account_source == "platform") {
        delete screenshot.other_order;
      } else {
        delete screenshot.contract;
      }

      submitData.screenshot_info = JSON.stringify(combineUrls(screenshot));
      delete submitData.real;
      delete submitData.contract;
      delete submitData.other_order;
    } else {
      if (submitData.screenshot_info) {
        submitData.product_covert = submitData.screenshot_info[0].url;
        submitData.screenshot_info = JSON.stringify(submitData.screenshot_info);
      }
    }

    submitData.goodsInfo = JSON.stringify(submitData.goodsInfo);

    submitData.gameId = currentGame.id;
    submitData.productType = paramsData.enterType;
    submitData.screenshotType = 1;
    uni.log.info("handlerSubmit", state, submitData);

    const api =
      paramsData.enterType == ProductTypeEnum.VALUATION
        ? createEstimateProduct
        : createProduct;

    const { estimate_id, product_id } = await api(toCamelCase(submitData));
    if (estimate_id || product_id) {
      form.value.resetForm();

      if (
        [ProductTypeEnum.GUARANTEE, ProductTypeEnum.RECYCLE].includes(
          paramsData.enterType
        )
      ) {
        // 担保交易
        uni.$main.toast("录入成功");
        await uni.$u.sleep(2000);
        messageStore.setOperationPermissions(); ///////////

        // 返回群聊
        uni.navigateBack({
          delta: 2,
        });
      } else {
        productId.value = estimate_id || product_id;
      }
    }
  });
};

onLoad(async (param) => {
  paramsData.enterType = +param.type || 4;
  paramsData.ticketId = param.ticketId == "undefined" ? "1" : param.ticketId;
  if (param.formFileds) {
    const { goods_info, ...data } = JSON.parse(param.formFileds);
    formFileds.value = {
      ...goods_info,
      ...data,
    };
    console.log(formFileds.value);
  }
});

const handleAgree = () => {
  explainIs.value = true;
  explainPopupRef.value.close();
};

const handleDetail = () => {
  report(Events.SELL_CONSIGN_VIEW_PRODUCT);
  uni.navigateTo({
    url: `/pages/goods/detail?product_id=${productId.value}`,
  });
};

const handlePublish = () => {
  report(Events.SELL_CONSIGN_CONTINUE_PUBLISH);
  uni.navigateBack();
};

const handleGameReset = () => {
  if (ProductTypeEnum.RECYCLE == paramsData.enterType) return;
  uni.navigateBack();
};

// const handlerReset = () => {
//   form.value.resetForm();
// };
</script>

<style scoped lang="scss">
@import "./css/appraise.scss";
</style>

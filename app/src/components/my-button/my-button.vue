<template>
  <view class="my-botton-wrapper">
    <view
      v-if="type === 'link'"
      class="link"
      :style="btnStyle"
      @click="handleBtnClick"
    >
      <text class="text" :style="sizeStyle">{{ text }}</text>
      <u-icon
        name="arrow-right"
        :size="`${size}rpx`"
        :bold="iconBold"
        color="#AFAFAF"
      ></u-icon>
    </view>
    <view
      v-else
      :class="`btn ${disabled ? 'bg-opacity_5' : ''}`"
      :style="btnStyle"
      @click="handleBtnClick"
    >
      <u-loading-icon
        v-if="loading"
        :vertical="false"
        :show="true"
        :size="`${size}rpx`"
        color="#fff"
      ></u-loading-icon>
      <slot>
        <text class="text" :style="sizeStyle">{{ text }}</text>
      </slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {
  consultCustomerService,
  selectSesstion,
} from "@/components/im/conversation-list";
import { getAfterSaleTidByOrderId } from "@/api/chat";
import { OpenType } from "@/enums/button";
import { computed, reactive, ref } from "vue";
import Events, { report, ReportStatus } from "@/utils/report/report";

const props = defineProps({
  type: {
    type: String,
    default: "default", // default primary
  },
  openType: {
    type: String,
    default: "", // customer_service
  },
  radius: {
    type: [String, Number],
    default: "8",
  },
  height: {
    type: [String, Number],
    default: "86",
  },
  width: {
    type: [String, Number],
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  // 按钮加载完成文本
  loadedText: {
    type: String,
    default: "",
  },
  size: {
    type: [String, Number],
    default: "32",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  backgroundColor: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  params: {
    type: Object,
    default: () => {
      return {};
    },
  },
  loading: {
    type: Boolean,
    default: false,
  },
  bold: {
    type: [String, Number],
    default: 0,
  },
});
const iconBold = computed(() => (props.bold >= 500 ? true : false));
const btnStyle = reactive({
  height: `${props.height}rpx`,
  width: props.width ? `${props.width}rpx` : "auto",
  borderRadius: `${props.radius}rpx`,
  fontWeight: props.bold,
});
if (props.type === "primary") {
  Object.assign(btnStyle, {
    background: "#1CC7BE",
    color: "#ffffff",
  });
} else if (props.type === "primary-info") {
  Object.assign(btnStyle, {
    background: "#fff",
    border: "3rpx solid #1CC7BE",
    color: "#1CC7BE",
  });
} else if (props.type === "info") {
  Object.assign(btnStyle, {
    background: "#F4F5F6",
    color: "#606060",
  });
} else {
  Object.assign(btnStyle, {
    border: props.type === "link" ? 0 : "3rpx solid #F4F5F6",
    color: props.color,
    backgroundColor: props.backgroundColor,
  });
}

const colorList = {
  primary: "#ffffff",
  info: "#606060",
  default: "#1A1A1A",
};
const sizeStyle = reactive({
  fontSize: `${props.size}rpx`,
  color: props.color ? props.color : colorList[props.type],
});

const loading = ref(props.loading);
const text = ref(props.text);

const emit = defineEmits(["reponse"]);
let isRequesting = false; // 标记变量，表示是否正在请求
const handleBtnClick = async () => {
  if (props.openType === OpenType.CUSTOMER_SERVICE) {
    consultCustomerService();
  } else if (Object.values(OpenType).includes(props.openType)) {
    const order_id = props.params.order_id;
    if (!order_id) {
      uni.$main.toast("订单order_id不能为空");
      report(Events.ORDER_ENTER_CHAT_STATUS, {
        status: ReportStatus.FAILED,
        errMsg: "订单id为空",
      });
      return;
    }
    text.value = props.loadedText;
    uni.$main.showLoading({
      title: "正在加载中...",
      mask: true,
    });
    if (isRequesting) {
      return;
    }
    isRequesting = true; // 标记为正在请求
    const data = await getAfterSaleTidByOrderId({
      order_id,
      order_type: props.openType,
    })
      .catch((err) => {
        report(Events.ORDER_ENTER_CHAT_STATUS, {
          status: ReportStatus.FAILED,
          errMsg: err,
        });
      })
      .finally(() => {
        loading.value = false;
        text.value = props.text;
        uni.$main.hideLoading();
        isRequesting = false;
      });
    if (data?.tid) {
      report(Events.ORDER_ENTER_CHAT_STATUS, { status: ReportStatus.SUCCESS });
      selectSesstion(data?.tid, true);
    }
    emit("reponse", data);
  }
};
</script>

<style lang="scss" scoped>
.my-botton-wrapper {
  @include flex;

  flex: 1;
  .link {
    @include flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
  }
  .btn {
    @include flex;
    height: 82rpx;
    border-radius: 8rpx;
    flex: 1;
    align-items: center;
    justify-content: center;
  }
  .bg-opacity_5 {
    opacity: 0.5 !important;
  }
  .bg-opacity_1 {
    opacity: 0.1 !important;
  }

  .text {
    font-weight: 500;
    font-size: 32rpx;
  }
}
</style>

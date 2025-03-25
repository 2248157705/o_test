<template>
  <popup
    ref="popupRef"
    :show="visible"
    :popupStyle="popupStyle"
    :titleBoxStyle="titleBoxStyle"
    title="选择游戏"
    @close="close"
  >
    <view :style="`height:${open ? '1120rpx' : '1220rpx'}`">
      <GoodsIndexList
        type="popup"
        :enterType="enterType"
        :searchColor="color"
        @handle-select="handleSelect"
      />
    </view>
  </popup>
</template>
<script setup>
import { ref, watch, computed } from "vue";
import Popup from "@/components/popup/index.vue";
import GoodsIndexList from "@/components/goods-index-list/index.vue";

const popupRef = ref(null);
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  open: {
    type: Boolean,
    default: true,
  },
  enterType: {
    type: Number,
    default: 1,
  },
  color: {
    type: String,
    default: "#1CC7BE",
  },
});

const colorOp = computed(() => {
  return props.color == "#1CC7BE" ? "#ecfefd" : "rgba(253,92,70,0.2)";
});

const visible = ref(props.show);
const emit = defineEmits(["close", "select"]);
const popupStyle = ref({
  backgroundColor: "#fff", // 修改背景色
  borderTopLeftRadius: "24rpx", // 修改圆角
  borderTopRightRadius: "24rpx", // 修改圆角
  boxSizing: "border-box", // 修改内边距
});
const titleBoxStyle = ref({
  background: `linear-gradient(to bottom, ${colorOp.value}, #fff)`, // 修改背景色
  padding: "32rpx", // 修改内边距
  borderTopLeftRadius: "24rpx", // 修改圆角
  borderTopRightRadius: "24rpx", // 修改圆角
  paddingBottom: "0", // 修改内边距
});
const handleSelect = (item) => {
  if (props.open) {
    uni.navigateTo({
      url: `/pages/goods/list?id=${item.id}`,
    });
  } else {
    emit("select", item);
  }
};
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

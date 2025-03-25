import { reactive } from "vue";

export const menuItemStyle = reactive({
  width: "98rpx",
  height: "40rpx",
});
export const tabsStyle = reactive({
  width: "702rpx",
});
export const inactiveStyle = reactive({
  color: "#606060",
  fontSize: "32rpx",
  fontWeight: "400",
});
export const activeStyle = reactive({
  color: "#1A1A1A",
  fontSize: "32rpx",
  // #ifdef APP-NVUE
  fontWeight: "600",
  // #endif
  // #ifndef APP-NVUE
  fontWeight: "bold",
  // #endif
});
export const barStyle = reactive({
  color: "#1CC7BE",
  backgroundColor: "#1CC7BE",
  borderRadius: 10,
});

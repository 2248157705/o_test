<template>
  <div class="empty-wrapper">
    <image
      class="empty-img"
      src="https://yx-web-nosdn.netease.im/common/e0f58096f06c18cdd101f2614e6afb09/empty.png"
    />
    <text class="empty-text">{{ text }}</text>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  text: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss" scoped>
.empty-wrapper {
  margin: 75px 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .empty-img {
    width: 125px;
    height: 100px;
  }

  .empty-text {
    color: #a6adb6;
    margin: 10px;
  }
}
</style>

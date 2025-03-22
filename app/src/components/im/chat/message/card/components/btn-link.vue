<template>
  <my-button
    style="margin-top: 12rpx"
    height="40"
    width="180"
    size="28"
    type="link"
    color="#1cc7be"
    :text="text"
    @click="emits('click')"
  />
</template>

<script lang="ts" setup>
import MyButton from "@/components/my-button/my-button.vue";

defineProps({
  text: {
    type: String,
    default: "取消",
  },
});
const emits = defineEmits(["click"]);
</script>

<template>
  <my-button
    style="margin-top: 12rpx"
    height="72"
    width="180"
    size="32"
    type="primary"
    :text="text"
    @click="emits('click')"
  />
</template>

<script lang="ts" setup>
import MyButton from "@/components/my-button/my-button.vue";

defineProps({
  text: {
    type: String,
    default: "确定",
  },
});
const emits = defineEmits(["click"]);
</script>

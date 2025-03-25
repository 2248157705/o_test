<template>
  <my-button
    style="margin-top: 12rpx"
    height="72"
    width="180"
    size="32"
    type="info"
    :text="text"
    :disabled="true"
    @click="emits('click')"
  />
</template>

<script lang="ts" setup>
import MyButton from "@/components/my-button/my-button.vue";

defineProps({
  text: {
    type: String,
    default: "已过期",
  },
});
const emits = defineEmits(["click"]);
</script>

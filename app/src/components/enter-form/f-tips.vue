<template>
  <text v-if="props.tips.type == 'text'" class="tips-text">{{
    props.tips.text
  }}</text>
</template>

<script setup lang="ts">
import { withDefaults } from "vue";
type tipsState = {
  tips: {
    type: string;
    text: string;
  };
};

const props = withDefaults(defineProps<tipsState>(), {
  tips: {},
});
</script>

<style lang="scss" scoped>
.tips-text {
  font-weight: 400;
  font-size: 24rpx;
  color: #606060;
}
</style>

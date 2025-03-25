<template>
  <div class="msg-name">
    {{ name }}
    <span v-if="time" class="msg-time">{{ formatTime }}</span>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

const formatTime = computed(() => {
  if (props.time) {
    return dayjs(props.time).format("MM-DD HH:mm");
  }
  return null;
});
</script>
<style lang="scss" scoped>
.msg-time {
  font-size: 24rpx;
  color: #cdcdcd;
}
</style>

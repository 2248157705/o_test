<template>
  <!-- 催一催 -->
  <template v-if="isUrgentMsg">
    <MsgUrgent :msg="msg" />
  </template>
  <view v-else class="msg-tip-noti">
    <!-- 暂时兼容旧的数据,新的数据只会进入上面判断 -->
    {{ msg.attach?.option?.content?.msg }}
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MsgUrgent from "./msg-urgent.vue";
const props = defineProps({
  scene: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  msg: {
    type: Object,
    default: () => ({
      idClient: undefined,
      attach: {
        option: {
          content: undefined,
          position: undefined,
          scene: "team_prompt",
        },
        type: undefined,
      },
    }),
    required: true,
  },
});

//
const option = computed(() => props.msg.attach?.option);

// 是否是催一催消息
const isUrgentMsg = computed(() => option.value?.scene === "team_prompt");
</script>

<style lang="scss" scoped>
.msg-tip-noti {
  margin: 8px auto 0;
  text-align: center;
  font-size: 14px;
  color: #b3b7bc;
  max-width: 70%;
}
</style>

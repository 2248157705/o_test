<template>
  <!-- 催一催 -->
  <template v-if="option?.content?.msg">
    <view class="urgent-box">
      <text v-if="isSelf" class="text"> {{ option?.content?.msg }}</text>
      <text v-else class="text">{{ t("updateTeamStatus") }}</text>
    </view>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/components/im/utils/i18n";
import { useMessageStore } from "@/stores/message/";

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

const messageStore = useMessageStore();

// 催一催消息
const option = computed(() => props.msg.attach?.option);

// 是否是自己发送的消息
const isSelf = computed(
  () => props.msg.from === messageStore.loginCredential?.accid
);
</script>

<style lang="scss" scoped>
.urgent-box {
  margin: 8px auto 0;
  max-width: 70%;
  text-align: center;

  .text {
    font-size: 14px;
    color: #b3b7bc;
  }
}
</style>

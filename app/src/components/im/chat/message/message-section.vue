<template>
  <div v-for="(item, index) in sliceMsgs" :key="index">
    <text>{{ start + index }}</text>
    <messageItem
      :id="MSG_ID_FLAG + item.idClient"
      :key="item.idClient"
      :scene="scene"
      :to="to"
      :msg="item"
      :msg-index="start + index"
    >
    </messageItem>
  </div>
</template>

<script lang="ts" setup>
import messageItem from "./message-item.vue";
import type {
  IMMessage,
  // TMsgScene,
} from "nim-web-sdk-ng/dist/NIM_MINIAPP_SDK/MsgServiceInterface";
import { computed } from "../../../utils/transformVue";

import { MSG_ID_FLAG } from "../../../utils/constants";
import { caculateTimeago } from "../../../utils/date";

const props = defineProps({
  msgs: {
    type: Array,
    required: true,
  },
  scene: {
    type: Object, // Assuming TMsgScene is a custom object type
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  start: {
    type: Number,
    required: true,
  },
  end: {
    type: Number,
    required: true,
  },
});

const sliceMsgs = computed(() => {
  const res: IMMessage[] = [];
  const _slice = props.msgs.slice(props.start, props.end);
  _slice.forEach((item, index) => {
    const msgIndex = props.start + index;
    // 如果两条消息间隔超过5分钟，插入一条自定义时间消息
    if (
      msgIndex > 0 &&
      item.time - props.msgs[msgIndex - 1].time > 5 * 60 * 1000
    ) {
      res.push({
        idClient: "time-" + item.time,
        type: "custom",
        attach: {
          type: "time",
          value: caculateTimeago(item.time),
        },
        status: "sent",
      });
    }
    res.push(item);
  });
  return res.filter((item) => item.type !== "notification");
});
</script>

<style lang="scss" scoped></style>

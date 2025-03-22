<template>
  <u--text
    :color="color ? color : '#1A1A1A'"
    :size="fontSize ? fontSize : 16"
    :lines="1"
    :bold="500"
    :text="appellation"
  />
</template>

<script lang="ts" setup>
import { autorun } from "mobx";
import { onShow } from "@dcloudio/uni-app";
import { ref } from "../utils/transformVue";

import { deepClone } from "../utils";

const appellation = ref("");
const { account, teamId, ignoreAlias, nickFromMsg } = defineProps({
  account: {
    type: String,
    required: true,
  },
  teamId: {
    type: String,
    default: null,
  },
  ignoreAlias: {
    type: Boolean,
    default: false,
  },
  nickFromMsg: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: "#1A1A1A",
  },
  fontSize: {
    type: Number,
    default: 16,
  },
});

const getMsgName = () => {
  const data = deepClone(
    uni.$UIKitStore?.uiStore?.getAppellation({
      account,
      teamId,
      ignoreAlias,
      nickFromMsg,
    })
  );
  appellation.value = data;
};

onShow(() => {
  if (!appellation.value) {
    getMsgName();
  }
});

autorun(
  () => {
    getMsgName();
  },
  {
    delay: 100,
  }
);
</script>

<style scoped lang="scss">
// .appellation {
// }
</style>

<template>
  <div class="msg-text" :style="{ fontSize: (fontSize || 16) + 'px' }">
    <view
      v-if="
        scene === 'p2p' &&
        (msg?.body.indexOf('style=') !== -1 ||
          msg?.body.indexOf('class=') !== -1)
      "
      class="msg-text"
    >
      <rich-text :nodes="htmltext"></rich-text>
    </view>
    <template v-for="(item, index) in textArr" v-else>
      <template v-if="item.type === 'text'">
        <text :key="index" class="msg-text">{{ item.value }}</text>
      </template>
      <template v-else-if="item.type === 'Ait'">
        <text :key="index" class="msg-text" :style="{ color: '#1861df' }">
          {{ " " + item.value }}
        </text>
      </template>
      <template v-else-if="item.type === 'emoji'">
        <Icon
          :key="index"
          :type="emojiMap[item.value]"
          :size="fontSize || 22"
          :style="{ margin: '0 2px 2px 2px', verticalAlign: 'bottom' }"
        />
      </template>
      <template v-else-if="item.type === 'link'">
        <UniLink
          :key="index"
          :href="item.value"
          :style="{ color: '#1861df', fontSize: (fontSize || 16) + 'px' }"
          :showUnderLine="false"
        >
          {{ item.value }}
        </UniLink>
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import Icon from "@/components/im/components/Icon.vue";

import UniLink from "@/components/im/components/uni-link/components/uni-link/uni-link.vue";
import { parseText } from "@/components/im/utils/parseText";
import { emojiMap } from "@/components/im/utils/emoji";
import xss from "@/utils/xss";
import { computed } from "@/components/im/utils/transformVue";

const props = defineProps({
  msg: {
    type: Object, // Assuming IMMessage is a custom object type
    required: true,
    default: () => ({
      body: "",
      ext: "",
    }),
  },
  fontSize: {
    type: Number,
    default: undefined,
  },
  scene: {
    type: String,
    default: "team",
  },
});
// const str = `<div class="title">议价通知</div>你的议价请求，卖家已同意相关商品 [商品编号657616896662581249]请尽快完成购买流程。`.replace('class="title"', 'style=color:red')
// let htmltext = xss.process(str)
// console.warn("htmltext",htmltext)
const str = props?.msg?.body
  .replace('class="title"', "style=font-weight: 500;")
  .replace("margin-bottom:2px;", "");
const htmltext = computed(() => xss.process(str));
const textArr = parseText(props?.msg?.body, props?.msg?.ext);
</script>

<style lang="scss" scoped>
.msg-text {
  word-break: break-all;
  text-align: left;
  overflow-y: auto;

  font-size: 32rpx !important;
  color: #1a1a1a;
  line-height: 50rpx;
}
</style>

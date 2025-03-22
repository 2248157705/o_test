<template>
  <div class="msg-face-wrapper">
    <div class="msg-face">
      <div
        v-for="(emojiRow, rowIndex) in emojiMatrix"
        :key="rowIndex"
        class="msg-face-row"
      >
        <div
          v-for="key in emojiRow"
          :key="key"
          class="msg-face-item"
          @tap.stop="
            () => {
              handleEmojiClick({ key, type: emojiMap[key] });
            }
          "
        >
          <Icon :size="27" :type="emojiMap[key]"></Icon>
        </div>
        <!-- 下面放三个看不到的 Icon 占个位 -->
        <Icon
          v-if="rowIndex + 1 === Math.ceil(emojiArr.length / emojiColNum)"
          class="msg-face-delete"
          :size="20"
          type="icon-tuigejian"
        ></Icon>
        <Icon
          v-if="rowIndex + 1 === Math.ceil(emojiArr.length / emojiColNum)"
          class="msg-face-delete"
          :size="20"
          type="icon-tuigejian"
        ></Icon>
        <Icon
          v-if="rowIndex + 1 === Math.ceil(emojiArr.length / emojiColNum)"
          class="msg-face-delete"
          :size="20"
          type="icon-tuigejian"
        ></Icon>
      </div>
    </div>
    <div class="emoji-block"></div>
    <div class="msg-face-control">
      <div class="msg-delete-btn" @tap="handleEmojiDelete">
        <Icon type="icon-tuigejian" :size="16" :color="'#1CC7BE'" />
      </div>
      <div class="msg-send-btn" @tap="handleEmojiSend">{{ t("sendText") }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { emojiMap } from "@/components/im/utils/emoji";
import { culculateMatrix } from "@/components/im/utils/matrix";
import Icon from "@/components/im/components/Icon.vue";
import { t } from "@/components/im/utils/i18n";
// 七个一行
const emojiArr = Object.keys(emojiMap);
const emojiColNum = 7;
const emojiMatrix = culculateMatrix(emojiArr, emojiColNum);

const emit = defineEmits(["emojiClick", "emojiSend", "emojiDelete"]);

const handleEmojiClick = (emoji: any) => {
  emit("emojiClick", emoji);
};

const handleEmojiDelete = () => {
  emit("emojiDelete");
};

const handleEmojiSend = () => {
  emit("emojiSend");
};
</script>

<style scoped lang="scss">
.msg-face-wrapper {
  box-sizing: border-box;
}

.msg-face-control {
  position: fixed;
  bottom: 8px;
  right: 10px;
  z-index: 8;
}

.emoji-block {
  width: 100%;
  height: 40px;
  background-color: transparent;
}

.msg-face {
  display: flex;
  flex-direction: column;
  margin-bottom: 200rpx;
  // flex-wrap: wrap;

  &-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px 12px;

    &:last-child {
      flex-basis: 57.14%;
    }
  }

  &-item {
    font-size: 27px;
  }

  &-delete {
    font-size: 27px;
    visibility: hidden;
  }
}

.msg-face-control {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.msg-send-btn {
  color: #fff;
  border-radius: 50rpx;
  background-color: #1cc7be;
  font-size: 28rpx;
  height: 60rpx;
  width: 140rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.msg-delete-btn {
  border-radius: 50rpx;
  // background-color: #F4F5F6;
  border: 1rpx solid #000000;
  margin-right: 10px;
  width: 140rpx;
  background: #f4f5f6;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

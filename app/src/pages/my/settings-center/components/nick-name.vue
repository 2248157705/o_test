<template>
  <!-- 修改昵称 -->
  <NickNamePopup
    ref="nickNamePopupRef"
    title="编辑昵称"
    showConfirmButton
    :confirmClose="false"
    :confirmDisabled="nickname ? false : true"
    @confirm="onNickNameConfirm"
  >
    <view class="content">
      <u--textarea
        v-model="nickname"
        class="textarea"
        placeholder="请输入内容"
        count
        height="50"
        maxlength="10"
      ></u--textarea>
      <text class="tip">限2-10个中文、英文或数字</text>
    </view>
  </NickNamePopup>
</template>
<script lang="ts" setup>
import NickNamePopup from "@/components/my-popup/index.vue";
import { ref, watch } from "vue";
import { editPersonalInfo } from "@/api/user";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const nickname = ref(userStore.userInfo?.nickname);

const nickNamePopupRef = ref(null);

const emit = defineEmits("success");
// 昵称修改提交
const onNickNameConfirm = () => {
  const regex = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/; // 匹配2-10个中文、英文或数字
  if (!regex.test(nickname.value)) {
    uni.$u.toast("限2-10个中文、英文或数字");
    return;
  }
  editPersonalInfo({ nickname: nickname.value }).then(() => {
    nickNamePopupRef.value?.close();
    uni.$u.toast("提交成功，等待审核");
    emit("success", nickname.value);
  });
};
watch(
  () => userStore.userInfo?.nickname,
  () => {
    nickname.value = userStore.userInfo?.nickname;
  }
);
const open = () => {
  nickNamePopupRef.value?.open();
};
defineExpose({
  open,
});
</script>
<style lang="scss" scoped>
.content {
  margin-bottom: 20rpx;
  padding: 10rpx;
  @include flex(column);
  .tip {
    margin-top: 16rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #afafaf;
  }
}
// .textarea {
// }
</style>

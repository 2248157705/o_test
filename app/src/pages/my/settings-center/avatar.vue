<template>
  <global-view bgColor="#ffffff" :showBar="false">
    <view class="avatar-nickname-container">
      <view class="avatar">
        <UploadAvatar ref="uploadAvatarRef" :cropper="true"></UploadAvatar>
      </view>
      <u-gap bgColor="#F7F9FA" height="10" />

      <!-- 推荐头像 -->
      <view class="avatar-list">
        <view class="title">推荐头像</view>
        <view class="avater-box">
          <view
            v-for="item in 6"
            :key="item"
            :class="`avatar-item ${select_index == item ? 'avatar-item_active' : ''}`"
            @click="handleAvatarSelected(item)"
          >
            <u--image
              width="192rpx"
              height="192rpx"
              :show-loading="true"
              :src="`https://static-gamehub-client.sh28.vip/assets/avatar/user_avatar_${item}.png`"
            />
            <image
              v-if="select_index == item"
              class="avatar-item_active-icon"
              src="/static/images/common/icon_radio_active.png"
            />
          </view>
        </view>
      </view>
      <my-button
        class="btn"
        height="86"
        size="32"
        radius="2"
        text="确定"
        type="primary"
        @click="handleSubmit"
      />
    </view>
  </global-view>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import UploadAvatar from "@/components/upload/index.vue";
import { editPersonalInfo } from "@/api/user";
import GlobalView from "@/components/global-view/index.vue";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();

const avatar_url = ref("");

const uploadAvatarRef = ref(null);

nextTick(() => {
  avatar_url.value = userStore?.userInfo?.avatar;
  if (avatar_url.value) {
    uploadAvatarRef.value?.setImage(avatar_url.value);
  }
});

const select_index = ref();
const handleAvatarSelected = (index: number) => {
  select_index.value = index;
  const url = `https://static-gamehub-client.sh28.vip/assets/avatar/user_avatar_${index}.png`;
  uploadAvatarRef.value?.setImage(url);
  avatar_url.value = url;
};
const handleSubmit = () => {
  const list = uploadAvatarRef.value?.getUploadResult();
  editPersonalInfo({ avatar: list[0].url }).then(() => {
    uni.$u.toast("提交成功，等待审核");
    userStore.setUserInfo({
      ...userStore.userInfo,
      avatar: list[0].url,
    });
    uni.navigateBack();
  });
};
</script>

<style lang="scss" scoped>
:deep(.u-upload__button),
:deep(.u-upload__wrap__preview) {
  border-radius: 500rpx !important;
}
:deep(.u-upload__button__text) {
  font-weight: 500;
  font-size: 28rpx;
  color: #afafaf;
}
:deep(.u-icon__icon) {
  font-size: 100rpx !important;
  margin-bottom: 10rpx;
}
.avatar-nickname-container {
  .avatar {
    height: 352rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar-list {
    padding: 40rpx 24rpx;

    .title {
      font-weight: 600;
      font-size: 32rpx;
      color: #1a1a1a;
      margin-bottom: 40rpx;
    }
    .avater-box {
      @include flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 0 24rpx;

      .avatar-item {
        position: relative;
        margin-bottom: 56rpx;
        border: 4rpx solid #ffffff;

        &_active {
          border: 4rpx solid $app-main-color;
          border-radius: 200rpx;
        }
        &_active-icon {
          position: absolute;
          top: 15rpx;
          right: 2rpx;
          width: 40rpx;
          height: 40rpx;
        }
      }
    }
  }
  .btn {
    margin: 0 24rpx;
  }
}
</style>

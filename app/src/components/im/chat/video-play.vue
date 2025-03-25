<template>
  <div class="video-wrapper">
    <div class="video-box">
      <video
        v-if="show"
        id="videoEle"
        class="video"
        :src="videoUrl"
        controls
        autoplay
      ></video>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onLoad, onReady } from "@dcloudio/uni-app";
import { ref } from "vue";
const videoUrl = ref();
const show = ref(false);
onLoad((option: any) => {
  videoUrl.value = decodeURIComponent(option.videoUrl);
  show.value = true;
});

onReady(() => {
  show.value = true;
});
</script>
<style lang="scss" scoped>
.video-wrapper {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background: #000000;
  display: flex;
  flex-direction: column;
}

.video-box {
  width: 100vw;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .video {
    width: 100%;
    height: 95%;
  }
}
</style>

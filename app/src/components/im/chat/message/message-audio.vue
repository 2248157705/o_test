<template>
  <div
    :class="msg.flow === 'in' ? 'audio-in' : 'audio-out'"
    :style="{ width: audioContainerWidth + 'px' }"
    @tap="playAudio"
  >
    <div>{{ duration }}s</div>
    <div class="audio-icon-wrapper">
      <Icon :key="audioIconType" :size="24" :type="audioIconType" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, computed } from "@/components/im/utils/transformVue";
import { pauseAndDestroyAudio } from "@/components/im/utils";
import Icon from "@/components/im/components/Icon.vue";
const props = defineProps({
  msg: {
    type: Object,
    default: () => ({
      idClient: undefined,
      body: undefined,
      attach: {
        type: undefined,
        value: undefined,
        url: undefined,
        canEdit: false,
        canRecall: false,
      },
    }),
    required: true,
  },
});

const audioIconType = ref("icon-yuyin3");
const animationFlag = ref(false);
const audioContextInstance = ref(null);

// 格式化音频时长
const formatDuration = (duration: number) => {
  return Math.round(duration / 1000) || 1;
};

const audioContainerWidth = computed(() => {
  const duration = formatDuration(props?.msg?.attach?.dur);
  const maxWidth = 180;
  return 50 + 8 * (duration - 1) > maxWidth
    ? maxWidth
    : 50 + 8 * (duration - 1);
});

const duration = computed(() => {
  return formatDuration(props?.msg?.attach?.dur);
});

const playAudio = async () => {
  console.log("playAudio");
  // 播放音频前停止所有视播放
  await pauseAndDestroyAudio();
  // animationFlag.value = false

  const innerAudioContext = uni.createInnerAudioContext();

  audioContextInstance.value = innerAudioContext;

  uni.$currentAudioContext = innerAudioContext;

  innerAudioContext.src = props?.msg?.attach?.url;
  innerAudioContext.play();
  innerAudioContext.onPlay(() => {
    console.log("onPlay");
    playAudioAnimation();
  });
  // 音频自然播放结束事件
  innerAudioContext.onEnded(() => {
    console.log("onEnded");
    animationFlag.value = false;

    uni.$currentAudioContext?.destroy();
    console.log("innerAudioContext destroy");

    uni.$currentAudioContext = null;
  });
  // 音频自然播放结束事件
  innerAudioContext.onStop(() => {
    console.log("onStop");
    animationFlag.value = false;
  });

  innerAudioContext.onPause((res: any) => {
    console.log("onPause", res);
    animationFlag.value = false;
  });
};

// 播放音频动画
const playAudioAnimation = () => {
  try {
    animationFlag.value = true;
    let audioIcons = ["icon-yuyin1", "icon-yuyin2", "icon-yuyin3"];
    const handler = () => {
      const icon = audioIcons.shift();
      if (icon) {
        audioIconType.value = icon;
        if (!audioIcons.length && animationFlag.value) {
          audioIcons = ["icon-yuyin1", "icon-yuyin2", "icon-yuyin3"];
        }
        if (audioIcons.length) {
          setTimeout(handler, 300);
        }
      }
    };
    handler();
  } catch (error) {
    console.log("playAudioAnimation error", error);
  }
};

onUnmounted(() => {
  // 取消监听;
  audioContextInstance.value?.offStop();
  // 取消监听;
  audioContextInstance.value?.offEnded();
  pauseAndDestroyAudio();
});
</script>

<style scoped lang="scss">
.audio-in,
.audio-out {
  width: 50px;
  display: flex;
  cursor: pointer;
  justify-content: flex-end;
  align-items: center;
}

.audio-in {
  flex-direction: row-reverse;

  .audio-icon-wrapper {
    transform: rotate(180deg);
  }
}
</style>

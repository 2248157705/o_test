<template>
  <view v-if="labelItems.length > 0" class="selling-point-box">
    <view class="head">
      <u--image
        class="img"
        src="/static/images/sell/icon_selling_point.png"
        width="200rpx"
        height="84rpx"
      />
      <u--image
        class="img"
        src="/static/images/sell/icon_selling_point_star.png"
        width="114rpx"
        height="84rpx"
      />
    </view>
    <view class="main">
      <scroll-view :scroll-x="true" class="scroll-view">
        <view class="label-items">
          <view class="count">
            <text class="text">x{{ labelItems.length }}</text>
          </view>
          <view v-for="item in labelItems" :key="item" class="item">
            <text class="text">{{ item }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useGameStore } from "@/stores/game";
import { parseGoodsInfo } from "@/gameData";

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
});

const gameStore = useGameStore();
const dotList = ref([]);

onMounted(() => {
  const { product } = props;
  if (!gameStore.gameDetail[product.game_id]) {
    gameStore.assembleGameForm(product.game_id);
  }
});

const labelItems = computed(() => {
  return dotList.value.slice(0, 20);
});

const setDot = () => {
  const { product } = props;
  const parse = parseGoodsInfo(
    product.goods_info,
    gameStore.gameDetail[product.game_id]?.gameFormData
  );
  const gameData = parse.filter((item) => item.type == "checkbox");
  let arr = [];
  gameData.forEach((el) => {
    arr = [...arr, ...el.value];
  });
  dotList.value = arr;
};
setDot();
</script>

<style lang="scss" scoped>
.selling-point-box {
  margin-bottom: 16rpx;
  background: linear-gradient(180deg, #fff4d7 0%, #ffffff 60%, #ffffff 100%);
  border-radius: 12rpx;
  border: 2rpx solid #fff5e5;

  .head {
    @include flex(row);
    justify-content: space-between;
  }

  .main {
    padding: 24rpx 0;
    padding-top: 0rpx;

    .label-items {
      width: 1200rpx;
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .count {
        margin: 0rpx 12rpx;
        .text {
          font-family: Barlow-ExtraBold;
          font-weight: bold;
          font-size: 48rpx;
          color: #f93531;
        }
      }

      .item {
        margin: 12rpx 12rpx;
        padding: 4rpx 12rpx;
        border-radius: 8rpx;
        border: 2rpx solid #f93531;

        .text {
          font-weight: 500;
          font-size: 28rpx;
          color: #f93531;
        }
      }
    }
  }
}
</style>

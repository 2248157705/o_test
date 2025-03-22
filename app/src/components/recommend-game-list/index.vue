<template>
  <view class="list-container">
    <view id="searchRef" ref="searchRef" class="search">
      <slot name="nav"></slot>
      <Search
        :disabled="false"
        :searchVal="searchKey"
        :searchBoxStyle="{
          padding: title ? '0 0 24rpx 0' : '24rpx 0',
        }"
        :searchBtnStyle="{
          backgroundColor: searchColor,
        }"
        :borderColor="searchColor"
        @search="handleSearch"
      />
    </view>
    <view class="index-list-container">
      <scroll-view
        class="container"
        :show-scrollbar="false"
        scroll-y
        :style="`height: ${canDetect ? '1100rpx' : screenHeight + 'px'}`"
      >
        <image
          v-if="ProductTypeEnum.VALUATION == type - 0"
          style="height: 72rpx; margin: 20rpx 0"
          src="/static/images/common/valuation_game.png"
        />
        <image
          v-if="ProductTypeEnum.RECYCLE == type - 0"
          style="height: 72rpx; margin: 20rpx 0"
          src="/static/images/common/recycle_game.png"
        />
        <view
          class="container-list"
          :style="{
            padding: canDetect ? 0 : '0 36rpx',
          }"
        >
          <template v-for="(item, index) in list" :key="index">
            <view
              class="list"
              :class="{
                end: (index + 1) % 4 == 0,
              }"
              @tap="handleSelect(item)"
            >
              <image class="list__item__avatar" :src="item.icon" :webp="true" />
              <view class="list__item__game-name">
                <text class="text">{{ filterName(item.game_name) }}</text>
              </view>
            </view>
          </template>
        </view>
        <template v-if="!list.length">
          <view class="lack-view">
            <image class="image" src="/static/images/empty/icon_default.png" />
            <text class="text">暂无数据</text>
          </view>
        </template>
        <template v-else>
          <view class="more-text">
            <text class="text">更多游戏，陆续开放中...</text>
          </view>
        </template>
      </scroll-view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import Search from "@/components/search/index.vue";
import { computed, ref, nextTick } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getGameList } from "@/api/game";
import { ProductTypeEnum } from "@/enums/product";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
  canDetect: {
    type: Number,
    default: 0,
  },
  searchColor: {
    type: String,
    default: "#1CC7BE",
  },
});

const screenHeight = ref(uni.getSystemInfoSync().windowHeight);
const searchKey = ref("");
const list = ref([]);

const queryParams = computed(() => {
  const param = {
    game_name: searchKey.value,
    can_detect: props.canDetect,
  };
  if (ProductTypeEnum.VALUATION == props.type) {
    param.can_estimate = 1;
  }
  if (ProductTypeEnum.RECYCLE == props.type) {
    param.can_recycle = 1;
  }
  return param;
});
const handleSearch = (search) => {
  searchKey.value = search;
  handleGetList(queryParams.value);
};

const handleGetList = async (params) => {
  const { data, total } = await getGameList({
    ...params,
    showLoading: true,
  });
  list.value = data;
  console.log(data, total);
};

const filterName = (name) => {
  // if (/^[a-zA-Z0-9]+$/.test(name)) {
  //   if (name.length > 6) {
  //     return name.slice(0, 5) + "...";
  //   } else {
  //     return name;
  //   }
  // }
  // if (name.length > 4) {
  //   return name.slice(0, 3) + "...";
  // } else {
  //   return name;
  // }
  return name;
};

const emit = defineEmits(["handleSelect"]);
const handleSelect = (item: GameItem) => {
  userStore.setGameHistory(item);
  emit("handleSelect", item);
};

onLoad(() => {
  handleGetList(queryParams.value);
  nextTick(() => {
    // #ifdef H5
    const query = uni.createSelectorQuery().in(this);
    query.select("#searchRef").boundingClientRect((data) => {
      if (data && data.height) {
        screenHeight.value = screenHeight.value - data.height;
        console.log(data.height);
      }
    });
    query.exec();
    // #endif

    // #ifdef APP-NVUE
    const dom = weex.requireModule("dom");

    dom.getComponentRect(searchRef.value, (option) => {
      if (option && option.result) {
        if (option && option.size.height) {
          screenHeight.value = screenHeight.value - option.size.height;
        }
      }
    });
    // #endif
  });
});
</script>

<style lang="scss" scoped>
.z-tabs-box {
  overflow: hidden;
  border-top-left-radius: 12rpx;
  border-top-right-radius: 12rpx;
  padding-top: 24rpx;
  height: 120rpx;
}

.search {
  padding: 0 24rpx;
}

.list-container {
  padding-top: 24rpx;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.lack-view {
  flex: 1;
  display: flex;
  align-items: center;

  .text {
    font-weight: 400;
    font-size: 28rpx;
    color: #606060;
  }

  .image {
    width: 520rpx;
    height: 350rpx;
  }
}

.more-text {
  display: flex;
  margin: 24rpx;
  align-items: center;
  justify-content: center;

  .text {
    font-weight: 400;
    font-size: 28rpx;
    color: #afafaf;
  }
}

.index-list-container {
  flex: 1;
  position: relative;
  padding: 0 24rpx;
  display: flex;

  .container {
    background-color: #fff;
    border-radius: 24rpx;

    .container-list {
      @include flex(row);
      flex-wrap: wrap;
      padding: 0 36rpx;

      .list {
        margin-bottom: 48rpx;
        margin-right: 55rpx;

        &.end {
          margin-right: 0;
        }

        &__item {
          @include flex(column);
          align-items: center;

          &__avatar {
            height: 116rpx;
            width: 116rpx;
            border-radius: 24rpx;
          }

          &__game-name {
            margin-top: 10rpx;
            width: 116rpx;
            text-align: center;
            overflow: hidden;
            .text {
              font-weight: 400;
              font-size: 26rpx;
              color: #1a1a1a;
              text-align: center;
              overflow: hidden;
              text-overflow: clip;
              lines: 1;
            }
          }
        }
      }
    }
  }
}
</style>

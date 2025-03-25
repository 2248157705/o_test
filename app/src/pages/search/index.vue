<template>
  <global-view bgColor="linear-gradient(to bottom, #ffffff, #FAFBFE)">
    <template #bar>
      <u-status-bar />
      <view class="search-content-view">
        <view class="search">
          <view class="left" @tap="handleBack">
            <u--image
              width="48rpx"
              height="48rpx"
              src="/static/images/common/icon_left.png"
            />
          </view>
          <search
            :searchVal="searchVal"
            :searchBoxStyle="searchBoxStyle"
            :disabled="false"
            @search="handleSearch"
          />
        </view>
      </view>
    </template>
    <view v-if="searchStore.searchHistory.length" class="record-view">
      <view class="filter-box">
        <view class="sort feature">
          <text class="text">历史搜索</text>
        </view>
        <view class="filter feature" @tap="handleDel">
          <u--image
            width="28rpx"
            height="28rpx"
            class="icon"
            src="/static/images/common/icon_delete.png"
          />
          <text class="text">清空记录</text>
        </view>
      </view>
      <view class="record-box">
        <template
          v-for="(item, index) in searchStore.searchHistory"
          :key="index"
        >
          <view class="item-box" @tap="handleSearch(item)">
            <text class="text">{{ item }}</text>
          </view>
        </template>
      </view>
    </view>
    <view class="record-view">
      <view class="filter-box">
        <view class="sort feature">
          <text class="text">推荐搜索</text>
        </view>
      </view>
      <view class="record-box">
        <template v-for="(item, index) in recommendKeys" :key="index">
          <view
            class="list"
            :class="{
              end: (index + 1) % 5 == 0,
            }"
          >
            <view class="list__item" @tap="handleGameProduct(item)">
              <image class="list__item__avatar" :src="item.icon"></image>

              <view class="list__item__game-name">
                <u--text
                  size="12"
                  color="#1A1A1A"
                  :lines="1"
                  :block="false"
                  :text="item.game_name"
                ></u--text>
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>
  </global-view>
</template>

<script setup>
import { ref } from "vue";
import GlobalView from "@/components/global-view/index.vue";
import Search from "@/components/search/index.vue";
import { useSearchStore } from "@/stores/search";
// import { useGameStore } from "@/stores/game";
import { onLoad } from "@dcloudio/uni-app";
import { generateSearchRecommendKey } from "@/api/product";
import { getGameList } from "@/api/game";
import { filter, some } from "lodash-es";
const searchVal = ref(null);
const searchStore = useSearchStore();
// const gameStore = useGameStore();

const handleBack = () => {
  uni.navigateBack();
};
const searchBoxStyle = ref({
  padding: 0,
});
const handleSearch = (value) => {
  if (!value) return;
  searchStore.setSearchHistory(value);
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 2];
  const url = currentPage.route;
  if (["pages/home/index", "pages/buy-account/index"].includes(url)) {
    uni.redirectTo({ url: `/pages/goods/list?searchKey=${value}` });
  } else {
    uni.setStorageSync("searchKey", value);
    uni.navigateBack();
  }
};

const recommendKeys = ref([]);

const handleGameProduct = (item) => {
  searchStore.setSearchHistory(item.game_name);
  uni.navigateTo({
    url: `/pages/goods/list?id=${item.id}`,
  });
};

onLoad(async (params) => {
  if (params.keyword) {
    searchVal.value = params.keyword;
    const keyword = params.keyword.split("、");
    if (keyword.length == 1) {
      handleSearch(keyword[0]);
      return;
    }
    const { data } = await getGameList();
    recommendKeys.value = filter(data, (item) =>
      some(keyword, (keyword) => item.game_name.includes(keyword))
    );
  } else {
    const { data } = await generateSearchRecommendKey();
    recommendKeys.value = data;
  }
});

const handleDel = () => {
  uni.$main.toast("删除成功");
  searchStore.delSearchHistory();
};
</script>

<style lang="scss" scoped>
.search-content-view {
  @include flex(column);
  padding: 24rpx;
  flex: 1;
  .search {
    flex: 1;
    @include flex(row);
    align-items: center;
    /* justify-content: center; */
    position: relative;
    .left {
      margin-right: 24rpx;
    }
  }
}
.record-view {
  flex: 1;
  @include flex(column);
  margin-top: 24rpx;
  margin-bottom: 36rpx;
  align-items: center;
  .filter-box {
    @include flex(row);
    justify-content: space-between;
    align-items: center;
    margin-top: 24rpx;
    width: 702rpx;
    .feature {
      @include flex(row);
      align-items: center;
      justify-content: center;
      .text {
        font-weight: 600;
        font-size: 28rpx;
      }
    }
    .sort {
      .text {
        color: #1a1a1a;
        margin-right: 8rpx;
      }
    }
    .filter {
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        margin-top: -5rpx;
      }
      .text {
        color: #606060;
        margin-left: 8rpx;
      }
    }
  }
  .record-box {
    @include flex(row);
    width: 702rpx;
    margin-top: 24rpx;
    flex-flow: wrap;
    .item-box {
      flex-shrink: 0; // 项目不缩小
      padding: 12rpx 32rpx;
      margin-right: 16rpx;
      margin-bottom: 16rpx;
      background-color: #f4f5f6;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border-radius: $app-box-radius;
      .text {
        font-weight: 400;
        font-size: 22rpx;
        color: #606060;
      }
    }
  }

  .list {
    $iconSize: 116rpx;
    display: flex;
    width: $iconSize;
    margin-right: 30rpx;
    &.end {
      margin-right: 0;
    }

    &__item {
      @include flex(column);
      align-items: center;
      margin-bottom: 30rpx;

      &__avatar {
        height: $iconSize;
        width: $iconSize;
        border-radius: 28rpx;
      }

      &__game-name {
        font-size: 26rpx;
        margin-top: 10rpx;
        padding: 0 4rpx;
        color: $u-main-color;
        text-align: center;
      }
    }
  }
}
</style>

<template>
  <view class="list-container">
    <view class="search" ref="searchRef">
      <slot name="nav"></slot>
      <Search
        :disabled="false"
        :searchVal="searchKey"
        @search="handleSearch"
        :searchBoxStyle="{
          padding: props.title ? '0 0 24rpx 0' : '24rpx 0',
        }"
        :searchBtnStyle="{
          backgroundColor: searchColor,
        }"
        :borderColor="searchColor"
      />
    </view>
    <view class="index-list-container">
      <scroll-view
        :show-scrollbar="false"
        scroll-y
        :scroll-top="scrollViewTop"
        @scroll="scrollHandler"
        @scrolltolower="handleRefresh"
        style="display: flex"
      >
        <view
          class="u-index-header"
          v-if="userStore.gameHistory.length && props.type != 'popup'"
        >
          <view class="record-box">
            <view class="record-operation">
              <text class="title">最近浏览</text>
              <view class="operation" @tap="handleEmptyRecord">
                <text class="text">清空记录</text>
              </view>
            </view>
            <scroll-view
              :show-scrollbar="false"
              scroll-x="true"
              class="record-list"
            >
              <template
                v-for="(item, index) in userStore.gameHistory"
                :key="index"
              >
                <view
                  :class="{
                    end: index == userStore.gameHistory.length - 1,
                  }"
                  class="list__item"
                  @tap="handleSelect(item)"
                >
                  <image
                    :src="item.icon"
                    :fade-show="false"
                    :webp="true"
                    style="width: 116rpx; height: 116rpx; border-radius: 24rpx"
                  ></image>
                  <view class="list__item__game-name">
                    <text class="text">{{ filterName(item.game_name) }}</text>
                  </view>
                </view>
              </template>
            </scroll-view>
          </view>
        </view>

        <view class="z-tabs-box" v-if="props.type != 'popup'">
          <z-tabs
            ref="tabs"
            barWidth="76rpx"
            barHeight="8rpx"
            :inactiveStyle="inactiveStyle"
            :tabsStyle="tabsStyle"
            :activeStyle="activeStyle"
            :barStyle="barStyle"
            :list="data.list"
            :current="data.current"
            @change="handleTabChange"
          />
        </view>

        <div>
          <template v-for="(item, index) in itemArr" :key="index">
            <view
              :ref="(el) => (anchorRefs[indexList[index]] = el)"
              :style="`height: ${index == 0 ? '64' : '38'}`"
              class="u-index-anchor"
              v-if="item.length"
              ><text class="u-index-anchor__text">{{ indexList[index] }}</text>
            </view>
            <view class="u-index-item" ref="indexItemRef">
              <view
                class="list"
                v-for="(item1, index1) in item"
                :key="index1"
                :class="{
                  end: (index1 + 1) % 4 == 0,
                }"
                @tap="handleSelect(item1)"
              >
                <!-- <view class="list__item" > -->
                <image
                  style="width: 116rpx; height: 116rpx; border-radius: 24rpx"
                  class="list__item__avatar"
                  :src="item1.icon"
                  :webp="true"
                />
                <view class="list__item__game-name">
                  <text class="text">{{ filterName(item1.game_name) }}</text>
                </view>
              </view>
              <!-- </view> -->
            </view>
          </template>
          <template v-if="result && showList">
            <view class="lack-view">
              <image
                class="image"
                src="/static/images/empty/icon_default.png"
              />
              <text class="text">暂无数据</text>
            </view>
          </template>
        </div>
      </scroll-view>

      <view
        v-if="showList"
        class="u-index-list__letter"
        ref="letter"
        :style="{
          top: letterTop,
        }"
        @touchstart.prevent="touchStart"
        @touchmove.prevent="touchMove"
        @touchend.prevent="touchEnd"
        @touchcancel.prevent="touchEnd"
      >
        <view
          class="u-index-list__letter__item"
          v-for="(item, index) in indexList"
          :key="index"
          :style="{
            backgroundColor:
              activeIndex === index ? activeColor : 'transparent',
          }"
        >
          <text
            class="u-index-list__letter__item__index"
            :style="{ color: activeIndex === index ? '#fff' : inactiveColor }"
            >{{ item }}</text
          >
        </view>
      </view>
      <u-transition
        mode="fade"
        :show="touching"
        :customStyle="{
          position: 'fixed',
          right: '40px',
          top: indicatorTop + 'px',
          zIndex: 2,
        }"
      >
        <view
          class="u-index-list__indicator"
          :class="['u-index-list__indicator--show']"
        >
          <text class="u-index-list__indicator__text">{{
            indexList[activeIndex]
          }}</text>
        </view>
      </u-transition>
    </view>
  </view>
</template>
<script lang="ts" setup>
import IndexList from "./index-list.vue";
import Search from "@/components/search/index.vue";
import GlobalView from "@/components/global-view/index.vue";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { computed, reactive, onCreated, ref, nextTick } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useGameStore } from "@/stores/game";
import { GameItem } from "@/types/store";
import { useUserStore } from "@/stores/user";
import { getGameCategory, getGameList } from "@/api/game";
import pinyin from "pinyin";
import { filter, every, uniq } from "lodash-es";
import { inactiveStyle, activeStyle, barStyle } from "@/utils/operation-style";
import { ProductTypeEnum } from "@/enums/product";
const gameStore = useGameStore();
const userStore = useUserStore();
const showList = ref(false);
const searchRef = ref(null);
const data = reactive({
  current: 0,
  list: [],
});

const tabsStyle = reactive({
  width: "662rpx",
  backgroundColor: "rgba(0,0,0,0)",
});

let letterInfo = reactive({
  height: 0,
  itemHeight: 0,
  top: 0,
});
const indexLists = () => {
  const indexList = [];
  const charCodeOfA = "A".charCodeAt(0);
  indexList.push("全");

  for (let i = 0; i < 26; i++) {
    indexList.push(String.fromCharCode(charCodeOfA + i));
  }
  return indexList;
};
const indexList = ref(indexLists());
const itemArr = ref([]);
const gameList = ref([]);
const anchorRefs = ref({});
const children = ref([]);
const indexItemRef = ref(null);
const indexItemTop = ref(0);
const searchKey = ref(null);
const activeIndex = ref(-1);
const activeItem = ref("全");
const activeColor = ref("#1CC7BE");
const inactiveColor = ref("#606266");
const dom = uni.requireNativePlugin("dom");
const indicatorHeight = ref(0);
const touching = ref(false);
const scrolling = ref(false);
const perPage = ref(30);
const totalCount = ref(0);
const scrollViewTop = ref(0);
const scrollViewOldTop = ref(0);

const letter = ref(null);
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
  searchColor: {
    type: String,
    default: "#1CC7BE",
  },
  enterType: {
    type: String,
    default: "",
  },
});

const letterTop = computed(() => {
  if (props.type == "popup") {
    console.log(
      uni.getSystemInfoSync().windowHeight,
      "uni.getSystemInfoSync().windowHeight"
    );
    if (uni.getSystemInfoSync().windowHeight > 720) {
      return "540rpx";
    }
    return "320rpx";
  }
  return "320rpx";
});

const filterName = (name) => {
  return name;
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
  // return name;
};

const handleGetList = async (
  category_id,
  game_name,
  per_page = 30,
  initial_key
) => {
  // if (itemArr.value.length == indexList.value.length) return;
  const { data, total } = await getGameList({
    category_id,
    game_name,
    per_page,
    is_group: 1,
    can_detect: props.enterType == ProductTypeEnum.VALUATION ? 1 : 0,
    initial_key,
    showLoading: true,
  });
  totalCount.value = total;
  itemArr.value = indexList.value.map((item, i) => {
    let list = [];
    for (let j = 0; j < data.length; j++) {
      if (data[j].initial_key == item) {
        list.push(data[j]);
      }
    }
    return list;
  });
  nextTick(() => {
    showList.value = true;
    setTimeout(() => {
      setIndexListLetterInfo();
    }, 1000);
  });
};
onLoad(async () => {
  const list = await getGameList({
    game_ids_in: userStore.gameHistory.map((r) => r.id),
  });
  const recordList = userStore.gameHistory.filter((item1) =>
    list.data
      .filter((item) => item.status)
      .find((item2) => item2.id === item1.id)
  );
  userStore.setGameHistory(recordList);
  if (props.type != "popup") {
    getGameCategory().then((res) => {
      try {
        data.list = res.map((item) => {
          return { id: item.id, name: item.category_name };
        });
        data.list.unshift({ id: 0, name: "全部" });
      } catch (error) {
        uni.log.info(error);
      }
    });
  }
  handleGetList();
});

const indicatorTop = computed(() => {
  const { top, itemHeight } = letterInfo;
  return (
    Math.floor(itemHeight * activeIndex.value) +
    uni.$u.getPx(letterTop.value) -
    itemHeight
  );
});

const emit = defineEmits(["handleSelect"]);
const handleSelect = (item: GameItem) => {
  userStore.setGameHistory(item);
  emit("handleSelect", item);
};
const handleEmptyRecord = () => {
  userStore.setGameHistory([]);
};

const handleTabChange = (val) => {
  if (val == 0) perPage.value = 30;
  data.current = val;
  handleGetList(
    data.list[val].id,
    searchKey.value,
    perPage.value,
    activeItem.value == "全" ? null : [activeItem.value]
  );
};

const handleSearch = (search) => {
  searchKey.value = search;
  handleGetList(
    data.list.length ? data.list[data.current].id : 0,
    searchKey.value,
    perPage.value,
    activeItem.value == "全" ? null : activeItem.value
  );
};

// 获取索引列表的尺寸以及单个字符的尺寸信息
const getIndexListLetterRect = () => {
  return new Promise((resolve) => {
    dom.getComponentRect(letter.value, (res) => {
      resolve(res.size);
    });
  });
};
const getIndexItemRect = () => {
  return new Promise((resolve) => {
    dom.getComponentRect(indexItemRef.value, (res) => {
      resolve(res.size);
    });
  });
};

const handleRefresh = () => {
  if (touching.value || activeItem.value != "全") return;
  perPage.value = perPage.value + 60;
  handleGetList(data.list[data.current]?.id, searchKey.value, perPage.value);
};

const getItemRect = (i) => {
  let height = uni.getSystemInfoSync().windowHeight;
  dom.getComponentRect(searchRef.value, (res) => {
    if (res.size) {
      height = height + res.size.height;
    }
  });
  for (const i in anchorRefs.value) {
    dom.getComponentRect(anchorRefs.value[i], (res) => {
      if (res.size) {
        children.value.push({
          key: i,
          height: res.size.height,
          top: props.type == "popup" ? res.size.top - height : res.size.top,
        });
      }
    });
  }
};
// 获取当前被触摸的索引字母
const getIndexListLetter = (pageY) => {
  // console.log(pageY);
  const { top, height, itemHeight } = letterInfo;
  pageY += top;
  if (pageY < top) {
    return 0;
  } else if (pageY >= top + height) {
    // 如果超出了，取最后一个字母
    return indexList.value.length - 1;
  } else {
    // 将触摸点的Y轴偏移值，减去索引字母的top值，除以每个字母的高度，即可得到当前触摸点落在哪个字母上
    return Math.floor((pageY - top) / itemHeight);
  }
};

// 设置indexList索引的尺寸信息
const setIndexListLetterInfo = () => {
  getIndexListLetterRect().then((size) => {
    const { height } = size;
    const sys = uni.$u.sys();
    const windowHeight = sys.windowHeight;
    const customNavHeight = uni.$u.getPx(letterTop.value);
    letterInfo = {
      height,
      // 为了让字母列表对屏幕绝对居中，让其对导航栏进行修正，也即往上偏移导航栏的一半高度
      top: (windowHeight - height) / 2 + customNavHeight / 2,
      itemHeight: Math.floor(height / indexList.value.length),
    };
  });
  getItemRect();
};

const scrollHandler = (e) => {
  if (touching.value || scrolling.value) return;
  scrolling.value = true;
  uni.$u.sleep(10).then(() => {
    scrolling.value = false;
  });
  const { itemHeight } = letterInfo;

  let scrollTop = Math.abs(e.detail.scrollTop) + itemHeight * 2;
  // if (props.type == "popup") {
  //   scrollTop = scrollTop + itemHeight;
  // }
  scrollViewOldTop.value = e.detail.scrollTop;
  let nextItem;
  let len = indexList.value.length;
  activeIndex.value = -1;
  // for (let i = 0; i < len; i++) {
  //   const item = children.value[i],
  //     nextItem = children.value[i + 1];
  //   // 如果滚动条高度小于第一个item的top值，此时无需设置任意字母为高亮
  //   if (
  //     scrollTop <= children.value[0]?.top ||
  //     scrollTop >=
  //       children.value[len - 1]?.top + children.value[len - 1]?.height
  //   ) {
  //     activeIndex.value = -1;
  //     console.log("进入1");
  //     break;
  //   } else if (!nextItem) {
  //     // 当不存在下一个item时，意味着历遍到了最后一个
  //     activeIndex.value = len - 1;
  //     console.log("进入2");
  //     break;
  //   } else if (scrollTop > item?.top && scrollTop < nextItem?.top) {
  //     activeIndex.value = i;
  //     console.log("进入3");

  //     break;
  //   }
  // }
};

// 设置各项由触摸而导致变化的值
const setValueForTouch = async (currentIndex) => {
  if (currentIndex === activeIndex.value) return;

  activeIndex.value = currentIndex;
  activeItem.value = indexList.value[currentIndex];
  // const item = indexList.value[currentIndex];
  // if (anchorRefs.value[item].style.height <= 0) {
  //   console.log(anchorRefs.value[item].style.height);
  //   await handleGetList(data.list[data.current]?.id, searchKey.value, null, [
  //     item,
  //   ]);
  // }
  // nextTick(() => {
  //   dom.scrollToElement(anchorRefs.value[item], {
  //     offset: 0,
  //     animated: false,
  //   });
  // });
};
// 索引列表被触摸
const touchStart = (e) => {
  // 获取触摸点信息
  const touchStart = e.changedTouches[0];
  if (!touchStart) return;
  touching.value = true;
  const { pageY } = touchStart;
  // 根据当前触摸点的坐标，获取当前触摸的为第几个字母
  const currentIndex = getIndexListLetter(pageY);
  setValueForTouch(currentIndex);
};
// 索引字母列表被触摸滑动中
const touchMove = (e) => {
  // 获取触摸点信息
  let touchMove = e.changedTouches[0];
  if (!touchMove) return;
  if (!touching.value) {
    touching.value = true;
  }

  const { pageY } = touchMove;
  const currentIndex = getIndexListLetter(pageY);
  setValueForTouch(currentIndex);
};

// 触摸结束
const touchEnd = (e) => {
  uni.$u.sleep(100).then(() => {
    touching.value = false;
    const item = indexList.value[activeIndex.value];
    scrollViewTop.value = scrollViewOldTop.value;

    nextTick(() => {
      scrollViewTop.value = 0;
    });
    if (item == "全") {
      perPage.value = 30;
      handleGetList(data.list[data.current]?.id, searchKey.value);
    } else {
      handleGetList(data.list[data.current]?.id, searchKey.value, null, [item]);
    }
  });
};

const result = computed(() => {
  if (!itemArr.value.length) return true;
  return every(itemArr.value, (subArray) => subArray.length === 0);
});
</script>

<style lang="scss" scoped>
.u-index-list {
  &__letter {
    position: fixed;
    top: 320rpx;
    right: 32rpx;
    text-align: center;
    z-index: 3;
    border-radius: 148rpx;

    &__item {
      width: 16px;
      height: 16px;
      border-radius: 100px;
      margin: 1px 0;
      @include flex;
      align-items: center;
      justify-content: center;

      &--active {
        background-color: $app-main-color;
      }

      &__index {
        font-size: 12px;
        text-align: center;
        line-height: 12px;
      }
    }
  }

  &__indicator {
    width: 25px;
    height: 25px;
    border-radius: 50px 50px 0 50px;
    text-align: center;
    color: #ffffff;
    background-color: #1cc7be;
    @include flex;
    justify-content: center;
    align-items: center;

    &__text {
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      text-align: center;
    }
  }
}
.u-index-anchor {
  /* position: sticky;
  top: 0; */
  @include flex;
  align-items: center;
  z-index: 1;
  padding-left: 24rpx;
  /* background-color: #fff; */

  &__text {
    @include flex;
    align-items: center;
    font-weight: 400;
  }
}
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
  flex: 1;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  /* align-items: center; */
}

// .list__item__game-name {
//   .text {
//     width: 116rpx;
//     height: 50rpx;
//     text-align: center;
//     white-space: nowrap;
//     word-wrap: normal;
//     overflow: hidden;
//   }
// }

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
.index-list-container {
  $iconSize: 116rpx;
  flex: 1;
  position: relative;
  .u-index-item {
    @include flex(row);
    flex-wrap: wrap;
    padding: 0 24rpx;
    /* background-color: #fff; */
  }
  .u-index-header {
    @include flex(column);
    /* flex: 1; */
    /* justify-content: center; */
    /* background: linear-gradient(to bottom, #fff9f1, #ffffff); */
    padding: 0 24rpx;
    .record-box {
      border-radius: 12rpx;
      padding-bottom: 24rpx;
      .record-operation {
        @include flex(row);
        width: 678rpx;
        margin-bottom: 22rpx;
        justify-content: space-between;
        .title {
          color: #1a1a1a;
          font-weight: 600;
          font-size: 32rpx;
        }
        .operation {
          @include flex(row);
          align-items: center;
          justify-content: center;

          .text {
            font-weight: 400;
            color: #afafaf;
            font-size: 24rpx;
          }
        }
      }
      .record-list {
        @include flex(row);
        width: 630rpx;
        .list__item {
          margin-right: 44rpx;
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
  .list {
    display: flex;
    width: $iconSize;
    margin-bottom: 24rpx;
    margin-right: 44rpx;
    &.end {
      margin-right: 0;
    }
    &__item {
      @include flex(column);
      align-items: center;

      &__avatar {
        height: $iconSize;
        width: $iconSize;
        border-radius: 30rpx;
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

    &__footer {
      color: $u-tips-color;
      font-size: 14px;
      text-align: center;
      margin: 15px 0;
    }
  }
}
</style>

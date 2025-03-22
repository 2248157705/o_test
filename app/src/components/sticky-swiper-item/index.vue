<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
  <view class="content">
    <!-- :auto="false" 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
    <!-- :fixed="false" 设置z-paging不铺满全屏，使用局部滚动-->
    <!-- :auto-clean-list-when-reload="false" reload时不自动清空list，用于页面中父组件触发此组件reload方法时，不清空原list-->
    <z-paging
      class="list"
      ref="paging"
      v-model="dataList"
      @query="handleQueryList"
      @emptyViewReload="handleEmptyViewReload"
      :showLoadingMoreNoMore="true"
      :show-scrollbar="false"
      :fixed="false"
      :auto="false"
      :auto-clean-list-when-reload="false"
      :scroll-to-bottom-bounce-enabled="false"
      :show-loading-more-no-more-line="false"
      :loading-more-title-custom-style="customStyle"
      :empty-view-text="emptyText"
      :empty-view-img="emptyImg"
      :empty-view-img-style="emptyImgStyle"
      :empty-view-title-style="emptyTitleStyle"
      :show-empty-view-reload="showEmptyReload"
      :empty-view-reload-text="errBtnText || emptyReloadText"
      :empty-view-reload-style="emptyReloadStyle"
      :empty-view-super-style="emptySuperStyle"
      :empty-view-error-img="emptyErrorImg"
      :empty-view-error-text="emptyErrorText"
      :minDelay="0"
    >
      <!-- 在nvue中，z-paging中插入的列表item必须是cell，必须使用cell包住，因为在nvue中，z-paging使用的是nvue的list组件。 -->
      <!-- 不能使用index作为key的唯一标识，:key必须添加并且必须是唯一的 -->
      <!-- 如果希望在vue中渲染view，nvue中渲染cell，可使用z-paging-cell代替cell -->
      <template #top>
        <slot name="top"></slot>
      </template>

      <template #loadingMoreNoMore>
        <slot v-if="$slots.loadingMoreNoMore" name="loadingMoreNoMore"> </slot>
        <template v-else>
          <template v-if="showLoadingMoreNoMore">
            <bottom-line />
          </template>
          <template v-else>
            <view></view>
          </template>
        </template>
      </template>

      <z-paging-cell
        class="cell-item"
        v-for="(item, index) in dataList"
        :key="item.id || index"
        :style="props.cellStyle"
      >
        <view
          class="cell-row"
          v-if="isArray(item)"
          :style="{
            justifyContent: rowCallCount > 2 ? 'flex-start' : 'space-between',
          }"
        >
          <template v-for="(i, iIndex) in item" :key="i.id || iIndex">
            <slot
              :data="i"
              :num="iIndex"
              :end="iIndex == item.length - 1"
            ></slot>
          </template>
        </view>
        <view v-else class="cell-column">
          <slot
            :data="item"
            :num="index"
            :end="index == dataList.length - 1"
          ></slot>
        </view>
      </z-paging-cell>
    </z-paging>
  </view>
</template>

<script setup>
import { nextTick, ref, watch, reactive } from "vue";
import { get, isArray } from "lodash-es";
import BottomLine from "@/components/bottom-line/index.vue";

const customStyle = reactive({ color: "#1A1A1A", fontSize: "24rpx" });
const props = defineProps({
  rowCallCount: {
    type: Number,
    default: 2,
  },
  tabIndex: {
    type: Number,
    default: 0,
  },
  cellStyle: {
    type: Object,
    default: () => ({}),
  },
  currentIndex: {
    type: Number,
    default: 0,
  },
  direction: {
    type: String,
    default: "column",
  },
  showSlotTop: {
    type: Boolean,
    default: false,
  },
  queryApi: {
    type: Function,
    required: true,
  },
  queryParams: {
    type: Object,
    default: () => ({}),
  },
  path: {
    type: String,
    default: "data",
  },
  pageSizeName: {
    type: String,
    default: "perPage",
  },
  pageNoName: {
    type: String,
    default: "page",
  },
  // 空数据图描述文字
  emptyText: {
    type: String,
    default: "暂无数据",
  },
  //空数据图图片
  emptyImg: {
    type: String,
    default: "/static/images/empty/icon_default.png",
  },
  //失败数据图图片
  emptyErrorImg: {
    type: String,
    default: "/static/images/empty/icon_data_err.png",
  },
  // 是否显示空数据图重新加载按钮(无数据时)
  showEmptyReload: {
    type: Boolean,
    default: false,
  },
  // 是否显示底部图标
  showLoadingMoreNoMore: {
    type: Boolean,
    default: true,
  },
  // 空数据图“加载失败”描述文字
  emptyErrorText: {
    type: String,
    default: "很抱歉，加载失败",
  },
  // 空数据图点击重新加载文字
  emptyReloadText: {
    type: String,
    default: "重新加载",
  },
  // 空数据图父view样式
  emptySuperStyle: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 空数据图img样式
  emptyImgStyle: {
    type: Object,
    default: () => {
      return {
        width: "462rpx",
        height: "332rpx",
      };
    },
  },
  // 空数据图描述文字样式
  emptyTitleStyle: {
    type: Object,
    default: () => {
      return {
        fontWeight: "400",
        fontSize: "28rpx",
        color: "#606060",
      };
    },
  },
  // 数据图重新加载按钮样式
  emptyReloadStyle: {
    type: Object,
    default: () => {
      return {
        width: "288rpx",
        height: "68rpx",
        borderRadius: "4rpx",
        border: "2rpx solid #AFAFAF",
        textAlign: "center",
        lineHeight: "50rpx",
        fontWeight: "400",
        fontSize: "32rpx",
        color: "#606060",
      };
    },
  },
});
const scrollTop = ref(0);

const paging = ref(null);

const dataList = ref([]);
const firstLoaded = ref(false);
const completeFunc = ref(null);

watch(
  () => props.currentIndex,
  (newVal) => {
    if (newVal === props.tabIndex) {
      if (!firstLoaded.value) {
        setTimeout(() => {
          paging.value.reload();
        }, 100);
      }
    }
  },
  {
    immediate: true,
  }
);

const emits = defineEmits(["onEmptyReloadClick"]);

const handleEmptyViewReload = (e) => {
  if (errBtnText.value != "重新加载") {
    //处理自己的业务逻辑
    emits("onEmptyReloadClick", e);
  }
};

const errBtnText = ref(null);

const handleQueryList = (pageNo = 1, pageSize) => {
  const params = {
    [props.pageNoName]: pageNo,
    [props.pageSizeName]: pageSize,
    ...props.queryParams,
  };
  props
    .queryApi(params)
    .then((res) => {
      const { rowCallCount, path, direction } = props;
      let list = get(res, path);
      if (direction == "row") {
        list = list.reduce(function (r, a, i) {
          r[Math.floor(i / rowCallCount)] =
            r[Math.floor(i / rowCallCount)] || [];
          r[Math.floor(i / rowCallCount)].push(a);
          return r;
        }, []);
      }
      errBtnText.value = null;
      // 请求成功，将请求的结果数组传递给z-paging
      //将请求的结果数组传递给z-paging
      paging.value?.complete(list);
      firstLoaded.value = true;
      // 请求结束，调用父组件的下拉刷新结束回调函数，使得父组件中的z-paging下拉刷新结束
      if (completeFunc.value) {
        completeFunc.value();
      }
    })
    .catch((err) => {
      console.log("进入catch", err);
      errBtnText.value = "重新加载";

      // 如果请求失败写paging.value.complete(false);
      // 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
      // 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
      paging.value?.complete(false);
      // 请求结束，调用父组件的下拉刷新结束回调函数，使得父组件中的z-paging下拉刷新结束
      if (completeFunc.value) {
        completeFunc.value();
      }
    });
};

// 父组件下拉刷新了，通知子组件，子组件调用内部z-paging的reload方法，这里的参数func代表下拉刷新结束的回调函数
const reload = (func) => {
  // 先把父组件下拉刷新的回调函数存起来
  completeFunc.value = func;
  // 调用z-paging的reload方法
  paging.value.reload();
};

// 设置嵌套list父容器支持swiper-list吸顶滚动效果
const setSpecialEffects = (height) => {
  uni.log.info(height, "setSpecialEffects");
  paging.value.setSpecialEffects({
    // 这个id就是sticky-swiper-demo-n中设置的nvue-list-id，二者的值必须完全一致！
    id: "z-paging-nlist",
    headerHeight: height,
  });
};

defineExpose({ reload, setSpecialEffects });
</script>

<style scoped>
.content {
  flex: 1;
  display: flex;
  flex-direction: row;
}
.cell-row {
  display: flex;
  flex-direction: row;
  position: relative;
  border-radius: 4rpx;
}
.cell-column {
}
</style>

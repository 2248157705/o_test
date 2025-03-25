import { ref } from "vue";

export function TabsSwiper() {
  const swiperItems = ref([]);

  //页面高度
  const pagePagingRef = ref();
  const pageHeight = ref(0);

  //tabs组件的current值，表示当前活动的tab选项
  const tabsRef = ref();
  const current = ref(0);

  const scrollable = ref(true);
  const headerRef = ref(null);
  const headerHeight = ref(null);

  // #ifdef APP-NVUE
  const dom = weex.requireModule("dom");
  // #endif

  // 获取页面可见高度，除去header以外的高度必须等于页面可见高度！
  // 注意：如果是自定义导航栏通过slot="top"插入的情况，这里的pageHeight.value = uni.getSystemInfoSync().windowHeight - 自定义导航栏高度。底部tabbar亦然
  const getPageHeight = () => {
    if (headerRef.value) {
      dom.getComponentRect(headerRef.value, (option) => {
        if (option && option.result) {
          headerHeight.value = option.size.height;
          pageHeight.value =
            uni.getSystemInfoSync().windowHeight - option.size.height;
        }
      });
    } else {
      pageHeight.value = uni.getSystemInfoSync().windowHeight;
    }
  };

  // swiper change时触发
  const swiperChange = (e) => {
    // #ifndef APP-PLUS || H5 || MP-WEIXIN || MP-QQ
    const tempCurrent = e.target.current || e.detail.current;
    tabsChange(tempCurrent);
    // #endif
  };

  const tabsChange = (index) => {
    current.value = index;
  };

  // swiper滑动中
  const swiperTransition = (e) => {
    tabsRef.value.setDx(e.detail.dx);
  };

  const onRefresh = () => {
    if (
      swiperItems.value[current.value] &&
      swiperItems.value[current.value].reload
    ) {
      // 触发了下拉刷新，通知当前tabIndex对应子组件的下拉刷新
      swiperItems.value[current.value]?.reload(() => {
        // 当当前显示的列表刷新结束，结束当前页面的刷新状态
        pagePagingRef.value.endRefresh();
      });
    }
  };

  const onReload = () => {
    if (
      swiperItems.value[current.value] &&
      swiperItems.value[current.value].reload
    ) {
      swiperItems.value[current.value]?.reload();
    }
  };

  // 子组件设置当前页面的列表是否可以滚动
  const setScrollable = (tempScrollable) => {
    scrollable.value = tempScrollable;
  };

  const scroll = () => {
    scrollable.value = false;
    swiperItems.value[current.value].setScrollable &&
      swiperItems.value[current.value].setScrollable(true);
  };

  // swiper滑动结束
  const swiperAnimationfinish = (e) => {
    current.value = e.detail.current;
    swiperItems.value[current.value].setScrollable &&
      swiperItems.value[current.value].setScrollable(!scrollable.value);
    tabsRef.value.unlockDx();
  };

  return {
    tabsRef,
    headerHeight,
    headerRef,
    pagePagingRef,
    swiperItems,
    pageHeight,
    current,
    scrollable,
    onRefresh,
    setScrollable,
    scroll,
    swiperAnimationfinish,
    tabsChange,
    swiperTransition,
    swiperChange,
    getPageHeight,
    onReload,
  };
}

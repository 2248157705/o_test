<template>
  <view class="fy_dropdown" @tap.stop.prevent="() => {}">
    <view
      :class="['fy_dropdown__menu', borderBottom ? 'fy_border-bottom' : '']"
      id="fy_dropdown__menu"
      :style="{ height: `${height}rpx`, background: backgroundBoxColor }"
    >
      <view class="fy_dropdown__menu_mian">
        <view
          class="fy_dropdown__menu__left"
          :style="{ height: `${height}rpx` }"
        >
          <slot name="left"></slot>
        </view>
        <view
          class="fy_dropdown__menu__center"
          :class="{
            'space-between': spaceBetween,
          }"
        >
          <view
            class="fy_dropdown__menu__item"
            :style="{
              height: `${height}rpx`,
              gap: '12rpx',
              opacity: item.disabled ? 0.5 : 1,
            }"
            v-for="(item, index) in currentMenuList"
            :key="index"
            @tap="handlerMenuClick(index, item.dropdownKey)"
          >
            <view class="fy_flex">
              <template v-if="item.type == 'reset'">
                <view class="fy_dropdown__menu__item__arrow">
                  <image
                    class="fy_dropdown__arrow__icon"
                    style="width: 26rpx; height 40rpx"
                    src="/static/images/sell/icon_rest.png"
                  />
                </view>
              </template>
              <text
                class="fy_dropdown__menu__item__text"
                v-if="item.title"
                :style="{
                  color: index === current ? '#1A1A1A' : '#606060',
                  fontWeight: index === current ? '600' : '400',
                }"
                >{{ item.title }}</text
              >
              <template v-if="item.dropdownKey == 'sort'">
                <view class="fy_dropdown__sort__icons">
                  <view class="arrow-up">
                    <u-icon
                      name="arrow-up"
                      :size="sortIconSize"
                      :bold="true"
                      :color="sort === 'asc' ? '#1CC7BE' : '#cccccc'"
                    />
                  </view>
                  <view class="arrow-down">
                    <u-icon
                      name="arrow-down"
                      :size="sortIconSize"
                      :bold="true"
                      :color="sort === 'desc' ? '#1CC7BE' : '#cccccc'"
                    />
                  </view>
                </view>
              </template>
              <template v-else-if="item.dropdownKey == 'filter'">
                <view class="fy_dropdown__filter__icons">
                  <image
                    class="filter-icon"
                    src="/static/images/sell/icon_filter.png"
                  />
                </view>
              </template>
              <template v-else-if="item.type == 'reset'"></template>
              <template v-else>
                <view
                  class="fy_dropdown__menu__item__arrow"
                  :style="{
                    transform:
                      index === current ? 'rotate(180deg)' : 'rotate(0deg)',
                  }"
                >
                  <image
                    :style="{
                      opacity: index === current ? '1' : '0.6',
                    }"
                    class="fy_dropdown__arrow__icon"
                    style="width: 36rpx; height 36rpx"
                    src="/static/images/common/icon_fy_dropdown_arrow.png"
                  />
                </view>
              </template>
            </view>
          </view>
        </view>
        <view
          class="fy_dropdown__menu__right"
          :style="{ height: `${height}rpx` }"
        >
          <slot name="right"></slot>
        </view>
      </view>
    </view>

    <u-transition
      mode="fade"
      :customStyle="maskClass"
      :duration="duration"
      :show="active"
      @tap="handlerMaskClick"
    />
    <u-transition
      mode="fade"
      :customStyle="transClass"
      :duration="duration"
      :show="active"
    >
      <view class="fy_dropdown__content__popup">
        <template v-for="(item, index) in currentMenuList" :key="index">
          <fy-dropdown-item
            :backgroundColor="backgroundColor"
            :value="item.value"
            :dropdownKey="item.dropdownKey"
            :options="item.options"
            :type="item.type"
            @change="
              (v, label) => {
                handlerColumnChange(item.dropdownKey, v, label);
              }
            "
          ></fy-dropdown-item>
        </template>
        <!-- <slot></slot> -->
      </view>
    </u-transition>

    <fy-dropdown-popup
      title="筛选"
      :show="fyPopupShow"
      @close="
        () => {
          fyPopupShow = false;
          close();
        }
      "
    >
      <template v-for="(item, index) in currentMenuList" :key="index">
        <fy-dropdown-item
          :backgroundColor="backgroundColor"
          :value="item.value"
          :dropdownKey="item.dropdownKey"
          :options="item.options"
          :type="item.type"
          @change="
            (v, label) => {
              fyPopupShow = false;
              handlerColumnChange(item.dropdownKey, v, label);
            }
          "
        ></fy-dropdown-item>
      </template>
    </fy-dropdown-popup>
  </view>
</template>

<script>
import FyDropdownItem from "./components/fy-dropdown-item.vue";
import FyDropdownPopup from "@/components/popup/index.vue";

/**
 * dropdown 下拉菜单
 * @description 该组件一般用于向下展开菜单，同时可切换多个选项卡的场景
 * @property {String} active-color 标题和选项卡选中的颜色（默认#00bcd4）
 * @property {String} inactive-color 标题和选项卡未选中的颜色（默认#606266）
 * @property {Boolean} close-on-click-mask 点击遮罩是否关闭菜单（默认true）
 * @property {Boolean} close-on-click-self 点击当前激活项标题是否关闭菜单（默认true）
 * @property {String | Number} duration 选项卡展开和收起的过渡时间，单位ms（默认300）
 * @property {String | Number} height 标题菜单的高度，单位任意（默认90）
 * @property {String | Number} border-radius 菜单展开内容下方的圆角值，单位任意（默认0）
 * @property {Boolean} border-bottom 标题菜单是否显示下边框（默认false）
 * @property {String | Number} title-size 标题的字体大小，单位任意，数值默认为rpx单位（默认28）
 * @event {Function} open 下拉菜单被打开时触发
 * @event {Function} close 下拉菜单被关闭时触发
 * @example <fy-dropdown></fy-dropdown>
 */
export default {
  name: "fy-dropdown",
  components: { FyDropdownItem, FyDropdownPopup },
  props: {
    spaceBetween: {
      type: Boolean,
      default: false,
    },
    // 菜单标题和选项的激活态颜色
    activeColor: {
      type: String,
      default: "#1CC7BE",
    },
    // 菜单标题和选项的未激活态颜色
    inactiveColor: {
      type: String,
      default: "#1A1A1A",
    },
    // 点击遮罩是否关闭菜单
    closeOnClickMask: {
      type: Boolean,
      default: true,
    },
    // 点击当前激活项标题是否关闭菜单
    closeOnClickSelf: {
      type: Boolean,
      default: true,
    },
    // 过渡时间
    duration: {
      type: [Number, String],
      default: 300,
    },
    // 标题菜单的高度，单位任意，数值默认为rpx单位
    height: {
      type: [Number, String],
      default: 70,
    },
    // 是否显示下边框
    borderBottom: {
      type: Boolean,
      default: false,
    },
    // 标题的字体大小
    titleSize: {
      type: [Number, String],
      default: 28,
    },
    // 菜单右侧的icon图标
    menuIcon: {
      type: String,
      default: "arrow-down",
    },
    // 菜单右侧图标的大小
    menuIconSize: {
      type: [Number, String],
      default: 16,
    },
    // 菜单右侧图标的大小
    sortIconSize: {
      type: [Number, String],
      default: 12,
    },
    // 背景色
    backgroundColor: {
      type: String,
      default: "#fff",
    },
    backgroundBoxColor: {
      type: String,
      default: "#fff",
    },
    // 显示的菜单
    menuList: {
      type: Array,
      default() {
        return [];
      },
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    // h5的导航栏高度
    H5NavBarHeight: {
      type: Number,
      default: 44,
    },
    closeModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fyPopupShow: false,
      currentMenuList: [],
      titleHeight: 40,

      active: false, // 下拉菜单的状态
      // 当前是第几个菜单处于激活状态，小程序中此处不能写成false或者""，否则后续将current赋值为0，
      // 无能的TX没有使用===而是使用==判断，导致程序认为前后二者没有变化，从而不会触发视图更新
      current: 99999,
      currentKey: "",
      // 让某个菜单保持高亮的状态
      highlightIndex: 99999,
      contentHeight: 0, // 内容高度

      maskClass: {
        // 遮罩层样式
        position: "fixed",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        "z-index": 999999,
      },
      transClass: {
        // 内容弹框样式
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        "z-index": 999999,
      },

      // #ifndef MP
      childList: [],
      // #endif
      timers: null,
      sort: null,
    };
  },
  created() {
    // #ifdef MP
    // 供子组件调用，不能在data中声明变量，否则在微信小程序会造成循环引用而报错
    this.childList = [];
    // #endif
  },
  mounted() {
    this.$nextTick(() => {
      this.titleHeight = uni.upx2px(this.height);
    });
  },
  methods: {
    handlerColumnChange(dropdownKey, value, label) {
      this.$emit("change", dropdownKey, value, label);
    },
    // 点击菜单
    handlerMenuClick(index, dropdownKey) {
      const menu = this.menuList[index];
      if (menu.disabled) {
        menu.toast && uni.$main.toast(menu.toast);
        return;
      }
      if (dropdownKey == "sort") {
        this.sort = !this.sort ? "asc" : this.sort == "asc" ? "desc" : null;
        this.$emit("change", dropdownKey, this.sort);
        this.close();
        return;
      }
      if (dropdownKey == "click") {
        this.$emit("change", dropdownKey, menu);
        return;
      }
      if (dropdownKey == "filter") {
        this.close();

        this.fyPopupShow = true;
        // 重置高亮索引，否则会造成多个菜单同时高亮
        this.highlightIndex = 9999;
        // 展开时，设置下拉内容的样式
        // 标记展开状态以及当前展开项的索引
        this.current = index;
        this.currentKey = dropdownKey;

        this.getContentHeight();

        this.childList.forEach((item) => item.init());
        return;
      }
      // if (dropdownKey == "server") {
      //   if (index == this.current && this.closeOnClickSelf) {
      //     this.close();
      //     return;
      //   }
      //   this.current = index;
      //   return;
      // }
      // if (dropdownKey == "priceFilter") {
      //   if (index == this.current && this.closeOnClickSelf) {
      //     this.close();
      //     return;
      //   }
      //   this.current = index;
      //   return;
      // }
      // 判断是否被禁用
      if (this.menuList[index].disabled) return;
      // 如果点击时的索引和当前激活项索引相同，意味着点击了激活项，需要收起下拉菜单
      if (index == this.current && this.closeOnClickSelf) {
        return this.close();
        return;
      }
      // 判断是否被禁用
      if (this.menuList[index].disabled) return;
      // 如果点击时的索引和当前激活项索引相同，意味着点击了激活项，需要收起下拉菜单
      if (index == this.current && this.closeOnClickSelf) {
        return this.close();
      }

      clearTimeout(this.timers);
      this.timers = setTimeout(() => {
        this.open(index, dropdownKey);
        clearTimeout(this.timers);
      }, 0);
    },
    // 打开下拉菜单
    open(index, dropdownKey) {
      // 重置高亮索引，否则会造成多个菜单同时高亮
      this.highlightIndex = 9999;
      // 展开时，设置下拉内容的样式
      // 标记展开状态以及当前展开项的索引
      this.active = true;
      this.current = index;
      this.currentKey = dropdownKey;

      this.getContentHeight();

      this.childList.forEach((item) => item.init());

      this.$emit("open", this.current);
    },
    // 设置下拉菜单处于收起状态
    close() {
      this.$emit("close", this.current);
      // 设置为收起状态，同时current归位，设置为空字符串
      this.active = false;
      this.current = 99999;
      this.currentKey = "";

      uni.hideKeyboard();
      // #ifndef MP
      this.childList = [];
      // #endif
    },
    // 点击遮罩
    handlerMaskClick() {
      // 如果不允许点击遮罩，直接返回
      if (!this.closeOnClickMask) return;
      this.close();
    },
    // 外部手动设置某个菜单高亮
    highlight(index = undefined) {
      this.highlightIndex = index !== undefined ? index : 99999;
    },
    // 获取下拉菜单内容的高度
    getContentHeight() {
      // #ifdef APP-NVUE
      uni
        .createSelectorQuery()
        .in(this)
        .select("#fy_dropdown__menu")
        .boundingClientRect()
        .exec((rect) => {
          const data = rect[0];
          const top = data.top + this.titleHeight + "px";
          this.maskClass.top = top;
          this.transClass.top = top;
        });
      // #endif

      // #ifdef H5
      uni
        .createSelectorQuery()
        .in(this)
        .select("#fy_dropdown__menu")
        .boundingClientRect()
        .exec((rect) => {
          const data = rect[0];
          const top = data.top + this.titleHeight + this.H5NavBarHeight + "px";
          this.maskClass.top = top;
          this.transClass.top = top;
        });
      // #endif

      // #ifndef APP-NVUE || H5
      uni
        .createSelectorQuery()
        .in(this)
        .select(".fy_dropdown__menu")
        .boundingClientRect((rect) => {
          const top = rect.top + this.titleHeight + "px";
          this.maskClass.top = top;
          this.transClass.top = top;
        })
        .exec();
      // #endif
    },
  },
  watch: {
    menuList: {
      handler(val, oldVal) {
        if (JSON.stringify(val) != JSON.stringify(oldVal)) {
          this.currentMenuList = val;
        }
      },
      immediate: true,
      deep: true,
    },
    closeModal: {
      handler(val, oldVal) {
        if (val != oldVal) {
          this.handlerMaskClick();
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss">
@import "./fy-dropdown.scss";
</style>

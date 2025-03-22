<template>
  <view
    :class="['fy-dropdown-item', 'fy_dropdown-item']"
    @touchmove.stop.prevent="() => {}"
    :style="{
      background: backgroundColor,
      // height: activeItemHeight + 'rpx',
    }"
    v-if="active"
  >
    <template v-if="!custom">
      <template v-if="type == 'column'">
        <Fy-dropdown-column
          :backgroundColor="backgroundColor"
          :options="options"
          @success="onCateSuccess"
        />
      </template>
      <template v-else-if="type == 'tree'">
        <Fy-dropdown-tree :options="options" @success="onCateSuccess" />
      </template>
      <template v-else-if="type == 'filter'">
        <Fy-dropdown-filter :value="value" @success="onCateSuccess" />
      </template>
      <template v-else>
        <scroll-view
          :scroll-y="true"
          :show-scrollbar="false"
          class="fy_dropdown-item_scroll"
          :style="getScrollStyle"
        >
          <view
            v-for="(item, index) in options"
            :key="index"
            @tap.stop.prevent="cellClick(item.value, item.label)"
            class="fy_dropdown-item_scroll_cell"
            :style="{
              height: `${itemHeight}rpx`,
              'line-height': `${itemHeight}rpx`,
              'background-color': backgroundColor,
            }"
          >
            <text class="fy_cell_title">{{ item.label }}</text>
            <u-icon
              v-if="currentValue == item.value"
              name="checkbox-mark"
              size="22"
              :color="activeColor"
            />
          </view>
        </scroll-view>
      </template>
    </template>
    <slot v-else></slot>
  </view>
</template>

<script>
import FyDropdownColumn from "./fy-dropdown-column.vue";
import FyDropdownTree from "./fy-dropdown-tree.vue";
import FyDropdownFilter from "./fy-dropdown-filter.vue";

/**
 * dropdown-item 下拉菜单
 * @description 该组件一般用于向下展开菜单，同时可切换多个选项卡的场景
 * @property {String | Number} v-model 双向绑定选项卡选择值
 * @property {Array[Object]} options 选项数据，如果传入了默认slot，此参数无效
 * @property {Boolean} disabled 是否禁用此选项卡（默认false）
 * @property {String | Number} duration 选项卡展开和收起的过渡时间，单位ms（默认300）
 * @property {String | Number} height 弹窗下拉内容的高度(内容超出将会滚动)（默认auto）
 * @example <fy-dropdown-item></fy-dropdown-item>
 */
export default {
  name: "fy-dropdown-item",
  components: { FyDropdownColumn, FyDropdownTree, FyDropdownFilter },
  props: {
    // 当前选中项的value值
    dropdownKey: {
      type: String,
      default: "",
    },
    // 当前选中项的value值
    value: {
      type: [Number, String, Array, Object],
      default: "",
    },
    // 选项数据，如果传入了默认slot，此参数无效
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    // 是否禁用此菜单项
    disabled: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: "#fff",
    },
    maxHeight: {
      type: Number,
      default: 800,
    },
    itemHeight: {
      type: Number,
      default: 80,
    },
    type: {
      type: String,
      default: "",
    },
    custom: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentValue: "",
      initComponent: false,
      activeItemHeight: 300,
      active: false, // 当前项是否处于展开状态
      // #ifndef MP
      parent: null,
      // #endif
      activeColor: "#1CC7BE", // 激活时左边文字和右边对勾图标的颜色
      inactiveColor: "#1A1A1A", // 未激活时左边文字和右边对勾图标的颜色
    };
  },
  computed: {
    getScrollHeight() {
      let height = this.options.length * this.itemHeight;
      if (height === 0) {
        return 300;
      } else if (height > this.maxHeight) {
        return this.maxHeight;
      } else {
        return height;
      }
    },
    getScrollStyle() {
      return { height: `${this.getScrollHeight}rpx` };
    },
  },
  created() {
    this.activeItemHeight = 300;
    // #ifdef MP
    this.parent = null;
    // #endif
  },
  mounted() {
    this.init();
  },
  methods: {
    // 获取父组件的参数，因为支付宝小程序不支持provide/inject的写法
    // this.$parent在非H5中，可以准确获取到父组件，但是在H5中，需要多次this.$parent.$parent.xxx
    // 这里默认值等于undefined有它的含义，因为最顶层元素(组件)的$parent就是undefined，意味着不传name
    // 值(默认为undefined)，就是查找最顶层的$parent
    getParent(name = undefined) {
      try {
        let parent = this.$parent;
        // 通过while历遍，这里主要是为了H5需要多层解析的问题
        while (parent) {
          // 父组件
          if (parent.$options && parent.$options.name !== name) {
            // 如果组件的name不相等，继续上一级寻找
            parent = parent.$parent;
          } else {
            return parent;
          }
        }
        return false;
      } catch (err) {
        uni.log.info(err);
        return false;
      }
    },
    // 将当前px转换为rpx
    getScaleToRpx(px) {
      try {
        const screenWidth = uni.getSystemInfoSync().screenWidth;
        const unit = 750 / screenWidth;
        return px * unit;
      } catch (err) {
        return px;
      }
    },
    init() {
      try {
        let parent = this.getParent.call(this, "fy-dropdown");
        if (!parent) return;
        this.parent = parent;
        this.active = parent.currentKey == this.dropdownKey;

        if (this.initComponent === false) {
          parent.childList.push(this); // 供父组件依次更新子组件显示内容
        }
        if (this.active === false) {
          this.initComponent = true;
          return;
        }

        if (this.type === "cate" || this.type === "address") {
          this.activeItemHeight = this.getScaleToRpx(320) + 100;
        } else if (this.type === "column") {
          this.activeItemHeight = this.getScaleToRpx(220) + 100;
        } else {
          this.activeItemHeight = this.getScrollHeight;
        }

        this.initComponent = true;
      } catch (err) {
        uni.log.info(err);
      }
    },
    // cell被点击
    cellClick(value, label) {
      // 修改通过v-model绑定的值
      this.$emit("input", value, label);
      // 通知父组件(fy-dropdown)收起菜单
      this.parent.close();
      // 发出事件，抛出当前勾选项的value
      this.$emit("change", value, label);
    },
    onCateSuccess(data) {
      this.parent.close();
      if (data.value) {
        this.$emit("change", { ...data });
      }
    },
  },
  watch: {
    value: {
      handler: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.currentValue = newVal;
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss">
@import "./fy-dropdown-item.scss";
</style>

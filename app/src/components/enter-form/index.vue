<template>
  <view>
    <!-- 表单 -->
    <template v-for="(param, index) in data?.formList" :key="index">
      <view
        v-if="param.child.length"
        class="form flex-column justify-content-between"
      >
        <text class="form-label"> {{ param.name }}</text>
        <template v-for="(item, i) in param.child" :key="i">
          <template v-if="!item.invisible">
            <view
              :id="'formItem_' + item.name"
              class="form-item flex-row justify-content-between"
              :class="{
                'flex-column': item.flexColumn,
                'align-items': !item.flexColumn,
              }"
            >
              <view class="label-box">
                <view class="label flex-row">
                  <text v-if="item.label" class="text text-title">{{
                    item.label
                  }}</text>
                  <text v-if="item.required" class="text color-red">*</text>
                  <f-tips :tips="item.tips" />
                </view>
                <view v-if="item.desc" class="desc" v-html="item.desc"></view>
              </view>
              <view class="value-box">
                <!-- upload -->
                <template v-if="item.type === 'upload'">
                  <view class="upload">
                    <izUploaderImg
                      :number="item.max"
                      @change="(val) => handleChangeUpload(val, item)"
                    ></izUploaderImg>
                  </view>
                </template>
                <!-- uploadImage -->
                <template v-else-if="item.type === 'uploadImage'">
                  <view class="uploadImage">
                    <izUploaderImg
                      :ref="(el) => (izUploaderImgRef[index] = el)"
                      :number="item.max"
                      :placeholder="item.placeholder"
                      :previewImageUrl="item.previewImage"
                      :popupTitle="item.name"
                      :previewImageViewUrl="item.previewImageViewUrl"
                      @change="(val) => handleChangeUploadImage(val, item)"
                      @example="handleExamplePopup(item)"
                    ></izUploaderImg>
                  </view>
                </template>
                <!-- input -->
                <template v-else-if="item.type === 'input'">
                  <input
                    class="value-input"
                    :disabled="item.disabled"
                    :class="item.disabled ? 'color-A3' : ''"
                    :type="item.inputType || 'text'"
                    v-model="data.formFileds[item.name]"
                    :placeholder="item.placeholder"
                    :placeholderStyle="placeholderStyle"
                    :customStyle="customStyle"
                    font-size="24rpx"
                    color="#1A1A1A"
                    border="none"
                    inputAlign="right"
                    :maxlength="item.max || -1"
                    @focus="inputFocus(item)"
                  />
                </template>
                <!-- inputTextarea -->
                <template v-else-if="item.type === 'inputTextarea'">
                  <u--textarea
                    v-model="data.formFileds[item.name]"
                    class="value-input-textarea"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    :maxlength="item.maxWord || -1"
                    :placeholderStyle="placeholderStyle"
                    border="none"
                    height="216rpx"
                  >
                  </u--textarea>
                </template>
                <!-- textarea -->
                <template v-else-if="item.type === 'textarea'">
                  <view class="value-textarea-position">
                    <u--textarea
                      id="myArea"
                      v-model="data.formFileds[item.name]"
                      class="value-textarea"
                      :disabled="item.disabled"
                      :placeholder="item.placeholder"
                      :maxlength="item.maxWord || -1"
                      :placeholderStyle="placeholderStyle"
                      placeholderClass="value-textarea-input"
                      border="none"
                      height="216rpx"
                      @focus="focusEvent"
                    >
                    </u--textarea>
                    <view class="textarea-word">
                      <text class="text">
                        {{
                          `${getWordLength(data.formFileds[item.name], item)}/${item.maxWord}`
                        }}
                      </text>
                    </view>
                  </view>
                </template>
                <!-- 按钮 组件-->
                <template v-else-if="item.type === 'switch'">
                  <view class="value-switch">
                    <switch
                      class="switch"
                      type="switch"
                      :checked="data.formFileds[item.name]"
                      :disabled="item.disabled"
                      color="#3291F9"
                      @change="switchChange(item, $event)"
                    ></switch>
                  </view>
                </template>
                <!-- 单选框组件 -->
                <template v-else-if="item.type === 'radio'">
                  <view class="value-checkbox">
                    <template v-if="item.options.length <= 2">
                      <f-radio
                        :type="item.type"
                        :list="item.options"
                        :modelValue="data.formFileds[item.name]"
                        @handle-change="radioChange(item, $event)"
                      />
                    </template>
                    <template v-else>
                      <view
                        style="display: flex; align-items: center"
                        @tap="handlePopup(item)"
                      >
                        <template v-if="data.formFileds[item.name]">
                          <text class="value-text">{{
                            getOptionLabel(
                              item.options,
                              data.formFileds[item.name]
                            )
                          }}</text>
                        </template>
                        <template v-else>
                          <text class="pick-text">请选择{{ item.label }}</text>
                        </template>
                        <u-icon
                          name="arrow-right"
                          color="#AFAFAF"
                          size="10"
                        ></u-icon>
                        <!-- <image
                          style="width: 24rpx; height: 24rpx"
                          src="/static/images/common/icon_right.png"
                        /> -->
                      </view>
                    </template>
                  </view>
                </template>
                <!-- 多选框组件 -->
                <template v-else-if="item.type === 'checkbox'">
                  <view class="value-checkbox" @tap="handlePopup(item)">
                    <view style="display: flex; align-items: center">
                      <template v-if="data.formFileds[item.name]">
                        <text class="value-text">{{
                          data.formFileds[item.name].length
                        }}</text>
                      </template>
                      <template v-else>
                        <text class="pick-text">请选择{{ item.label }}</text>
                      </template>
                      <u-icon
                        name="arrow-right"
                        color="#AFAFAF"
                        size="10"
                      ></u-icon>
                      <!-- <image
                        style="width: 24rpx; height: 24rpx"
                        src="/static/images/common/icon_right.png"
                      /> -->
                    </view>
                  </view>
                </template>
                <!-- text -->
                <template v-else-if="item.type === 'text'">
                  <text class="value-text">{{
                    data.formFileds[item.name]
                  }}</text>
                </template>
                <!-- err tips -->
                <template v-if="item.showErrTip && item.required">
                  <view class="err-tips-box">
                    <text class="color-red text">{{
                      item.errTips || item.label + "填写错误"
                    }}</text>
                  </view>
                </template>
              </view>
            </view>
            <template
              v-if="
                item.name == 'product_price' &&
                enterType != ProductTypeEnum.GUARANTEE
              "
            >
              <view class="price-box">
                <view class="service">
                  <text class="text">预估服务费：</text>
                  <text
                    class="text"
                    :class="{
                      original: showCost,
                    }"
                    >{{ serviceFee }}元</text
                  >
                  <text v-if="showCost" class="text current"
                    >{{ getToFixed(serviceFee * costData.discount) }}元</text
                  >
                </view>
                <view class="service">
                  <text class="text">预估到手：</text>
                  <text
                    class="text"
                    :class="{
                      original: showCost,
                    }"
                    >{{ actualPrice }}元</text
                  >
                  <text v-if="showCost" class="text current"
                    >{{
                      getToFixed(
                        data.formFileds.product_price -
                          serviceFee * costData.discount
                      )
                    }}元</text
                  >
                </view>

                <view class="cost">
                  <text class="text orange"
                    >服务费=成交金额*{{ costData.fee_rate * 100 }}%，上限{{
                      costData.max_fee
                    }}元，最低{{ costData.min_fee }}元</text
                  >
                  <text v-if="showCost" class="text hong"
                    >享{{ costData.discount * 10 }}折</text
                  >
                </view>
              </view>
            </template>
            <template v-if="item.name == 'guarantee_payer'">
              <view class="price-box">
                <text class="text">预估到手：{{ evaluateExpression }}元</text>
                <view class="cost">
                  <text class="text orange"
                    >服务费=成交金额*{{ costData.fee_rate * 100 }}%，</text
                  >
                  <text v-if="costData.max_fee" class="text orange"
                    >上限{{ costData.max_fee }}元，</text
                  >
                  <text class="text orange">最低{{ costData.min_fee }}元</text>

                  <text v-if="showCost" class="text hong"
                    >享{{ costData.discount * 10 }}折</text
                  >
                </view>
                <text class="text orange"
                  >买家承担，需买家支付；卖家承担，需从放款金额内扣除。</text
                >
                <text class="text orange"
                  >注：预估到手价仅供参考，中介担保费根据实际承担方进行计算。</text
                >
              </view>
            </template>
            <template v-if="item.name == 'product_desc'">
              <quick-words
                :text="data.formFileds[item.name]"
                @onChange="handleQuickChange($event, item)"
              />
            </template>
          </template>
        </template>
      </view>
    </template>

    <popup ref="popupRef" :title="popupItem?.label">
      <scroll-view
        scroll-y
        :show-scrollbar="false"
        :style="{ height: '792rpx' }"
      >
        <f-radio
          className="popup"
          :type="popupItem.type"
          :list="popupItem.options"
          @handleChange="checkboxChange(popupItem, $event)"
          :modelValue="data.formFileds[popupItem.name]"
        ></f-radio>
      </scroll-view>
    </popup>

    <example-popup
      v-if="
        props.enterType == ProductTypeEnum.GUARANTEE ||
        props.enterType == ProductTypeEnum.RECYCLE
      "
      ref="examplePopupRef"
      :title="`如何获取${popupItem?.label}`"
      @close="examplePopupRef.close()"
      :popupStyle="popupStyle"
      :titleBoxStyle="titleBoxStyle"
    >
      <scroll-view scroll-y :show-scrollbar="false" style="height: 1100rpx">
        <image
          mode="widthFix"
          style="width: 100%"
          :src="popupItem.previewImageViewUrl"
        />
      </scroll-view>
    </example-popup>
  </view>
</template>

<script setup>
import { cloneDeep, find, isEqual } from "lodash-es";
import { computed, reactive, watch, ref, nextTick } from "vue";
import {
  totalWord,
  mobileAddSpaceLogin,
  verifyPrice,
  checkImageLength,
} from "./test";
import FRadio from "./f-radio.vue";
import FTips from "./f-tips.vue";
import QuickWords from "./quick-words.vue";
import Popup from "@/components/popup/index.vue";
import ExamplePopup from "@/components/popup/index.vue";
import izUploaderImg from "@/components/iz-uploader-img/iz-uploader-img.vue";
import { ProductTypeEnum } from "@/enums/product";
import { onLoad } from "@dcloudio/uni-app";
import { evaluate } from "mathjs";
import { assembleGameForm } from "@/gameData";
import { isEmpty } from "lodash-es";
const popupRef = ref(null);
const examplePopupRef = ref(null);
const popupItem = ref(null);
const expression = ref(null);
const izUploaderImgRef = ref([]);
const cursor = ref(0);
const popupStyle = ref({
  backgroundColor: "#fff", // 修改背景色
  borderTopLeftRadius: "24rpx", // 修改圆角
  borderTopRightRadius: "24rpx", // 修改圆角
  boxSizing: "border-box", // 修改内边距
});
const titleBoxStyle = ref({
  background: "linear-gradient(to bottom, #ecfefd, #fff)", // 修改背景色
  padding: "32rpx", // 修改内边距
  borderTopLeftRadius: "24rpx", // 修改圆角
  borderTopRightRadius: "24rpx", // 修改圆角
  paddingBottom: "0", // 修改内边距
});
const props = defineProps({
  gameId: {
    type: [String, Number],
    default: "",
  },
  formFileds: {
    type: Object,
    default: () => ({}),
  },
  formData: {
    type: Array,
    default: () => [],
  },
  formItemParent: {
    type: Array,
    default: () => [],
  },
  enterType: {
    type: Number,
    default: ProductTypeEnum.ACCOUNT,
  },
  costData: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(["switchChange", "dateChange"]);

const data = reactive({ formList: [], formFileds: {}, formData: [] });
const showCost = computed(() => {
  const { costData } = props;
  return costData.discount && costData.discount < 1;
});

const getOptionLabel = computed(() => {
  return (options, value) => {
    return options.find((op) => op.value == value)?.label;
  };
});

const getToFixed = computed(() => {
  return (value) => {
    if (!value) return 0;
    return value.toFixed(2);
  };
});

const guaranteePrice = computed(() => {
  const { costData } = props;
  if (!costData.rate_formula) {
    return "";
  }
  const str = costData.rate_formula.replace(
    /#amount/g,
    data.formFileds.product_price || 0
  );
  return evaluate(str);
});

function getDomainFromUrl(url) {
  const regex = /^(https?:\/\/[^\/]+)/;
  const match = url.match(regex);
  return match ? match[0] : null;
}

function onCreated() {
  const formFileds = {};
  if (props.formFileds.screenshot_info) {
    setTimeout(() => {
      izUploaderImgRef.value[0]?.init(
        props.formFileds.screenshot_info.map((item) => {
          const path = getDomainFromUrl(item.url);
          return {
            url: item.url.replace(path, ""),
            src: item.url,
            path,
          };
        })
      );
    }, 300);
  }
  data.formData.forEach((config) => {
    if (props.formFileds.product_id && disableField.includes(config.name)) {
      config.disabled = true;
    }
    if (!isEmpty(config.value)) {
      formFileds[config.name] = config.value;
    }
    if (!isEmpty(props.formFileds[config.name])) {
      formFileds[config.name] = props.formFileds[config.name];
    }
    config.showErrTip = false;
    data.formList.forEach((item) => {
      if (item.id === config.parentId) {
        item.child.push(config);
      }
    });
  });
  data.formFileds = formFileds;
}

const placeholderStyle = reactive({
  fontWeight: "400",
  fontSize: "24rpx",
  color: "#AFAFAF",
});
const customStyle = reactive({
  height: "30rpx",
});

const disableField = [
  "product_account",
  "user_phone",
  "user_QQ",
  "user_wechat",
];

const rulesList = {
  /**
   * 内置自定义校验方法
   * @param {object} item 	校验的表单对象
   * @param {any}	value		当前表单item对应数据
   * @returns {Boolean} 		是否通过校验
   */
  ruleDemo: (item, value) => {
    uni.log.info("rule demo", item, value);
    if (!value) {
      return false;
    }
    return true;
  },
  rulePhone: (item, value, ruleErrMsg) => {
    if (!mobileAddSpaceLogin(value)) {
      item.errTips = ruleErrMsg;
      return false;
    }
    return true;
  },
  rulePrice: (item, value, ruleErrMsg) => {
    if (!verifyPrice(value)) {
      item.errTips = ruleErrMsg;
      return false;
    }
    return true;
  },
  rulePriceImageLength: (item, value, ruleErrMsg) => {
    if (!checkImageLength(value)) {
      item.errTips = ruleErrMsg;
      return false;
    }
    return true;
  },
};
const serviceFee = computed(() => {
  if (!data.formFileds.product_price) return 0;
  const { costData } = props;

  const context = {
    amount: data.formFileds.product_price,
  };
  // 替换 #符号变量为实际变量
  const variables = Object.keys(context);
  let test = null;
  for (const variable of variables) {
    const regex = new RegExp(`#${variable}`, "g");
    test = costData.rate_formula?.replace(regex, context[variable]);
  }
  const price = test ? evaluate(test) : 0;

  if (price < costData.min_fee) return costData.min_fee;
  if (price > costData.max_fee) return costData.max_fee;
  return price.toFixed(2);
});
const actualPrice = computed(() => {
  if (!data.formFileds.product_price || !serviceFee.value) return 0;
  if (serviceFee.value - 0 > data.formFileds.product_price - 0) return 0;
  return (data.formFileds.product_price - serviceFee.value).toFixed(2);
});

const evaluateExpression = computed(() => {
  if (!data.formFileds.product_price) return 0;
  if (!data.formFileds.guarantee_payer) return 0;
  if (data.formFileds.guarantee_payer == "BUYER") {
    return data.formFileds.product_price;
  }
  const context = {
    amount: data.formFileds.product_price,
  };
  // 替换 #符号变量为实际变量
  const variables = Object.keys(context);
  let test = null;
  for (const variable of variables) {
    const regex = new RegExp(`#${variable}`, "g");
    test = props.costData.rate_formula.replace(regex, context[variable]);
  }

  // 使用 Function 构造函数安全评估表达式
  return (
    data.formFileds.product_price -
    evaluate(test) * props.costData.discount
  ).toFixed(2);
});

const handlePopup = (item) => {
  popupItem.value = item;
  popupRef.value.open();
};

const handleExamplePopup = (item) => {
  popupItem.value = item;
  examplePopupRef.value.open();
};

const getWordLength = computed(() => {
  return (text, item) => {
    if (item && data.formList.length) {
      if (data.formFileds[item.name] == text && text) {
        item.showErrTip = false;
      }
    }
    if (typeof text === "string") {
      return totalWord(text);
    } else {
      return 0;
    }
  };
});

function radioChange(item, value) {
  data.formFileds[item.name] = value[0];
  item.showErrTip = false;
}

function checkboxChange(item, value) {
  data.formFileds[item.name] = item.type == "checkbox" ? value : value[0];
  item.optionsCopy = item.options.filter((list) => value.includes(list.value));
  item.showErrTip = false;
  if (item.type == "radio") {
    popupRef.value.close();
  }
  if (item.operation && item.operation == "select") {
    data.formList
      .reduce((acc, list) => {
        return acc.concat(list.child);
      }, [])
      .map((form) => {
        if (typeof form.invisible != "undefined") {
          if (form.visibleId.includes(value[0])) {
            form.invisible = false;
          } else {
            form.invisible = true;
          }
        }
      });
  }
}

function switchChange(item, { detail }) {
  data.formFileds[item.name] = detail.value;
  emit("switchChange", item);
}

function inputFocus(item) {
  item.showErrTip = false;
}

function pickerChange(item, index, { detail }) {
  data.formFileds[item.name] = detail.value;
  if (item.mode === "date") {
    emit("dateChange", {
      item,
      value: detail.value,
    });
  }
}

function validate(cb) {
  let fromState = true; // true检验通过 false检验不通过
  const params = {
    formItem: null,
    msg: null,
  };
  const formFileds = cloneDeep(data.formFileds);
  formFileds.goodsInfo = {};
  data.formList
    .reduce((acc, item) => {
      return acc.concat(item.child);
    }, [])
    .forEach((i, k) => {
      if (i.invisible) return;
      const value = formFileds[i.name];
      if (i.rules) {
        if (fromState) {
          fromState = rulesList[i.rules.rulesName](
            i,
            value,
            i.rules.ruleErrMsg
          );
        }
        if (
          !rulesList[i.rules.rulesName](i, value, i.rules.ruleErrMsg) &&
          !i.showErrTip
        ) {
          i.showErrTip = true;
        }
      } else if (i.required) {
        // 没有自定义规则则判断是否为假
        if (
          !value ||
          (!getWordLength.value(value) && typeof value === "string") ||
          JSON.stringify(value) === "[]" ||
          JSON.stringify(value) === "{}"
        ) {
          fromState = false;
          i.showErrTip = true;
        } else {
          i.showErrTip = false;
        }
      }
      if (i.showErrTip) {
        params.formItem = "formItem_" + i.name;
        params.msg = i.errTips || i.label + "填写错误";
      }
    });
  const goodsInfo = data.formList.find((item) => item.isGoodsInfo);
  let product_title = "";
  try {
    if (goodsInfo) {
      goodsInfo.child.forEach((item) => {
        if (item.noIsGoodsInfo == undefined || !item.noIsGoodsInfo) {
          formFileds.goodsInfo[item.name] = data.formFileds[item.name];
          delete formFileds[item.name];
        }
        if (isEqual(data.formFileds[item.name])) return;
        if (item.type == "checkbox") {
          product_title += `${item.label}${data.formFileds[item.name].length} `;
        } else if (item.type == "radio") {
          const name = item.options.find(
            (op) => op.value == data.formFileds[item.name]
          );
          product_title += name ? name.label + " " : "";
        } else if (item.type != "uploadImage") {
          product_title += `${item.label}${data.formFileds[item.name]} `;
        }
      });
    }
  } catch (e) {
    uni.log.info(e, "录入错误");
  }
  formFileds.product_title = product_title;
  cb && cb(fromState, formFileds, params);
}

async function getPageScrollTop(item) {
  const query = uni.createSelectorQuery().in(this);

  return new Promise((resolve) => {
    nextTick(() => {
      query
        .select("#" + item)
        .boundingClientRect((data) => {
          resolve(Math.round(data?.top));
        })
        .exec();
    });
  });
}

function delImg(item, key) {
  data.formFileds[item.name].splice(key, 1);
}

function resetForm(item, key) {
  // data.formFileds[item.name].splice(key, 1);
  onCreated();
}

function handleChangeUpload(imageData, item) {
  data.formFileds[item.name] = imageData.urls[0];
  item.showErrTip = false;
}
function handleChangeUploadImage(imageData, item) {
  data.formFileds[item.name] = imageData.urls.map((url) => {
    return { url };
  });
  item.showErrTip = false;
}

function focusEvent() {
  uni.getSelectedTextRange({
    success: (res) => {
      cursor.value = res.end;
    },
  });
}

/*
	str：原字符串
	index：指定插入的索引文字
	insertStr：要插入的字符串
*/
function insertStr(str = "", index, insertStr) {
  const ary = str.split(""); // 转化为数组
  ary.splice(index, 0, insertStr); // 使用数组方法插入字符串
  return ary.join(""); // 拼接成字符串后输出
}

function removeSubstring(mainStr, toRemove) {
  // 使用 RegExp 构造函数动态创建正则
  const regex = new RegExp(toRemove, "g");

  // 使用 replace 方法删除匹配的子字符串
  return mainStr.replace(regex, "");
}

function handleQuickChange({ bool, text }, item) {
  // 获取textarea光标索引
  try {
    if (!bool) {
      data.formFileds.product_desc = insertStr(
        data.formFileds.product_desc,
        cursor.value,
        text
      );
      if (getWordLength.value(data.formFileds.product_desc) >= item.maxWord) {
        uni.$main.toast(`描述最多${item.maxWord}字`);
        nextTick(() => {
          data.formFileds.product_desc = removeSubstring(
            data.formFileds.product_desc,
            text
          );
        });
        return;
      }
      return;
    }
    if (data.formFileds?.product_desc?.includes(text)) {
      data.formFileds.product_desc = removeSubstring(
        data.formFileds.product_desc,
        text
      );
    }
  } catch (error) {
    console.log(error);
  }
}

watch(
  () => props.gameId,
  async (newVal, oldVal) => {
    if (newVal != oldVal && newVal) {
      const { gameFormData, gameFormItemParent } = await assembleGameForm(
        newVal,
        props.enterType,
        true
      );
      data.formData = cloneDeep(gameFormData);
      data.formList = cloneDeep(gameFormItemParent);
      setTimeout(() => {
        onCreated();
      }, 100);
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

defineExpose({
  validate,
  resetForm,
  getPageScrollTop,
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

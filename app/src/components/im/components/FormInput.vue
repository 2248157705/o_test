<template>
  <div>
    <div :class="inputClass">
      <slot name="addonBefore" />
      <input
        class="input"
        :type="type"
        :value="inputValue"
        :focus="inputFocus"
        :placeholder="placeholder"
        :maxlength="maxlength"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <icon
        v-show="modelValue && allowClear"
        type="clear"
        size="16"
        @tap="clearInput()"
      />
      <slot name="addonAfter" />
    </div>
    <div v-if="inputError && rule" class="error-tips">{{ rule.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "../utils/transformVue";
const $emit = defineEmits(["update:modelValue", "input", "focus", "blur"]);
const props = defineProps({
  className: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  allowClear: {
    type: Boolean,
    default: false,
  },
  rule: {
    type: Object,
    default: null,
  },
  maxlength: {
    type: Number,
    default: 140,
  },
});

const inputFocus = ref(false);
const inputError = ref(false);
// const inputKey = ref(0);

const inputClass = computed(() => {
  return [
    props.class,
    "form-input-item",
    { focus: inputFocus.value, error: inputError.value },
  ];
});

const inputValue = computed(() => {
  return props.modelValue || "";
});

const handleBlur = (event) => {
  inputFocus.value = false;
  if (props.rule && props.rule.trigger === "blur") {
    inputError.value = !props.rule.reg.test(props.modelValue || "");
  }
  $emit("blur", event);
};

const handleFocus = (event) => {
  inputFocus.value = true;
  $emit("blur", event);
};

const handleInput = (event) => {
  if (!(props.maxlength && event.detail.value.length > props.maxlength)) {
    $emit("update:modelValue", event.detail.value);
    $emit("input", event.detail.value);
  }
  // 强制刷新input
  // inputKey.value++;
};

const clearInput = () => {
  $emit("update:modelValue", null);
  $emit("input", null);

  inputFocus.value = true;
};
</script>

<style lang="scss" scoped>
$primary-color: #337eff;
$error-color: #f56c6c;

.form-input-item {
  border-bottom: 1px solid #dcdfe5;
  padding: 10px 10px 5px 0px;
  display: flex;
  height: 44px;
  align-items: center;

  &.focus {
    border-color: $primary-color;
  }

  &.error {
    border-color: $error-color;
  }
}

.input {
  flex: 1;
  border: none;
  outline: none;
}

.error-tips {
  color: $error-color;
  font-size: 12px;
  margin-top: 5px;
}
</style>

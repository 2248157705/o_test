<template>
  <view>
    <u--form
      ref="formRef"
      :label-width="80"
      :model="formData"
      :rules="formRules"
    >
      <template v-for="field in formFields">
        <view v-if="field.status === FieldsStatus.ENABLE" :key="field.name">
          <select-view
            v-if="field.type === 'select'"
            :name="field.name"
            :label="field.label"
            :required="field.required"
            :disabled="field.disabled"
            :placeholder="field.placeholder"
            :options="field.options"
          />
          <datetime-view
            v-else-if="field.type === 'datetime'"
            :key="field.name"
            :name="field.name"
            :label="field.label"
            :required="field.required"
            :disabled="field.disabled"
            :placeholder="field.placeholder"
          />

          <input-view
            v-else-if="field.type === 'input'"
            :name="field.name"
            :label="field.label"
            :required="field.required"
            :disabled="field.disabled"
            :placeholder="field.placeholder"
          />

          <textarea-view
            v-else-if="field.type === 'textarea'"
            :name="field.name"
            :label="field.label"
            :required="field.required"
            :disabled="field.disabled"
            :placeholder="field.placeholder"
          />

          <radio-view
            v-else-if="field.type === 'radio'"
            :name="field.name"
            :label="field.label"
            :required="field.required"
            :disabled="field.disabled"
            :options="field.options"
          />

          <checkbox-view
            v-else-if="field.type === 'checkbox'"
            :name="field.name"
            :label="field.label"
            :required="field.required"
            :disabled="field.disabled"
            :options="field.options"
          />

          <upload-view
            v-else-if="field.type === 'upload'"
            :name="field.name"
            :label="field.label"
            :required="field.required"
            :disabled="field.disabled"
            :options="field.options"
          />
        </view>
      </template>
      <button type="submit" @click="submitForm">提交</button>
    </u--form>
  </view>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";

import selectView from "./select.vue";
import datetimeView from "./datetime.vue";
import inputView from "./input.vue";
import textareaView from "./textarea.vue";
import radioView from "./radio.vue";
import checkboxView from "./checkbox.vue";
import uploadView from "./upload.vue";
import { FormUtls, FieldsStatus, FormFields } from "./form";

const {
  formRef,
  formData,
  formRules,
  getFieldValidationRules,
  getFieldValue,
  clearValidate,
  resetForm,
  submitForm,
} = FormUtls();

const formFields: FormFields[] = [
  {
    name: "username",
    label: "用户名",
    type: "input",
    status: FieldsStatus.ENABLE,
    weight: 2,
    required: true,
    remark: "",
    validation: {
      message: "请填写用户名",
      min: 3,
      max: 20,
    },
  },
  {
    name: "email",
    label: "邮箱",
    type: "textarea",
    status: FieldsStatus.ENABLE,
    weight: 1,
    disabled: true,
    required: true,
    validation: {
      type: "email",
      pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    },
  },
  {
    name: "password",
    label: "密码",
    type: "input",
    status: FieldsStatus.ENABLE,
    weight: 3,
    required: true,
    validation: {
      min: 6,
    },
  },
  {
    name: "confirmPassword",
    label: "确认密码",
    type: "input",
    status: FieldsStatus.DISABLE,
    required: true,
    validation: {
      custom: "passwordMatch",
    },
  },
  {
    name: "gender",
    label: "性别",
    type: "radio",
    status: FieldsStatus.ENABLE,
    required: true,
    validation: {},
    options: [
      { label: "男", value: "male" },
      { label: "女", value: "female" },
    ],
  },
  {
    name: "avatar",
    label: "头像",
    type: "upload",
    status: FieldsStatus.ENABLE,
    action: "/upload",
    required: true,
    validation: {},
  },
  {
    name: "interests",
    label: "兴趣爱好",
    type: "checkbox",
    status: FieldsStatus.ENABLE,
    options: [
      { label: "游泳", value: "swimming" },
      { label: "跑步", value: "running" },
      { label: "篮球", value: "basketball" },
      { label: "跑步", value: "running1" },
      { label: "篮球", value: "basketball2" },
    ],
    required: true,
    validation: {},
  },
  {
    name: "interests2",
    label: "兴趣爱好2",
    type: "select",
    status: FieldsStatus.ENABLE,
    options: [
      { name: "游泳", value: "swimming" },
      { name: "跑步", value: "running" },
      { name: "篮球", value: "basketball" },
    ],
    required: true,
    validation: {},
  },
  {
    name: "time",
    label: "时间",
    type: "datetime",
    status: FieldsStatus.ENABLE,
    options: [
      { name: "游泳", value: "swimming" },
      { name: "跑步", value: "running" },
      { name: "篮球", value: "basketball" },
    ],
    required: true,
    validation: {},
  },
];

onBeforeMount(() => {
  formFields.sort((a, b) => a?.weight - b?.weight);
  const formDataValues = getFieldValue(formFields);
  const rules = getFieldValidationRules(formFields);
  Object.assign(formData, formDataValues);
  Object.assign(formRules, rules);
});

defineExpose({
  formRef,
  submitForm,
  resetForm,
  clearValidate,
});
</script>

<style>
/* 样式 */
</style>

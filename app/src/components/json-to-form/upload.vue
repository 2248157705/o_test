<template>
  <u-form-item :prop="name" :label="label" :required="required">
    <u-upload
      v-model="state.value"
      :disabled="disabled"
      action="./test"
      :name="name"
    />
  </u-form-item>
</template>
<script setup lang="ts">
import { reactive } from "vue";

defineProps({
  name: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
});

const state = reactive({
  value: "",
});
</script>

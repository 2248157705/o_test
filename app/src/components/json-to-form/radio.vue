<template>
  <u-form-item :prop="name" :label="label" :required="required">
    <u-radio-group v-model="state.value" :disabled="disabled">
      <template v-if="options">
        <u-radio
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :name="item.value"
        >
        </u-radio>
      </template>
    </u-radio-group>
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
  options: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const state = reactive({
  value: "",
});
</script>

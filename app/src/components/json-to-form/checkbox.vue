<template>
  {{ state }}
  <u-form-item :prop="name" :label="label" :required="required">
    <u-grid :border="false" col="4">
      <u-grid-item v-for="item in options" :key="item.value">
        <text>{{ item.label }}</text>
      </u-grid-item>
    </u-grid>

    <!-- <u-checkbox-group v-model="state.value" :disabled="disabled">
      <template v-if="options">
        <u-checkbox 
          v-for="item in options"
          :key="item.value"
          :customStyle="{ marginBottom: '8px' }"
          :label="item.label"
          :name="item.value"
        >
        </u-checkbox>
      </template>
    </u-checkbox-group> -->
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
  value: [],
});
</script>

<style lang="scss" scoped>
.checkbox-group {
  width: 750px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  .checkbox {
    width: 200rpx;
    height: 200rpx;
    background: #f0f0f0;
  }
}
</style>

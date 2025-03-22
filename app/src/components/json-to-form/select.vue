<template>
  <u-form-item
    :prop="name"
    :label="label"
    :required="required"
    @tap="handleShow"
  >
    <u--input
      v-model="state.name"
      border="none"
      disabled-color="#ffffff"
      :disabled="true"
      :placeholder="placeholder"
    ></u--input>
    <template #right>
      <u-icon name="arrow-right"></u-icon>
    </template>
    <cover-view>
      <u-action-sheet
        :show="state.show"
        :actions="options"
        :title="placeholder"
        @close="handleHide"
        @select="handleSelectSheet"
      >
      </u-action-sheet>
    </cover-view>
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
  status: {
    type: Number,
    default: 1,
  },
  placeholder: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const state = reactive({
  show: false,
  value: "",
  name: "",
});

const handleShow = () => {
  state.show = true;
};

const handleHide = () => {
  state.show = false;
};

const handleSelectSheet = (e) => {
  if (e) {
    state.value = e.value;
    state.name = e.name;
  }
  uni.log.info("confirm", e);
};
</script>

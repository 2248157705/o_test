<template>
  <u-button text="微信支付" @tap="wxH5Pay"></u-button>
</template>

<script setup lang="ts">
import { Payment } from "./payment";
const { wxH5Pay } = Payment();
</script>
<style lang="scss" scoped></style>

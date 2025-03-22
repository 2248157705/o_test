<template>
  <u-button text="微信绑定" @tap="wxLogin"></u-button>
</template>

<script setup lang="ts">
import { Login } from "./login";
const { wxLogin } = Login();
</script>
<style lang="scss" scoped></style>

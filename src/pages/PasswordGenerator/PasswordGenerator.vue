<script lang="ts" setup>
import Header from '@/components/Header.vue'
import PasswordGenerator from '@/components/PasswordGenerator/PasswordGenerator.vue'

definePage({
  style: {
    navigationStyle: 'custom',
  },
})
</script>

<template>
  <view class="px-5 pb-safe">
    <Header title="密码生成器" fixed :show-left="false" />
    <PasswordGenerator />
  </view>
</template>

<style scoped></style>

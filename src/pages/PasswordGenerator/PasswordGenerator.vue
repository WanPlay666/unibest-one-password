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
  <view class="px-6 pt-safe">
    <Header title="智能密码生成器" fixed :show-left="false" />
    <PasswordGenerator />
  </view>
</template>

<style scoped></style>

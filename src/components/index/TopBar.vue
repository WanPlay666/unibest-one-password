<script lang="ts" setup>
defineOptions({
  name: 'TopBar',
})
// 定义事件
const emit = defineEmits<{
  add: []
  lock: []
}>()

const { safeAreaInsets } = uni.getSystemInfoSync()

function handleAdd() {
  emit('add')
}

function handleLock() {
  emit('lock')
}
</script>

<template>
  <view class="flex items-center justify-start pb-2" :style="{ paddingTop: `${safeAreaInsets.top}px` }">
    <!-- 添加按钮 -->
    <view
      class="mr-6 h-12 w-12 flex items-center justify-center b-1 border-white/10 rounded-full b-solid bg-blue-500 active:bg-blue-600"
      @tap="handleAdd"
    >
      <view class="i-carbon-add text-6 text-white" />
    </view>

    <!-- 锁定按钮 -->
    <view
      class="h-12 w-12 flex items-center justify-center b-1 border-white/10 rounded-full b-solid bg-dark-card active:bg-gray-700"
      @tap="handleLock"
    >
      <view class="i-carbon-locked text-6 text-dark-text" />
    </view>
  </view>
</template>

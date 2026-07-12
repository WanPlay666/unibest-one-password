<script lang="ts" setup>
import Header from '@/components/Header.vue'
import { CATEGORY_MAP, CATEGORY_ROUTE_MAP } from '@/utils/config' // 引入配置
import { safeAreaInsets } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
  },
})

function handleClose() {
  uni.navigateBack()
}

function handleCategorySelect(item: any) {
  // 从统一配置中获取路径
  const basePath = CATEGORY_ROUTE_MAP[String(item.id)]

  if (!basePath) {
    uni.showToast({ title: '配置缺失', icon: 'none' })
    return
  }

  // 拼接参数跳转
  const url = `${basePath}?id=${item.id}&title=${item.title}`
  uni.navigateTo({ url })
}
</script>

<template>
  <view class="pt-safe" :style="{ paddingTop: `${safeAreaInsets?.top}px` }">
    <Header title="选择分类" fixed :show-left="false" />

    <view class="grid grid-cols-3 mt-10 content-start gap-x-4 gap-y-12 px-5">
      <view
        v-for="item in CATEGORY_MAP" :key="item.title" class="flex flex-col items-center"
        @click="handleCategorySelect(item)"
      >
        <view
          :class="item.color"
          class="h-16 w-16 flex items-center justify-center rounded-[22px] shadow-black/40 shadow-lg transition-all active:scale-95 active:brightness-90"
        >
          <view :class="item.icon" class="text-2xl text-white" />
        </view>

        <text class="mt-3 text-sm text-white font-medium tracking-wide">
          {{ item.title }}
        </text>
      </view>
    </view>

    <view class="mt-18 flex justify-center">
      <view
        class="right-4 h-18 w-18 flex items-center justify-center rounded-full bg-white/10 transition-transform active:scale-90"
        @click="handleClose"
      >
        <view class="i-carbon-close text-lg text-white/70" />
      </view>
    </view>
  </view>
</template>

<style scoped>
.grid {
  display: grid;
}
</style>

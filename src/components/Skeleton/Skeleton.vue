<script lang="ts" setup>
/**
 * 骨架屏组件:用于数据解密/加载时的占位,避免页面跳动。
 *
 *  - variant="row"  列表行(对应 FavoriteList 行)
 *  - variant="card" 分类方块(对应 CategoryGrid 卡片)
 *  - count          占位元素数量
 */
interface Props {
  variant?: 'row' | 'card'
  count?: number
}

withDefaults(defineProps<Props>(), {
  variant: 'row',
  count: 5,
})
</script>

<template>
  <!-- row:列表行形态 -->
  <view v-if="variant === 'row'" class="flex flex-col gap-3">
    <view v-for="i in count" :key="i" class="flex animate-pulse items-center gap-3 rounded-[16px] bg-[#1A1A1A] px-3 py-3">
      <view class="h-12 w-12 shrink-0 rounded-2xl bg-white/10" />
      <view class="flex flex-1 flex-col gap-2">
        <view class="h-3 w-1/3 rounded bg-white/10" />
        <view class="h-2 w-1/2 rounded bg-white/5" />
      </view>
    </view>
  </view>

  <!-- card:分类网格形态 -->
  <view v-else class="grid grid-cols-3 gap-2">
    <view v-for="i in count" :key="i" class="flex aspect-square animate-pulse flex-col items-center justify-center rounded-[18px] bg-[#1A1A1A]">
      <view class="mb-2 h-10 w-10 rounded-full bg-white/10" />
      <view class="h-2 w-10 rounded bg-white/5" />
    </view>
  </view>
</template>

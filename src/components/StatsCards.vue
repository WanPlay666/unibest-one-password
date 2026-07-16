<script setup lang="ts">
/**
 * 首页统计卡:3 列紧凑数据条,展示核心数据指标。
 * 数据由父组件计算后传入,本组件只负责展示。
 */
defineProps<{
  total: number
  thisMonth: number
  usedCategories: number
}>()
</script>

<template>
  <view class="grid grid-cols-3 gap-2">
    <!-- 总记录 -->
    <view class="flex items-center gap-2 rounded-[14px] bg-[#1A1A1A] px-3 py-2.5">
      <view class="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-blue-600/90">
        <view class="text-base text-white i-carbon-document" />
      </view>
      <view class="flex min-w-0 flex-col">
        <text class="truncate text-lg text-white font-bold leading-none">{{ total }}</text>
        <text class="mt-1 text-[10px] text-[#777]">总记录</text>
      </view>
    </view>

    <!-- 本月新增 -->
    <view class="flex items-center gap-2 rounded-[14px] bg-[#1A1A1A] px-3 py-2.5">
      <view class="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-emerald-500/90">
        <view class="text-base text-white i-carbon-calendar-add" />
      </view>
      <view class="flex min-w-0 flex-col">
        <text class="truncate text-lg text-white font-bold leading-none">{{ thisMonth }}</text>
        <text class="mt-1 text-[10px] text-[#777]">本月新增</text>
      </view>
    </view>

    <!-- 已用分类 -->
    <view class="flex items-center gap-2 rounded-[14px] bg-[#1A1A1A] px-3 py-2.5">
      <view class="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-violet-500/90">
        <view class="text-base text-white i-carbon-folder" />
      </view>
      <view class="flex min-w-0 flex-col">
        <text class="truncate text-lg text-white font-bold leading-none">{{ usedCategories }}</text>
        <text class="mt-1 text-[10px] text-[#777]">已用分类</text>
      </view>
    </view>
  </view>
</template>

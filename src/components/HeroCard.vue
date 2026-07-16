<script setup lang="ts">
/**
 * 首页 Hero 卡片:渐变背景,展示保险箱核心数据(总记录 / 收藏 / 已用分类)。
 * 用光晕做柔和装饰,避免单色平铺的廉价感。
 */
defineProps<{
  total: number
  favorites: number
  usedCategories: number
}>()
</script>

<template>
  <view
    class="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-5 py-4">
    <!-- 装饰光晕:右上 + 左下,营造柔和质感 -->
    <view class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
    <view class="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5 blur-xl" />

    <!-- 标题行 -->
    <view class="relative flex items-center gap-1.5">
      <text class="text-sm text-white/85">保险箱</text>
    </view>

    <!-- 主数字:总记录 -->
    <view class="relative mt-2 flex items-end gap-1.5">
      <text class="text-4xl text-white font-bold leading-none tracking-tight">{{ total }}</text>
      <text class="mb-1 text-sm text-white/70">条记录</text>
    </view>

    <!-- 副数据:收藏 / 已用分类 -->
    <view class="relative mt-4 flex items-center">
      <view class="flex items-center gap-1.5">
        <text class="text-lg text-white font-bold leading-none">{{ favorites }}</text>
        <text class="text-[11px] text-white/55">收藏</text>
      </view>
      <view class="mx-4 h-4 w-px bg-white/15" />
      <view class="flex items-center gap-1.5">
        <text class="text-lg text-white font-bold leading-none">{{ usedCategories }}</text>
        <text class="text-[11px] text-white/55">分类</text>
      </view>
    </view>
  </view>
</template>

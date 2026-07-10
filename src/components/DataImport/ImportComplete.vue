<script lang="ts" setup>
import { THEME } from './constants'

export interface ImportResult {
  added: number
  overwritten: number
  skipped: number
  total: number
}

interface Props {
  result: ImportResult | null
}

defineProps<Props>()

const emit = defineEmits<{
  reset: []
  finish: []
}>()
</script>

<template>
  <view class="rounded-[28px] border border-white/5 bg-[#111111] p-6 text-center">
    <view class="i-carbon-checkmark-filled mx-auto mb-4 text-6xl text-emerald-400" />
    <text class="mb-2 block text-lg text-white font-bold">导入完成</text>
    <text class="mb-6 block text-[12px] text-gray-400">数据已合并到本地保险箱</text>

    <view v-if="result" class="mb-6 grid grid-cols-3 gap-3 text-center">
      <view class="rounded-[16px] bg-emerald-500/10 py-4">
        <text class="block text-2xl text-emerald-400 font-bold">{{ result.added }}</text>
        <text class="text-[10px] text-emerald-300/70">新增</text>
      </view>
      <view class="rounded-[16px] bg-amber-500/10 py-4">
        <text class="block text-2xl text-amber-400 font-bold">{{ result.overwritten }}</text>
        <text class="text-[10px] text-amber-300/70">覆盖</text>
      </view>
      <view class="rounded-[16px] bg-white/5 py-4">
        <text class="block text-2xl text-gray-300 font-bold">{{ result.skipped }}</text>
        <text class="text-[10px] text-gray-500">跳过</text>
      </view>
    </view>

    <view class="flex gap-3">
      <view
        class="flex-1 rounded-[18px] border border-white/10 bg-white/5 py-3 text-center text-sm text-white font-bold"
        @tap="emit('reset')">再导一次</view>
      <view class="flex-1 rounded-[18px] py-3 text-center text-sm text-white font-bold"
        :style="{ backgroundColor: THEME }" @tap="emit('finish')">完成</view>
    </view>
  </view>
</template>

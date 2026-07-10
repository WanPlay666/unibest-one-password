<script lang="ts" setup>
import { getTypeMeta } from './helpers'
import type { DupAction, ItemWithDup } from '@/utils/importSchema'

interface Props {
  entries: ItemWithDup[]
}

defineProps<Props>()

const emit = defineEmits<{
  'set-all': [action: 'skip' | 'overwrite' | 'keep-both']
  'set-entry-action': [index: number, action: DupAction]
}>()

function handleSetAll(action: 'skip' | 'overwrite' | 'keep-both') {
  emit('set-all', action)
}

function handleSetEntry(index: number, action: DupAction) {
  emit('set-entry-action', index, action)
}
</script>

<template>
  <view>
    <view class="mb-4 rounded-[24px] border border-white/5 bg-[#111111] p-5">
      <text class="mb-2 block text-sm text-white font-bold">为每条重复项选择处理方式</text>
      <text class="text-[10px] text-gray-500">默认「跳过」;非重复项会自动「都保留」</text>
      <view class="mt-3 flex gap-2">
        <view class="flex-1 rounded-[12px] bg-white/5 py-2 text-center text-[11px] text-white font-bold transition-colors active:bg-white/10"
          hover-class="bg-white/10" @tap="handleSetAll('skip')">全部跳过</view>
        <view class="flex-1 rounded-[12px] bg-white/5 py-2 text-center text-[11px] text-white font-bold transition-colors active:bg-white/10"
          hover-class="bg-white/10" @tap="handleSetAll('overwrite')">全部覆盖</view>
        <view class="flex-1 rounded-[12px] bg-white/5 py-2 text-center text-[11px] text-white font-bold transition-colors active:bg-white/10"
          hover-class="bg-white/10" @tap="handleSetAll('keep-both')">全部保留</view>
      </view>
    </view>

    <view class="space-y-2">
      <view v-for="(entry, i) in entries" :key="entry.item.id" class="rounded-[20px] border border-white/5 bg-[#111111] p-4"
        :class="entry.matchedLocalId ? 'border-amber-500/20' : ''">
        <view class="mb-3 flex items-center">
          <view class="mr-2 h-8 w-8 flex items-center justify-center rounded-full"
            :class="getTypeMeta(entry.item.type).color">
            <view class="text-sm text-white" :class="getTypeMeta(entry.item.type).icon" />
          </view>
          <view class="flex-1 overflow-hidden">
            <text class="block truncate text-[13px] text-white font-medium">{{ entry.item.name }}</text>
            <text class="block truncate text-[10px] text-gray-500">{{ entry.item.account || '—' }}</text>
          </view>
          <text v-if="entry.matchedLocalId"
            class="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] text-amber-300 font-bold">重复</text>
          <text v-else
            class="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] text-emerald-300 font-bold">新增</text>
        </view>

        <view class="flex gap-2">
          <view class="flex-1 rounded-[12px] py-2 text-center text-[11px] font-bold transition-colors"
            :class="entry.dupAction === 'skip' ? 'bg-white text-black' : 'bg-white/5 text-gray-400'"
            hover-class="opacity-80" @tap="handleSetEntry(i, 'skip')">跳过</view>
          <view class="flex-1 rounded-[12px] py-2 text-center text-[11px] font-bold transition-colors"
            :class="entry.dupAction === 'overwrite' ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400'"
            hover-class="opacity-80" @tap="handleSetEntry(i, 'overwrite')">覆盖</view>
          <view class="flex-1 rounded-[12px] py-2 text-center text-[11px] font-bold transition-colors"
            :class="entry.dupAction === 'keep-both' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-400'"
            hover-class="opacity-80" @tap="handleSetEntry(i, 'keep-both')">都保留</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.space-y-2>view+view {
  margin-top: 8px;
}
</style>

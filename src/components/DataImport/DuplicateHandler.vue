<script lang="ts" setup>
import { computed } from 'vue'
import { getTypeMeta } from './helpers'
import type { DupAction, ItemWithDup } from '@/utils/importSchema'

interface Props {
  entries: ItemWithDup[]
  dupCount: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'set-all': [action: 'skip' | 'overwrite' | 'keep-both']
  'set-entry-action': [index: number, action: DupAction]
}>()

const newCount = computed(() => props.entries.length - props.dupCount)
const hasDup = computed(() => props.dupCount > 0)

function handleSetAll(action: 'skip' | 'overwrite' | 'keep-both') {
  emit('set-all', action)
}

function handleSetEntry(index: number, action: DupAction) {
  emit('set-entry-action', index, action)
}
</script>

<template>
  <view>
    <view v-if="hasDup" class="mb-4 rounded-[24px] border border-white/5 bg-[#111111] p-5">
      <text class="mb-2 block text-sm text-white font-bold">为每条重复项选择处理方式</text>
      <text class="text-[10px] text-gray-500">共 {{ entries.length }} 条,其中 {{ dupCount }} 条与本地重复,{{ newCount }}
        条将作为新增</text>
      <view class="mt-3 flex gap-2">
        <button
          class="btn-reset flex-1 rounded-[12px] bg-white/5 py-2 text-[10px] box-border text-white font-bold text-center transition-colors active:bg-white/10"
          hover-class="bg-white/10" @tap="handleSetAll('skip')">全部跳过</button>
        <button
          class="btn-reset flex-1 rounded-[12px] bg-white/5 py-2 text-[10px] box-border text-white font-bold text-center transition-colors active:bg-white/10"
          hover-class="bg-white/10" @tap="handleSetAll('overwrite')">全部覆盖</button>
        <button
          class="btn-reset flex-1 rounded-[12px] bg-white/5 py-2 text-[10px] box-border text-white font-bold text-center transition-colors active:bg-white/10"
          hover-class="bg-white/10" @tap="handleSetAll('keep-both')">全部保留</button>
      </view>
    </view>
    <view v-else class="mb-4 rounded-[24px] border border-emerald-500/20 bg-emerald-500/5 p-5">
      <view class="mb-1 flex items-center">
        <view class="i-carbon-checkmark-outline mr-2 text-lg text-emerald-400" />
        <text class="text-sm text-emerald-200 font-bold">没有重复项</text>
      </view>
      <text class="text-[10px] text-emerald-300/70">共 {{ entries.length }} 条全部为新增,可直接点击底部「确认导入」</text>
    </view>

    <view class="space-y-2">
      <view v-for="(entry, i) in entries" :key="entry.item.id"
        class="rounded-[20px] border border-white/5 bg-[#111111] p-4"
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

        <view v-if="entry.matchedLocalId" class="flex gap-2">
          <button class="btn-reset flex-1 rounded-[12px] py-2 text-[10px] font-bold text-center transition-colors"
            :class="entry.dupAction === 'skip' ? 'bg-white text-black' : 'bg-white/5 text-gray-400'"
            hover-class="opacity-80" @tap="handleSetEntry(i, 'skip')">跳过</button>
          <button class="btn-reset flex-1 rounded-[12px] py-2 text-[10px] font-bold text-center transition-colors"
            :class="entry.dupAction === 'overwrite' ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400'"
            hover-class="opacity-80" @tap="handleSetEntry(i, 'overwrite')">覆盖</button>
          <button class="btn-reset flex-1 rounded-[12px] py-2 text-[10px] font-bold text-center transition-colors"
            :class="entry.dupAction === 'keep-both' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-400'"
            hover-class="opacity-80" @tap="handleSetEntry(i, 'keep-both')">保留</button>
        </view>
        <view v-else class="rounded-[12px] bg-emerald-500/10 py-2 text-center text-[10px] text-emerald-300 font-bold">
          将作为新增导入
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

<style>
/* 微信小程序 button 默认有 border / padding-left/right / margin 以及 ::after 伪元素边框,需要重置
   注意:不能用 padding: 0 (shorthand),否则会把 py-* 工具类也清掉 */
.btn-reset {
  border: 0;
  padding-left: 0;
  padding-right: 0;
  margin: 0;
  line-height: 1.2;
}

.btn-reset::after {
  border: 0;
}
</style>

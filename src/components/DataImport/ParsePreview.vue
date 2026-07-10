<script lang="ts" setup>
import { formatSize, getTypeMeta } from './helpers'
import type { ItemWithDup, ParseResult } from '@/utils/importSchema'

interface Props {
  fileName: string
  fileSize: number
  typeStats: Record<string, number>
  entries: ItemWithDup[]
  parseResult: ParseResult | null
  newCount: number
  dupCount: number
  invalidCount: number
}

defineProps<Props>()
</script>

<template>
  <view>
    <view class="mb-4 rounded-[24px] border border-white/5 bg-[#111111] p-5">
      <view class="mb-3 flex items-center justify-between">
        <text class="text-sm text-white font-bold">{{ fileName }}</text>
        <text class="text-[10px] text-gray-500">{{ formatSize(fileSize) }}</text>
      </view>
      <view class="grid grid-cols-3 gap-3 text-center">
        <view class="rounded-[16px] bg-emerald-500/10 py-3">
          <text class="block text-xl text-emerald-400 font-bold">{{ newCount }}</text>
          <text class="text-[10px] text-emerald-300/70">新增</text>
        </view>
        <view class="rounded-[16px] bg-amber-500/10 py-3">
          <text class="block text-xl text-amber-400 font-bold">{{ dupCount }}</text>
          <text class="text-[10px] text-amber-300/70">重复</text>
        </view>
        <view class="rounded-[16px] bg-red-500/10 py-3">
          <text class="block text-xl text-red-400 font-bold">{{ invalidCount }}</text>
          <text class="text-[10px] text-red-300/70">无效</text>
        </view>
      </view>
    </view>

    <view v-if="Object.keys(typeStats).length" class="mb-4 rounded-[24px] border border-white/5 bg-[#111111] p-5">
      <text class="mb-3 block text-[12px] text-gray-400 font-bold">按类型分布</text>
      <view class="flex flex-wrap gap-2">
        <view v-for="(count, type) in typeStats" :key="type" class="flex items-center rounded-full px-3 py-1.5"
          :class="getTypeMeta(type).color + '/30'">
          <view class="mr-1.5 text-base text-white" :class="getTypeMeta(type).icon" />
          <text class="text-[10px] text-white font-bold">{{ getTypeMeta(type).title }}</text>
          <text class="ml-1.5 text-[10px] text-white/80 font-mono">×{{ count }}</text>
        </view>
      </view>
    </view>

    <view v-if="invalidCount > 0" class="mb-4 rounded-[24px] border border-red-500/20 bg-red-500/5 p-5">
      <view class="mb-2 flex items-center">
        <view class="i-carbon-warning-alt mr-2 text-lg text-red-400" />
        <text class="text-sm text-red-300 font-bold">{{ invalidCount }} 条无法识别</text>
      </view>
      <view v-for="(inv, i) in parseResult?.invalid" :key="i"
        class="mt-2 border-t border-red-500/10 pt-2 first:mt-0 first:border-t-0 first:pt-0">
        <text class="text-[11px] text-red-200/80">{{ inv.reason }}</text>
      </view>
    </view>

    <view class="rounded-[24px] border border-white/5 bg-[#111111] p-5">
      <text class="mb-2 block text-[12px] text-gray-400 font-bold">有效记录预览 (前 5 条)</text>
      <view v-if="entries.length === 0" class="py-6 text-center">
        <view class="i-carbon-document-blank mx-auto mb-2 text-3xl text-gray-600" />
        <text class="text-[12px] text-gray-500">没有可识别的有效记录</text>
        <text class="mt-1 block text-[10px] text-gray-600">请检查 JSON 格式与 type 字段</text>
      </view>
      <view v-for="(entry, i) in entries.slice(0, 5)" :key="i"
        class="flex items-center py-2 border-t border-white/5 first:border-t-0">
        <view class="mr-2 h-8 w-8 flex items-center justify-center rounded-full"
          :class="getTypeMeta(entry.item.type).color">
          <view class="text-sm text-white" :class="getTypeMeta(entry.item.type).icon" />
        </view>
        <view class="flex-1 overflow-hidden">
          <text class="block truncate text-[12px] text-white font-medium">{{ entry.item.name }}</text>
          <text class="block truncate text-[10px] text-gray-500">{{ entry.item.account || '—' }}</text>
        </view>
        <text v-if="entry.matchedLocalId"
          class="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] text-amber-300 font-bold">重复</text>
        <text v-else
          class="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] text-emerald-300 font-bold">新增</text>
      </view>
      <text v-if="entries.length > 5" class="mt-2 block text-center text-[10px] text-gray-600">
        还有 {{ entries.length - 5 }} 条 ...
      </text>
    </view>
  </view>
</template>

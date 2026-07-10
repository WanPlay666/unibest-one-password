<script lang="ts" setup>
import { THEME } from './constants'
import { TYPE_LIST } from '@/utils/importSchema'

const emit = defineEmits<{
  'open-paste': []
  'open-template': []
}>()
</script>

<template>
  <view class="rounded-[28px] border border-white/5 bg-[#111111] p-6">
    <view class="mb-4 flex items-center">
      <view class="i-carbon-document-import mr-3 text-xl" :style="{ color: THEME }" />
      <text class="text-sm text-white ">粘贴JSON导入</text>
    </view>
    <text class="mb-6 block text-[11px] leading-relaxed text-gray-500">
      将本应用导出的 JSON 粘贴到下方文本框,自动按 type 归类,失败项会单独列出。
    </text>

    <view class="mb-3 flex items-center justify-center gap-2 overflow-hidden rounded-[18px] py-3"
      :style="{ backgroundColor: THEME }" @tap="emit('open-paste')">
      <view class="i-carbon-text-annotation-toggle text-base text-black" />
      <text class="text-sm text-black ">粘贴 JSON 内容</text>
    </view>

    <view class="flex items-center justify-center gap-1 rounded-[16px] border border-white/10 bg-white/5 py-2.5"
      @tap="emit('open-template')">
      <view class="i-carbon-view text-base text-white" />
      <text class="text-sm text-white font-bold">查看示例</text>
    </view>

    <view class="mt-6 rounded-[16px] border border-white/5 bg-black/30 p-4">
      <text class="mb-2 block text-[10px] text-gray-500 font-bold">支持的 type 字段值</text>
      <view class="flex flex-wrap gap-2">
        <view v-for="t in TYPE_LIST" :key="t.type" class="rounded-full px-2 py-0.5 text-[10px] font-mono"
          :class="t.color + ' text-white'">
          {{ t.type }}
        </view>
      </view>
    </view>
  </view>
</template>

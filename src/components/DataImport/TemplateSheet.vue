<script lang="ts" setup>
import { THEME } from './constants'

interface Props {
  show: boolean
  template: string
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  copy: []
  use: []
}>()
</script>

<template>
  <view v-if="show" class="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60" @click="emit('close')">
    <view class="flex w-full max-h-[85vh] flex-col rounded-t-3xl bg-[#1A1A1A] px-5 pb-10 pt-6" @click.stop>
      <text class="mb-1 block text-center text-lg text-white font-bold">导入模版示例</text>
      <text class="mb-4 block text-center text-sm text-gray-500">覆盖 9 种 type 的字段结构,可作为填写参考</text>

      <scroll-view scroll-y class="mb-4 box-border rounded-[16px] border border-white/10 bg-[#050508] p-2"
        style="height: 50vh; min-height: 280px;">
        <text class="whitespace-pre-wrap text-[11px] text-blue-400 font-mono">{{ template }}</text>
      </scroll-view>

      <view class="flex flex-row gap-2">
        <button
          class="flex-1 rounded-[18px] border-none bg-white/10 py-3 text-sm text-gray-300 font-bold active:scale-[0.97]"
          @click="emit('copy')">
          复制全文
        </button>
        <button class="flex-1 rounded-[18px] border-none py-3 text-sm text-white font-bold active:scale-[0.97]"
          :style="{ backgroundColor: THEME }" @click="emit('use')">
          体验导入
        </button>
      </view>
    </view>
  </view>
</template>

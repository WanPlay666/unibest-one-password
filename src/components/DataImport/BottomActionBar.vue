<script lang="ts" setup>
import { THEME } from './constants'

interface Props {
  step: number
  validCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  reset: []
  prev: []
  next: []
  commit: []
}>()
</script>

<template>
  <view v-if="step !== 4"
    class="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-[#050508]/95 backdrop-blur px-5 pb-safe pt-3">
    <view v-if="step === 1" class="py-2 text-center text-[11px] text-gray-600">
      点击上方按钮粘贴 JSON 或查看示例
    </view>
    <view v-else-if="step === 2" class="flex gap-3">
      <view
        class="flex-1 rounded-[18px] border border-white/10 bg-white/5 py-3 text-center text-sm text-white font-bold"
        @tap="emit('reset')">取消</view>
      <view class="flex-1 rounded-[18px] py-3 text-center text-sm text-white font-bold"
        :class="validCount === 0 ? 'opacity-40' : ''" :style="{ backgroundColor: THEME }" @tap="emit('next')">
        下一步
      </view>
    </view>
    <view v-else-if="step === 3" class="flex gap-3">
      <view
        class="flex-1 rounded-[18px] border border-white/10 bg-white/5 py-3 text-center text-sm text-white font-bold"
        @tap="emit('prev')">上一步</view>
      <view class="flex-1 rounded-[18px] py-3 text-center text-sm text-white font-bold"
        :style="{ backgroundColor: THEME }" @tap="emit('commit')">确认导入</view>
    </view>
  </view>
</template>

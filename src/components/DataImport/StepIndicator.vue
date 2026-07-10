<script lang="ts" setup>
import { THEME, STEP_LABELS } from './constants'

interface Props {
  step: number
  labels?: string[]
}

withDefaults(defineProps<Props>(), {
  labels: () => STEP_LABELS,
})
</script>

<template>
  <view class="mb-6 flex items-start justify-between">
    <view v-for="(label, idx) in labels" :key="idx"
      class="relative flex flex-1 min-w-0 flex-col items-center">
      <view class="mb-1.5 h-7 w-7 flex items-center justify-center rounded-full text-xs font-bold"
        :class="[
          step === idx + 1 ? 'ring-2 ring-offset-2 ring-offset-[#050508]' : '',
          step > idx + 1
            ? 'text-white'
            : step === idx + 1
              ? 'text-white'
              : 'bg-white/10 text-gray-500',
        ]"
        :style="step > idx + 1 || step === idx + 1
          ? { backgroundColor: THEME, ...(step === idx + 1 ? { '--tw-ring-color': THEME } : {}) }
          : {}">
        <text v-if="step > idx + 1" class="text-base leading-none">✓</text>
        <text v-else>{{ idx + 1 }}</text>
      </view>
      <text class="text-center text-sm leading-tight"
        :style="step >= idx + 1 ? { color: THEME } : {}"
        :class="step >= idx + 1 ? '' : 'text-gray-600'">
        {{ label }}
      </text>
      <view v-if="idx < labels.length - 1" class="absolute left-1/2 right-[-50%] top-3.5 -z-10 h-px"
        :style="{ backgroundColor: step > idx + 1 ? THEME : 'rgba(255,255,255,0.1)' }" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  bgColor: string
  icon: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})
</script>

<template>
  <view class="flex items-center gap-4 border border-white/5 rounded-[24px] bg-[#111111] p-2 shadow-sm">
    <view class="h-14 w-14 flex items-center justify-center rounded-[18px] shadow-black/40 shadow-lg" :class="bgColor">
      <view :class="icon" class="text-3xl text-white" />
    </view>
    <view class="flex-1">
      <input
        v-model="localValue" type="text" class="h-10 px-2 text-xl text-white font-bold" placeholder="输入名称"
        placeholder-class="text-gray-600"
      >
    </view>
  </view>
</template>

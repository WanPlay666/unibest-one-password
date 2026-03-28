<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  icon?: string
  placeholder?: string
}>(), {
  icon: 'i-carbon-notebook', // 默认图标
  placeholder: '记录名称',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})
</script>

<template>
  <view class="mb-6 flex items-center gap-3">
    <view
      class="h-12 w-12 flex shrink-0 items-center justify-center border border-blue-500/30 rounded-[16px] bg-blue-500/10 transition-colors"
    >
      <view :class="icon" class="text-xl text-blue-500" />
    </view>

    <view
      class="h-12 flex flex-1 items-center border border-white/5 rounded-[16px] bg-[#1A1A1A] px-4 transition-colors focus-within:border-blue-500/50"
    >
      <input
        v-model="localValue" type="text" class="h-full flex-1 text-[15px] text-white" :placeholder="placeholder"
        placeholder-class="text-[#555555]"
      >
    </view>
  </view>
</template>

<style scoped>
input {
  background: transparent;
  outline: none;
  min-height: auto;
}
</style>

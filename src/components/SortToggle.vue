<script setup lang="ts">
/**
 * 单图标排序切换:点击在 latest / earliest 间切换。
 * 图标方向即当前排序方向(↓ 最新在上 / ↑ 最早在上)。
 */
type SortOrder = 'latest' | 'earliest'

const props = defineProps<{
  modelValue: SortOrder
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: SortOrder): void
}>()

function toggle() {
  emit('update:modelValue', props.modelValue === 'latest' ? 'earliest' : 'latest')
}
</script>

<template>
  <view
    class="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 transition-transform active:scale-90"
    @tap="toggle"
  >
    <view
      class="text-base text-white transition-transform"
      :class="modelValue === 'latest' ? 'i-carbon-sort-descending' : 'i-carbon-sort-ascending'"
    />
  </view>
</template>

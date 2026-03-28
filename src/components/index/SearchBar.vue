<script lang="ts" setup>
defineOptions({
  name: 'SearchBar',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '搜索名称/账号/分类',
  align: 'fill',
  width: 'auto',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
}>()

interface Props {
  modelValue?: string
  placeholder?: string
  // 布局模式：'left' (靠左), 'right' (靠右), 'fill' (铺满胶囊左侧剩余空间)
  align?: 'left' | 'right' | 'fill'
  // 自定义宽度 (仅在 left/right 模式生效)
  width?: string
}

let timer: ReturnType<typeof setTimeout> | null = null
function onInput(e: any) {
  const value = e.detail.value
  emit('update:modelValue', value)
  if (timer)
    clearTimeout(timer)
  timer = setTimeout(() => {
    emit('search', value)
    timer = null
  }, 300)
}
</script>

<template>
  <view
    class="search-container relative flex items-center border-1 border-white/10 rounded-full border-solid bg-[#1A1A1A] px-3 transition-all"
    :class="[
      align === 'left' ? 'mr-auto' : '',
      align === 'right' ? 'ml-auto' : '',
    ]" :style="{ height: `44px` }"
  >
    <view class="i-carbon-search mr-2 size-[18px] flex-shrink-0 text-[#555555]" />
    <input
      :value="modelValue" class="h-full flex-1 text-[14px] text-white" :placeholder="placeholder"
      placeholder-class="text-[#555555]" type="text" confirm-type="search" @input="onInput"
    >
  </view>
</template>

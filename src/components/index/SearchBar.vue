<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref } from 'vue'

defineOptions({
  name: 'SearchBar',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '搜索名称/账号/分类',
  align: 'fill',
  width: 'auto',

  fixed: false,
  offsetTop: 0,
  zIndex: 998, // 默认比 Header (通常是 999) 低一层
  bgColor: '#050508', // 默认与页面背景色保持一致
  padding: '8px 24px', // 上下 8px，左右 24px
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
}>()

interface Props {
  // --- 业务层属性 (Search Logic) ---
  modelValue?: string
  placeholder?: string
  align?: 'left' | 'right' | 'fill'
  width?: string

  // --- 布局层属性 (Layout Logic) ---
  fixed?: boolean
  offsetTop?: number | string // 距离顶部的距离（比如用于避开 Header）
  zIndex?: number
  bgColor?: string // 悬浮时的背景色，防止内容穿透
  padding?: string // 外部容器内边距 (默认对应 px-6 py-2)
}

// --- 业务层逻辑：防抖输入 ---
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

// --- 布局层逻辑：动态计算占位高度 ---
const placeholderHeight = ref(52) // 默认预估高度 (36px input + 16px padding)
const instance = getCurrentInstance()

onMounted(() => {
  if (props.fixed) {
    // 动态获取实际渲染高度，确保占位块 1:1 还原，防止页面抖动
    uni.createSelectorQuery()
      .in(instance)
      .select('.search-fixed-wrapper')
      .boundingClientRect((res: any) => {
        if (res && res.height) {
          placeholderHeight.value = res.height
        }
      })
      .exec()
  }
})

// 工具函数：处理 px 单位
function getOffsetTop() {
  return typeof props.offsetTop === 'number' ? `${props.offsetTop}px` : props.offsetTop
}
</script>

<template>
  <view class="search-bar-container">
    <view
      class="search-fixed-wrapper box-border transition-colors duration-300"
      :class="[fixed ? 'fixed left-0 w-full' : 'relative w-full']" :style="{
        top: fixed ? getOffsetTop() : 'auto',
        zIndex: fixed ? zIndex : 'auto',
        backgroundColor: fixed ? bgColor : 'transparent',
        padding,
      }"
    >
      <view
        class="search-input-box relative box-border flex items-center border-1 border-white/10 rounded-full border-solid bg-[#1A1A1A] px-3 transition-all"
        :class="[
          align === 'left' ? 'mr-auto' : '',
          align === 'right' ? 'ml-auto' : '',
        ]" :style="{
          height: `40px`,
          width: width === 'auto' ? '100%' : width,
        }"
      >
        <view class="i-carbon-search mr-2 size-[18px] flex-shrink-0 text-[#555555]" />

        <input
          :value="modelValue" class="h-full flex-1 text-[14px] text-white" :placeholder="placeholder"
          placeholder-class="text-[#555555]" type="text" confirm-type="search" @input="onInput"
        >
      </view>
    </view>

    <view v-if="fixed" class="search-placeholder" :style="{ height: `${placeholderHeight}px` }" />
  </view>
</template>

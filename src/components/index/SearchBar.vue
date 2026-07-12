<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { useLayoutStore } from '@/store/layout'

defineOptions({
  name: 'SearchBar',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '搜索名称/账号/分类',
  align: 'fill',
  width: 'auto',
  fixed: false,
  // 0 = "自动从 layout store 读 Header 高度",也可手动覆盖
  offsetTop: 0,
  zIndex: 998, // 默认比 Header (通常是 999) 低一层
  bgColor: '#050508', // 默认与页面背景色保持一致
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
  /**
   * 距离顶部的距离(用于避开 fixed 元素,通常是 Header)。
   * - 不传(0):自动从 layout store 读 Header 高度(<Header> 在 mount 时写入)
   * - 显式值:手动覆盖
   */
  offsetTop?: number | string
  zIndex?: number
  bgColor?: string // 悬浮时的背景色，防止内容穿透
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
const layoutStore = useLayoutStore()
const placeholderHeight = ref(52) // 默认预估高度 (36px input + 16px padding)
const instance = getCurrentInstance()

/**
 * 实际 fixed 偏移 = (显式 prop ? prop : store.headerHeight) || 0
 * 用户不传 offsetTop 时,自动用 Header 的真实高度(由 <Header> 在 mount 时写入 store)。
 */
const effectiveOffsetTop = computed(() => {
  const propVal = typeof props.offsetTop === 'number'
    ? props.offsetTop
    : Number(props.offsetTop) || 0
  if (propVal > 0)
    return propVal
  return layoutStore.headerHeight || 0
})

const SEARCH_BAR_DEFAULT_HEIGHT = 52

onMounted(() => {
  if (!props.fixed)
    return

  // 初始占位:offsetTop + 搜索栏预估高度
  placeholderHeight.value = effectiveOffsetTop.value + SEARCH_BAR_DEFAULT_HEIGHT

  uni.createSelectorQuery()
    .in(instance)
    .select('.search-fixed-wrapper')
    .boundingClientRect((res: any) => {
      if (res && res.height)
        placeholderHeight.value = effectiveOffsetTop.value + res.height
    })
    .exec()
})

// 工具函数：处理 px 单位
function getOffsetTop() {
  const v = effectiveOffsetTop.value
  return typeof v === 'number' ? `${v}px` : v
}
</script>

<template>
  <view class="search-bar-container">
    <view class="search-fixed-wrapper box-border transition-colors  py-2 px-5"
      :class="[fixed ? 'fixed left-0 w-full' : 'relative w-full']" :style="{
        top: fixed ? getOffsetTop() : 'auto',
        zIndex: fixed ? zIndex : 'auto',
        backgroundColor: fixed ? bgColor : 'transparent',
      }">
      <view
        class="search-input-box relative box-border flex items-center border-1 border-white/10 rounded-full border-solid bg-[#1A1A1A] px-3 transition-all"
        :class="[
          align === 'left' ? 'mr-auto' : '',
          align === 'right' ? 'ml-auto' : '',
        ]" :style="{
          height: `40px`,
          width: width === 'auto' ? '100%' : width,
        }">
        <view class="i-carbon-search mr-2 size-[18px] flex-shrink-0 text-[#555555]" />

        <input :value="modelValue" class="h-full flex-1 text-[14px] text-white" :placeholder="placeholder"
          placeholder-class="text-[#555555]" type="text" confirm-type="search" @input="onInput">
      </view>
    </view>
    <view v-if="fixed" class="search-placeholder" :style="{ height: `56px` }" />
  </view>
</template>

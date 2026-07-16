<script lang="ts" setup>
import { computed } from 'vue'

interface DetailItem {
  label: string
  value: string
}

const props = defineProps<{
  show: boolean
  title?: string
  data: DetailItem[]
}>()

const emit = defineEmits(['close'])

/**
 * 拦截滚动穿透
 */
function preventTouchMove(e: any) {
  // 不做任何操作，单纯阻止冒泡和默认行为
  return
}

/**
 * 处理复制逻辑
 *  - 300ms 节流,防止快速重复点击触发两次 setClipboardData
 *  - toast 文字带 label,与 iOS 微信内置"已复制"系统提示区分开
 */
let copyDebounce: ReturnType<typeof setTimeout> | null = null
function handleCopy(item: DetailItem) {
  if (copyDebounce)
    return
  copyDebounce = setTimeout(() => { copyDebounce = null }, 300)

  if (!item.value)
    return
  uni.setClipboardData({
    data: item.value,
    success: () => {
      uni.showToast({ title: `${item.label}已复制`, icon: 'none' })
    },
  })
}

/**
 * 这是一个防御性计算属性，确保即使父组件传错数据，这里也不会崩溃
 */
const safeData = computed(() => {
  return Array.isArray(props.data) ? props.data : []
})
</script>

<template>
  <view
    class="fixed inset-0 z-[999] flex flex-col justify-end overflow-hidden transition-all duration-300" :style="{
      visibility: show ? 'visible' : 'hidden',
      pointerEvents: show ? 'auto' : 'none',
    }"
  >
    <view
      class="absolute inset-0 bg-black/80 transition-opacity duration-300 ease-in-out"
      :class="[show ? 'opacity-100' : 'opacity-0']" @touchmove.stop.prevent="preventTouchMove" @click="emit('close')"
    />

    <view
      class="sheet-content pb-safe-bottom relative flex flex-col border-t border-white/10 rounded-t-[32px] bg-[#1A1A1A] px-5 pt-6 transition-transform duration-300"
      :style="{
        height: '75vh',
        transform: show ? 'translateY(0)' : 'translateY(100%)',
      }" @touchmove.stop.prevent="preventTouchMove"
    >
      <text class="mb-6 block shrink-0 text-center text-lg text-white font-bold">
        {{ title }}
      </text>

      <scroll-view scroll-y class="flex-1 overflow-hidden" :scroll-top="show ? undefined : 0">
        <view v-if="safeData.length > 0" class="pb-6 space-y-4">
          <view
            v-for="(item, index) in safeData" :key="index"
            class="item-card flex items-center justify-between rounded-2xl bg-white/5 p-4 active:bg-white/10"
            @click="handleCopy(item)"
          >
            <view class="flex-1 overflow-hidden">
              <text class="mb-1 block text-xs text-gray-500">{{ item.label }}</text>
              <text class="block truncate pr-4 text-sm text-gray-200 font-mono">
                {{ item.value || '未填写' }}
              </text>
            </view>
            <view class="i-carbon-copy shrink-0 text-blue-400 opacity-60" />
          </view>
        </view>

        <view v-else class="py-20 text-center text-sm text-gray-600">
          暂无详情记录
        </view>
      </scroll-view>

      <view
        class="mb-6 mt-4 h-14 flex shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white font-bold active:opacity-70"
        @click="emit('close')"
      >
        关闭
      </view>
    </view>
  </view>
</template>

<style scoped>
.sheet-content {
  /* 使用苹果风格的缓动曲线，确保弹出更自然 */
  transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
  will-change: transform;
}

/* 兼容 UnoCSS/Tailwind 的间距控制 */
.space-y-4 > view + view {
  margin-top: 1rem;
}

.item-card {
  /* 确保在列表很长时，点击反馈依然流畅 */
  transition: background-color 0.2s;
}
</style>

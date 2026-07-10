<script lang="ts" setup>
import { computed } from 'vue'
import { safeAreaInsets, systemInfo } from '@/utils/systemInfo'

interface Props {
  title?: string
  bgColor?: string
  fixed?: boolean
  zIndex?: number
  showStatusBar?: boolean
  showLeft?: boolean // 新增：控制左侧区域显示
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  bgColor: '#050508',
  fixed: false,
  zIndex: 999,
  showStatusBar: true,
  showLeft: true, // 默认显示左侧返回按钮/插槽
})

const emit = defineEmits<{
  back: []
}>()

// 1. 获取顶部状态栏高度
const statusBarHeight = computed(() => safeAreaInsets?.top || 0)

/**
 * 2. 导航栏几何计算（增加兜底）
 */
const navInfo = computed(() => {
  let contentHeight = 44
  let sideWidth = 44

  // #ifdef MP-WEIXIN
  const menuButton = uni.getMenuButtonBoundingClientRect()
  // 增加判断：如果 menuButton 不存在或高度为 0，使用默认值
  if (menuButton && menuButton.height > 0) {
    const gap = menuButton.top - statusBarHeight.value
    contentHeight = menuButton.height + gap * 2
    sideWidth = (systemInfo.windowWidth - menuButton.left) + 8
  }
  // #endif

  return { contentHeight, sideWidth }
})

// 计算总占用高度（用于占位块）
const totalHeight = computed(() => {
  const top = props.showStatusBar ? statusBarHeight.value : 0
  return top + navInfo.value.contentHeight
})
</script>

<template>
  <view class="nav-container">
    <view :class="[fixed ? 'fixed top-0 left-0 w-full overflow-hidden' : 'relative overflow-hidden']" :style="{
      backgroundColor: bgColor,
      zIndex: props.zIndex,
      transition: 'background-color 0.3s',
    }">
      <view v-if="showStatusBar" :style="{ height: `${statusBarHeight}px` }" />

      <view class="flex items-center px-4" :style="{ height: `${navInfo.contentHeight}px` }">
        <view class="flex flex-none items-center justify-start" :style="{ width: `${navInfo.sideWidth}px` }">
          <template v-if="showLeft">
            <slot name="left">
              <view
                class="h-12 w-12 flex cursor-pointer items-center justify-center transition-opacity -ml-3 active:bg-[#1A1A1A]"
                @click="emit('back')">
                <view class="i-carbon-chevron-left text-2xl text-gray-300" />
              </view>
            </slot>
          </template>
        </view>

        <view class="min-w-0 flex flex-1 items-center justify-center overflow-hidden">
          <slot>
            <text class="truncate text-sm text-white font-bold tracking-wide">
              {{ title }}
            </text>
          </slot>
        </view>

        <view class="flex flex-none items-center justify-end" :style="{ width: `${navInfo.sideWidth}px` }">
          <slot name="right" />
        </view>
      </view>
    </view>

    <view v-if="fixed" :style="{ height: `${totalHeight}px` }" />
  </view>
</template>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

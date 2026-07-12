<script lang="ts" setup>
import { computed, ref } from 'vue'

interface ActionButton {
  text: string
  color?: string
  onClick: () => void
}

const props = withDefaults(defineProps<{
  actions: ActionButton[]
  disabled?: boolean
  btnWidth?: number
}>(), {
  btnWidth: 80,
})

const isOpened = ref(false)
const isDragging = ref(false) // 新增：拖拽状态
const offset = ref(0)
const startX = ref(0)
const startY = ref(0) // 新增：记录纵向起始点

const maxOffset = computed(() => props.actions.length * props.btnWidth)

function onTouchStart(e: TouchEvent) {
  if (props.disabled)
    return
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
  isDragging.value = true // 手指按下，取消过渡动画，实时跟手
}

function onTouchMove(e: TouchEvent) {
  if (props.disabled || !isDragging.value)
    return
  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  const deltaX = currentX - startX.value
  const deltaY = currentY - startY.value

  // 核心优化：防误触。如果上下滑动的幅度大于左右滑动，说明用户在滚动页面，直接放行
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    return
  }

  if (Math.abs(deltaX) > 5) {
    if (isOpened.value) {
      const move = -maxOffset.value + deltaX
      offset.value = move > 0 ? 0 : (move < -maxOffset.value ? -maxOffset.value : move)
    }
    else {
      if (deltaX < 0)
        offset.value = Math.max(deltaX, -maxOffset.value)
    }
  }
}

function onTouchEnd() {
  if (props.disabled)
    return
  isDragging.value = false // 手指松开，恢复过渡动画，顺滑回弹

  if (Math.abs(offset.value) > maxOffset.value / 3) {
    offset.value = -maxOffset.value
    isOpened.value = true
  }
  else {
    offset.value = 0
    isOpened.value = false
  }
}

function close() {
  offset.value = 0
  isOpened.value = false
}

defineExpose({ close })
</script>

<template>
  <view class="relative w-full overflow-hidden" :class="{ 'z-20': isOpened }">
    <view class="flex flex-nowrap" :class="{ 'transition-transform duration-250 ease-out': !isDragging }" :style="{
      transform: `translateX(${offset}px)`,
      width: `calc(100% + ${maxOffset}px)`,
    }" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
      <view class="relative flex-1 shrink-0 ">
        <slot />
        <!-- 菜单打开时，遮罩层拦截点击，只关闭菜单不触发内容事件（不阻止页面滚动） -->
        <view v-if="isOpened" class="absolute inset-0 z-10" @click.stop="close" />
      </view>

      <view class="flex shrink-0 items-stretch">
        <view v-for="(btn, i) in actions" :key="i"
          class="active:bg-white-10 flex items-center justify-center text-[11px] text-white font-medium" :style="{
            backgroundColor: btn.color || '#ff4d4f',
            width: `${btnWidth}px`,
          }" @click.stop="() => { btn.onClick(); close(); }">
          {{ btn.text }}
        </view>
      </view>
    </view>
  </view>
</template>

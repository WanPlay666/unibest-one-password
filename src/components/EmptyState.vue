<script lang="ts" setup>
interface Props {
  text?: string
  /** 上下内边距 (Tailwind 任意值) */
  pad?: string
}

withDefaults(defineProps<Props>(), {
  text: '暂无数据',
})
</script>

<template>
  <view :class="['text-center text-sm text-white/30 pt-30']">
    {{ text }}
  </view>
</template>

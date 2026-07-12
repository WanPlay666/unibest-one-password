<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useStorageInfo } from '@/composables/useStorageInfo'

const TOTAL_BYTES = 10 * 1024 * 1024

const { buckets, totalSize, lastUpdated, refresh, formatSize } = useStorageInfo()

onMounted(refresh)

const totalLabel = computed(() => formatSize(totalSize.value))
const scaleLabel = computed(() => `0 / ${formatSize(TOTAL_BYTES)}`)

const usedPercent = computed(() => {
  if (totalSize.value <= 0)
    return 0
  return Math.min(100, (totalSize.value / TOTAL_BYTES) * 100)
})

// 已用比例太小时(<2%)给个最小可见宽度,避免条完全看不见
const filledPercent = computed(() =>
  totalSize.value > 0 ? Math.max(usedPercent.value, 2) : 0,
)

const updatedLabel = computed(() => {
  if (!lastUpdated.value)
    return '尚未刷新'
  const d = new Date(lastUpdated.value)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

function percentOf(size: number): number {
  if (totalSize.value <= 0)
    return 0
  return Math.round((size / totalSize.value) * 100)
}

function flexOf(size: number): number {
  if (totalSize.value <= 0)
    return 0
  return Math.max(1, (size / totalSize.value) * 1000)
}
</script>

<template>
  <view class="overflow-hidden rounded-[32px] border border-white/5 bg-[#111111]">
    <view class="flex items-center justify-between px-6 pt-5 pb-4">
      <view class="flex flex-col">
        <text class="text-[11px] text-gray-400 tracking-widest">本地缓存</text>
        <text class="mt-1 text-3xl font-bold text-white tracking-tight">{{ totalLabel }}</text>
      </view>
      <view class="h-9 w-9 flex items-center justify-center rounded-full bg-white/5 active:bg-white/10" @tap="refresh">
        <view class="i-carbon-renew text-base text-gray-400" />
      </view>
    </view>

    <view class="px-6 pb-4">
      <!-- 单条进度条,刻度 10M;已用部分按比例填满,内部分两色堆叠 -->
      <view class="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
        <view v-if="totalSize > 0" class="flex h-full" :style="{ width: `${filledPercent}%` }">
          <view v-for="b in buckets" :key="b.id" class="h-full bg-gradient-to-r" :class="b.color"
            :style="{ flex: flexOf(b.size) }" />
        </view>
      </view>
      <view class="mt-1.5 flex justify-between">
        <text class="text-[11px] text-gray-400">已用 {{ usedPercent.toFixed(2) }}%</text>
        <text class="text-[11px] text-gray-400">{{ scaleLabel }}</text>
      </view>
    </view>

    <view class="border-t border-white/5 px-6 py-3">
      <view class="legend-row" v-for="b in buckets" :key="b.id">
        <view class="flex items-center">
          <view class="mr-3 h-3.5 w-3.5 rounded-md" :class="b.color" />
          <text class="text-[11px] text-white">{{ b.label }}</text>
        </view>
        <text class="text-[11px] text-gray-400">
          {{ formatSize(b.size) }} · {{ percentOf(b.size) }}%
        </text>
      </view>
    </view>

    <view class="border-t border-white/5 px-6 py-3">
      <text class="text-[11px] text-gray-400">最近更新 {{ updatedLabel }}</text>
    </view>
  </view>
</template>

<style scoped>
.legend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
}

.legend-row:last-child {
  padding-bottom: 0;
}
</style>

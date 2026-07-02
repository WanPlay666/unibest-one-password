<script lang="ts" setup>
import { ref } from 'vue'
import { CATEGORY_MAP } from '@/utils/config'
// 新增引入存储工具
import { getSecureStorage, setSecureStorage } from '@/utils/secureStorage'
import SwipeActionItem from './SwipeActionItem.vue'

interface Item {
  id: string | number
  name: string
  account: string
  categoryId: string | number
  isFavorite?: boolean
}

const props = defineProps<{ list: Item[] }>()

const emit = defineEmits<{
  (e: 'click', item: Item): void
  (e: 'edit', item: Item): void
  (e: 'delete', item: Item): void
  (e: 'refresh'): void // 通知父组件数据已变动（如需要重新过滤列表）
}>()

const activeIndex = ref<number | null>(null)

function getVisual(catId: string | number) {
  const cfg = CATEGORY_MAP[String(catId)]
  return { icon: cfg?.icon || 'i-carbon-document', color: cfg?.color || 'bg-gray-600' }
}

async function toggleFavorite(item: Item) {
  // 1. 直接修改引用属性，触发 UI 瞬时更新
  item.isFavorite = !item.isFavorite

  // 2. 业务逻辑提示
  uni.showToast({
    title: item.isFavorite ? '已加入收藏' : '已取消收藏',
    icon: 'none',
    duration: 1000,
  })

  // 🌟 4. 核心修复：在这里直接修改本地缓存
  try {
    const STORAGE_KEY = 'ENCRYPTED_VAULT'
    // 读取最新的本地数据
    const records = getSecureStorage(STORAGE_KEY) || []
    // 找到当前操作的这条数据
    const index = records.findIndex((r: any) => String(r.id) === String(item.id))

    if (index > -1) {
      // 更新该条目的收藏状态
      records[index].isFavorite = item.isFavorite
      // 重新写回本地缓存
      setSecureStorage(STORAGE_KEY, records)
    }
  }
  catch (error) {
    uni.showToast({ title: '缓存更新失败', icon: 'none' })
    // 如果保存失败，可以考虑把 UI 状态回滚
    item.isFavorite = !item.isFavorite
  }

  // 5. 通知外部（仅用于 UI 刷新，比如在“收藏夹”页面自动把取消收藏的项从视图移除）
  emit('refresh')
}

/**
 * 构造左滑操作组
 */
function getActions(item: Item) {
  return [
    {
      text: item.isFavorite ? '取消收藏' : '收藏',
      color: item.isFavorite ? '#4B5563' : '#3B82F6', // 灰色/蓝色区分
      onClick: () => toggleFavorite(item),
    },
    {
      text: '删除',
      color: '#EF4444',
      onClick: () => {
        uni.showModal({
          title: '安全确认',
          content: `确定删除“${item.name}”？`,
          confirmColor: '#EF4444',
          success: (res) => {
            if (res.confirm)
              emit('delete', item)
          },
        })
      },
    },
  ]
}

function handleTouchStart(index: number) { activeIndex.value = index }
function handleTouchEnd() { activeIndex.value = null }
</script>

<template>
  <view class="border-white-5 overflow-hidden border rounded-3xl bg-hex-121212">
    <SwipeActionItem v-for="(item, index) in list" :key="item.id" :actions="getActions(item)">
      <view
        class="flex items-center px-4 py-5" :class="[
          activeIndex === index ? 'bg-white-10' : 'bg-transparent',
          index !== list.length - 1 ? 'border-b border-white-5' : '',
        ]" @click="emit('click', item)"
      >
        <view class="relative shrink-0">
          <view
            class="h-12 w-12 flex items-center justify-center rounded-2xl"
            :class="[getVisual(item.categoryId).color]"
          >
            <view class="text-2xl text-white" :class="[getVisual(item.categoryId).icon]" />
          </view>

          <view
            v-if="item.isFavorite"
            class="absolute h-5 w-5 flex items-center justify-center border-2 border-hex-121212 rounded-full bg-hex-ffd700 -right-1 -top-1"
          >
            <view class="i-carbon-star-filled text-[10px] text-black" />
          </view>
        </view>

        <view class="ml-4 flex-1 overflow-hidden">
          <view class="truncate text-[15px] text-white font-medium">
            {{ item.name }}
          </view>
          <view class="mt-1 truncate text-[13px] text-gray-400 font-mono">
            {{ item.account }}
          </view>
        </view>

        <view class="relative z-10 p-3 -mr-2" @click.stop="emit('edit', item)">
          <view class="i-carbon-edit text-white-40 text-[18px] active:text-white" />
        </view>
      </view>
    </SwipeActionItem>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { CATEGORY_MAP } from '@/utils/config'
import { getSecureStorage, setSecureStorage } from '@/utils/secureStorage'
import { STORAGE_KEYS } from '@/utils/storageKeys'
import SwipeActionItem from './SwipeActionItem.vue'

interface Item {
  id: string | number
  name: string
  account: string
  categoryId: string | number
  isFavorite?: boolean
}

const STORAGE_KEY = STORAGE_KEYS.VAULT

defineProps<{ list: Item[] }>()

const emit = defineEmits<{
  (e: 'click', item: Item): void
  (e: 'edit', item: Item): void
  (e: 'delete', item: Item): void
  (e: 'refresh'): void
}>()

const activeIndex = ref<number | null>(null)

function getVisual(catId: string | number) {
  const cfg = CATEGORY_MAP[String(catId)]
  return { icon: cfg?.icon || 'i-carbon-document', color: cfg?.color || 'bg-gray-600' }
}

async function toggleFavorite(item: Item) {
  // 1. 先确定目标状态(不改 UI,等 storage 写回成功再改)
  const newState = !item.isFavorite

  // 2. 写回 storage
  try {
    const records = getSecureStorage(STORAGE_KEY) || []
    const index = records.findIndex((r: any) => String(r.id) === String(item.id))

    if (index === -1) {
      uni.showToast({ title: '记录不存在,无法更新收藏', icon: 'none' })
      return
    }

    records[index].isFavorite = newState
    const ok = setSecureStorage(STORAGE_KEY, records)
    if (!ok) {
      uni.showToast({ title: '收藏状态保存失败', icon: 'none' })
      return
    }

    // 3. storage 写回成功,才更新 UI
    item.isFavorite = newState
    uni.showToast({
      title: newState ? '已加入收藏' : '已取消收藏',
      icon: 'none',
      duration: 1000,
    })
  }
  catch (error) {
    uni.showToast({ title: '操作异常,请重试', icon: 'none' })
  }

  emit('refresh')
}

function getActions(item: Item) {
  return [
    {
      text: item.isFavorite ? '取消收藏' : '收藏',
      color: item.isFavorite ? '#4B5563' : '#3B82F6',
      onClick: () => toggleFavorite(item),
    },
    {
      text: '删除',
      color: '#EF4444',
      onClick: () => {
        uni.showModal({
          title: '安全确认',
          content: `确定删除"${item.name}"?`,
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
  <view class="border-white-5 overflow-hidden border rounded-[16px] bg-hex-121212">
    <SwipeActionItem v-for="(item, index) in list" :key="item.id" :actions="getActions(item)">
      <view
        class="flex items-center px-2 py-2" :class="[
          activeIndex === index ? 'bg-white-10' : 'bg-transparent',
          index !== list.length - 1 ? 'border-b border-white-5' : '',
        ]" @click="emit('click', item)"
      >
        <view class="relative shrink-0">
          <view
            class="h-12 w-12 flex items-center justify-center rounded-2xl"
            :class="[getVisual(item.categoryId).color]"
          >
            <view class="text-sm text-white" :class="[getVisual(item.categoryId).icon]" />
          </view>

          <view
            v-if="item.isFavorite"
            class="absolute h-5 w-5 flex items-center justify-center border-2 border-hex-121212 rounded-full bg-hex-ffd700 -right-1 -top-1"
          >
            <view class="i-carbon-star-filled text-[10px] text-black" />
          </view>
        </view>

        <view class="ml-4 flex-1 overflow-hidden">
          <view class="truncate text-sm text-white font-medium">
            {{ item.name }}
          </view>
          <view class="mt-1 truncate text-sm text-gray-400 font-mono">
            {{ item.account }}
          </view>
        </view>

        <view class="relative z-10 p-3 -mr-2" @click.stop="emit('edit', item)">
          <view class="i-carbon-edit text-white-40 text-sm active:text-white" />
        </view>
      </view>
    </SwipeActionItem>
  </view>
</template>

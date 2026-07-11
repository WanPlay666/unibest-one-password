<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import DetailCopySheet from '@/components/DetailCopySheet.vue'
import EmptyState from '@/components/EmptyState.vue'
import FavoriteList from '@/components/FavoriteList/FavoriteList.vue'
import Header from '@/components/Header.vue'
import SearchBar from '@/components/index/SearchBar.vue'

import { useRecordActions } from '@/composables/useRecordActions'
import { useVaultStore } from '@/composables/useVaultStore'
import { CATEGORY_MAP, CATEGORY_ROUTE_MAP } from '@/utils/config'
import { buildDetailList } from '@/utils/itemDetail'
import { setSecureStorage } from '@/utils/secureStorage'
import { STORAGE_KEYS } from '@/utils/storageKeys'

interface RecordItem {
  id: string | number
  name: string
  account?: string
  categoryId: string | number
  isFavorite?: boolean
  rawData?: Array<{ label: string, value: string | number, [key: string]: any }>
}

const { copyToClipboard, tryDelete } = useRecordActions()
const { getAllRecords } = useVaultStore()

const allRecords = ref<RecordItem[]>([])
const searchQuery = ref('')
const showDetail = ref(false)
const activeItem = ref<RecordItem | null>(null)

function loadFavorites() {
  allRecords.value = getAllRecords()
}

function handleRefresh() {
  try {
    setSecureStorage(STORAGE_KEYS.VAULT, allRecords.value)
  }
  catch (error) {
    uni.showToast({ title: '收藏状态保存失败', icon: 'none' })
  }
}

onShow(() => {
  loadFavorites()
})

const filteredData = computed(() => {
  const favorites = allRecords.value.filter(item => item.isFavorite)
  const keyword = searchQuery.value.toLowerCase().trim()

  if (!keyword)
    return favorites

  return favorites.filter((item) => {
    const matchName = item.name?.toLowerCase().includes(keyword) ?? false
    const matchAccount = item.account?.toLowerCase().includes(keyword) ?? false
    const categoryName = CATEGORY_MAP[String(item.categoryId)]?.name
    const matchCategory = categoryName?.toLowerCase().includes(keyword) ?? false

    return matchName || matchAccount || matchCategory
  })
})

const activeDetailList = computed(() => buildDetailList(activeItem.value))

function handleInput(val: string) {
  searchQuery.value = val
}

function handleItemCopy(item: RecordItem) {
  activeItem.value = item
  if (item.account) {
    copyToClipboard(item.account, '账号/卡号')
  }
  showDetail.value = true
}

function handleItemEdit(item: RecordItem) {
  const path = CATEGORY_ROUTE_MAP[String(item.categoryId)] || CATEGORY_ROUTE_MAP['1']
  const dataStr = encodeURIComponent(JSON.stringify(item))

  uni.navigateTo({
    url: `${path}?id=${item.id}&data=${dataStr}`,
  })
}

async function handleConfirmDelete(item: RecordItem) {
  const ok = await tryDelete(item)
  if (ok) {
    allRecords.value = allRecords.value.filter(i => i.id !== item.id)
  }
}
</script>

<template>
  <view class="text-white">
    <Header title="收藏夹" :show-left="false" fixed />

    <view class="px-6 py-4">
      <SearchBar fixed :offset-top="88" bg-color="#050508" @search="handleInput" />

      <FavoriteList v-if="filteredData.length > 0" :list="filteredData as any" @click="handleItemCopy"
        @edit="handleItemEdit" @delete="handleConfirmDelete" @refresh="handleRefresh" />
      <EmptyState v-else text="暂无收藏记录" />

      <DetailCopySheet :show="showDetail" :title="activeItem ? `${activeItem.name} 详情` : '详情'" :data="activeDetailList"
        @close="showDetail = false" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import DetailCopySheet from '@/components/DetailCopySheet.vue'
import FavoriteList from '@/components/FavoriteList/FavoriteList.vue'
import Header from '@/components/Header.vue'
import SearchBar from '@/components/index/SearchBar.vue'

import { useRecordActions } from '@/composables/useRecordActions'
import { CATEGORY_MAP, CATEGORY_ROUTE_MAP } from '@/utils/config'
import { getSecureStorage, setSecureStorage } from '@/utils/secureStorage'

// --- 1. 类型定义与常量隔离 (解耦) ---
const STORAGE_KEY = 'ENCRYPTED_VAULT'

interface RecordItem {
  id: string | number
  name: string
  account?: string
  categoryId: string | number
  isFavorite?: boolean
  rawData?: Array<{ label: string, value: string | number, [key: string]: any }>
}

const { copyToClipboard } = useRecordActions()

// --- 2. 状态管理 ---
const allRecords = ref<RecordItem[]>([])
const searchQuery = ref('')
const showDetail = ref(false)
const activeItem = ref<RecordItem | null>(null)

// --- 3. 数据层操作 ---
function loadFavorites() {
  allRecords.value = getSecureStorage(STORAGE_KEY) || []
}

function handleRefresh() {
  try {
    setSecureStorage(STORAGE_KEY, allRecords.value)
  }
  catch (error) {
    uni.showToast({ title: '收藏状态保存失败', icon: 'none' })
  }
}

onShow(() => {
  loadFavorites()
})

// --- 4. 核心计算层 (纯函数逻辑) ---
const filteredData = computed(() => {
  // 基础过滤：仅保留收藏项
  const favorites = allRecords.value.filter(item => item.isFavorite)
  const keyword = searchQuery.value.toLowerCase().trim()

  if (!keyword)
    return favorites

  // 搜索过滤：使用可选链 (?.) 和空值合并 (??) 提升鲁棒性和代码整洁度
  return favorites.filter((item) => {
    const matchName = item.name?.toLowerCase().includes(keyword) ?? false
    const matchAccount = item.account?.toLowerCase().includes(keyword) ?? false
    const categoryName = CATEGORY_MAP[String(item.categoryId)]?.name
    const matchCategory = categoryName?.toLowerCase().includes(keyword) ?? false

    return matchName || matchAccount || matchCategory
  })
})

// 数据适配器：专职负责将底层数据转化为 UI 组件所需的标准格式 (单一职责)
const activeDetailList = computed(() => {
  if (!activeItem.value || !Array.isArray(activeItem.value.rawData))
    return []

  return activeItem.value.rawData.map(field => ({
    label: field.label,
    value: field.value,
  }))
})

// --- 5. 交互行为层 ---
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
  // 采用全局配置映射，彻底消除页面内的硬编码路由
  const path = CATEGORY_ROUTE_MAP[String(item.categoryId)] || CATEGORY_ROUTE_MAP['1']
  const dataStr = encodeURIComponent(JSON.stringify(item))

  uni.navigateTo({
    url: `${path}?id=${item.id}&data=${dataStr}`,
  })
}
</script>

<template>
  <view class="text-white">
    <Header title="收藏夹" :show-left="false" fixed />

    <view class="px-6 py-4">
      <!-- <SearchBar @search="handleInput" /> -->
      <SearchBar fixed :offset-top="88" bg-color="#050508" @search="handleInput" />

      <view v-if="filteredData.length === 0" class="py-20 text-center text-sm text-white/30">
        暂无收藏记录
      </view>

      <FavoriteList
        v-else :list="filteredData" @click="handleItemCopy" @edit="handleItemEdit"
        @refresh="handleRefresh"
      />

      <DetailCopySheet
        :show="showDetail" :title="activeItem ? `${activeItem.name} 详情` : '详情'" :data="activeDetailList"
        @close="showDetail = false"
      />
    </view>
  </view>
</template>

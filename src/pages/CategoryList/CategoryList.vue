<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { nextTick, ref, computed } from 'vue'
import DetailCopySheet from '@/components/DetailCopySheet.vue'
import EmptyState from '@/components/EmptyState.vue'
import FavoriteList from '@/components/FavoriteList/FavoriteList.vue'
import Header from '@/components/Header.vue'
import SearchBar from '@/components/index/SearchBar.vue'
import Skeleton from '@/components/Skeleton/Skeleton.vue'
import SortToggle from '@/components/SortToggle.vue'
import { CATEGORY_ROUTE_MAP } from '@/utils/config'
import { buildDetailList } from '@/utils/itemDetail'
import { getSecureStorage } from '@/utils/secureStorage'
import { STORAGE_KEYS } from '@/utils/storageKeys'
import { useVaultStore } from '@/composables/useVaultStore'

// 状态定义
const pageTitle = ref('分类列表')
const categoryId = ref('')
const allItems = ref([])
const showDetail = ref(false)
const activeItem = ref<any>(null)
const sortOrder = ref<'latest' | 'earliest'>('latest')
const searchKeyword = ref('')
const isInitialLoading = ref(true)
const hasLoaded = ref(false)

const { deleteRecord } = useVaultStore()

const activeDetailList = computed(() => buildDetailList(activeItem.value))

// 列表 = 按关键字过滤 + 按 createdAt 排序;编辑不改变 createdAt,因此不会改变位置
const accountItems = computed(() => {
  const keyword = searchKeyword.value.toLowerCase().trim()
  const matched = keyword
    ? allItems.value.filter((item: any) =>
      (item.name?.toLowerCase().includes(keyword)) || (item.account?.toLowerCase().includes(keyword)),
    )
    : allItems.value
  const getTime = (it: any) => it.createdAt ?? 0
  const dir = sortOrder.value === 'latest' ? -1 : 1
  return [...matched].sort((a, b) => (getTime(a) - getTime(b)) * dir)
})

onLoad((options: any) => {
  if (options.title)
    pageTitle.value = options.title
  if (options.id)
    categoryId.value = options.id
})

onShow(() => {
  if (hasLoaded.value) {
    loadData()
    return
  }
  isInitialLoading.value = true
  nextTick(() => {
    loadData()
    isInitialLoading.value = false
    hasLoaded.value = true
  })
})

function loadData() {
  const list = getSecureStorage(STORAGE_KEYS.VAULT) || []
  let filtered = list
  if (categoryId.value) {
    filtered = list.filter((item: any) => String(item.categoryId) === String(categoryId.value))
  }
  allItems.value = filtered
}

function handleEdit() {
  if (!activeItem.value)
    return
  showDetail.value = false

  const targetPath = CATEGORY_ROUTE_MAP[String(categoryId.value)]
  const dataString = encodeURIComponent(JSON.stringify(activeItem.value))

  uni.navigateTo({
    url: `${targetPath}?data=${dataString}&id=${activeItem.value.id}`,
  })
}

function handleBack() {
  uni.navigateBack()
}

function handleInput(value: string) {
  searchKeyword.value = value
}

function handleConfirmDelete(item: any) {
  const ok = deleteRecord(item.id)
  if (!ok) {
    uni.showToast({ title: '删除失败,请重试', icon: 'none' })
    return
  }
  allItems.value = allItems.value.filter((i: any) => i.id !== item.id)
  uni.showToast({ title: '删除成功', icon: 'success' })
}

function handleDetail(item: any) {
  activeItem.value = item
  showDetail.value = true
}

function handleQuickEdit(item: any) {
  activeItem.value = item
  handleEdit()
}
</script>

<template>
  <view class="min-h-screen bg-[#050508] text-white">
    <Header :title="pageTitle" @back="handleBack" fixed />

    <SearchBar bg-color="#050508" @search="handleInput" fixed />

    <scroll-view class="px-5  box-border pb-safe" scroll-y>
      <view v-if="isInitialLoading" class="pb-1">
        <Skeleton variant="row" :count="6" />
      </view>

      <view v-else-if="accountItems.length > 0">
        <view class="flex justify-end pb-1">
          <SortToggle v-model="sortOrder" />
        </view>

        <FavoriteList :list="accountItems" @click="handleDetail" @edit="handleQuickEdit" @delete="handleConfirmDelete"
          @refresh="loadData" />
      </view>

      <EmptyState v-else text="暂无数据记录" />
    </scroll-view>

    <DetailCopySheet :show="showDetail" :title="`${activeItem?.name || ''} 详情`" :data="activeDetailList"
      @close="showDetail = false" @edit="handleEdit" />
  </view>
</template>
<style scoped>
.hh {
  height: calc(100vh - 120px);
}
</style>

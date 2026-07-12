<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import DetailCopySheet from '@/components/DetailCopySheet.vue'
import EmptyState from '@/components/EmptyState.vue'
import FavoriteList from '@/components/FavoriteList/FavoriteList.vue'
import Header from '@/components/Header.vue'
import SearchBar from '@/components/index/SearchBar.vue'
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
  loadData()
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
      <view v-if="accountItems.length > 0" class="flex justify-end pt-3 pb-1">
        <view class="flex items-center rounded-full bg-white/5 p-0.5">
          <view
            class="rounded-full px-3 py-1 text-[11px] transition-all"
            :class="sortOrder === 'latest' ? 'bg-white/15 text-white' : 'text-gray-500'"
            @tap="sortOrder = 'latest'"
          >
            最新新增
          </view>
          <view
            class="rounded-full px-3 py-1 text-[11px] transition-all"
            :class="sortOrder === 'earliest' ? 'bg-white/15 text-white' : 'text-gray-500'"
            @tap="sortOrder = 'earliest'"
          >
            最早新增
          </view>
        </view>
      </view>

      <FavoriteList v-if="accountItems.length > 0" :list="accountItems" @click="handleDetail" @edit="handleQuickEdit"
        @delete="handleConfirmDelete" @refresh="loadData" />
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

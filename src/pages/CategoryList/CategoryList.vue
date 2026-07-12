<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
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
const accountItems = ref([])
const allItems = ref([])
const showDetail = ref(false)
const activeItem = ref<any>(null)

const { deleteRecord } = useVaultStore()

const activeDetailList = computed(() => buildDetailList(activeItem.value))

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
  accountItems.value = filtered
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
  if (!value) {
    accountItems.value = allItems.value
  }
  else {
    const keyword = value.toLowerCase()
    accountItems.value = allItems.value.filter((item: any) =>
      (item.name?.toLowerCase().includes(keyword)) || (item.account?.toLowerCase().includes(keyword)),
    )
  }
}

function handleConfirmDelete(item: any) {
  const ok = deleteRecord(item.id)
  if (!ok) {
    uni.showToast({ title: '删除失败,请重试', icon: 'none' })
    return
  }
  accountItems.value = accountItems.value.filter((i: any) => i.id !== item.id)
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

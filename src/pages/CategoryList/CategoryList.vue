<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import DetailCopySheet from '@/components/DetailCopySheet.vue'
import FavoriteList from '@/components/FavoriteList/FavoriteList.vue'
import Header from '@/components/Header.vue'
import SearchBar from '@/components/index/SearchBar.vue'
import { CATEGORY_ROUTE_MAP } from '@/utils/config' // 引入配置
import { getSecureStorage, setSecureStorage } from '@/utils/secureStorage'

// 状态定义
const pageTitle = ref('分类列表')
const categoryId = ref('')
const accountItems = ref([])
const allItems = ref([])
const showDetail = ref(false)
const activeItem = ref<any>(null)

/**
 * 数据适配器
 */
const activeDetailList = computed(() => {
  const item = activeItem.value

  if (!item || !Array.isArray(item.rawData))
    return []

  // 基础字段处理 (rawData 本身已经是 [{label, value, key}])
  const list = item.rawData.map((field: any) => {
    return {
      label: field.label,
      value: field.value,
    }
  })

  return list
})
// 生命周期
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
  const list = getSecureStorage('ENCRYPTED_VAULT') || []
  let filtered = list
  if (categoryId.value) {
    filtered = list.filter((item: any) => String(item.categoryId) === String(categoryId.value))
  }
  allItems.value = filtered
  accountItems.value = filtered
}

// 核心修改：动态编辑跳转逻辑
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

// 其他交互逻辑
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
  const list = getSecureStorage('ENCRYPTED_VAULT') || []
  const updatedList = list.filter((i: any) => i.id !== item.id)
  try {
    setSecureStorage('ENCRYPTED_VAULT', updatedList)
    accountItems.value = accountItems.value.filter((i: any) => i.id !== item.id)
    uni.showToast({ title: '删除成功', icon: 'success' })
  }
  catch (e) {
    uni.showToast({ title: '删除失败', icon: 'none' })
  }
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
  <view class="min-h-screen bg-[#050508] text-white pt-safe pb-safe">
    <Header :title="pageTitle" fixed @back="handleBack" />
    <view class="px-6">
      <SearchBar fixed :offset-top="88" bg-color="#050508" @search="handleInput" />

      <FavoriteList
        v-if="accountItems.length > 0" :list="accountItems" @click="handleDetail" @edit="handleQuickEdit"
        @delete="handleConfirmDelete"
      />
      <view v-else class="mt-20 text-center text-sm text-gray-500">
        暂无数据记录
      </view>
    </view>

    <DetailCopySheet
      :show="showDetail" :title="`${activeItem?.name || ''} 详情`" :data="activeDetailList"
      @close="showDetail = false" @edit="handleEdit"
    />
  </view>
</template>

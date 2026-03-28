<template>
  <view class="min-h-screen bg-[#050508] text-white pt-safe pb-safe">
    <Header :title="pageTitle" @back="handleBack" />

    <view class="mt-4 px-6">
      <view class="mb-6">
        <SearchBar @search="handleInput" />
      </view>
      <FavoriteList v-if="accountItems.length > 0" :list="accountItems" @click="handleDetail" />
      <view v-else class="mt-20 text-center text-sm text-gray-500">
        暂无数据记录
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import FavoriteList from '@/components/FavoriteList/FavoriteList.vue'
import Header from '@/components/Header.vue'
import SearchBar from '@/components/index/SearchBar.vue'
import { getSecureStorage } from '@/utils/secureStorage'

definePage({
  style: {
    navigationStyle: 'custom',
  },
})

const pageTitle = ref('分类列表')
const categoryId = ref('')
const accountItems = ref([])
const allItems = ref([])

onLoad((options: any) => {
  if (options.title) {
    pageTitle.value = options.title
  }
  if (options.id) {
    categoryId.value = options.id
  }
})

onShow(() => {
  const list = getSecureStorage('ENCRYPTED_VAULT') || []
  let filtered = list
  if (categoryId.value) {
    filtered = list.filter((item: any) => String(item.categoryId) === String(categoryId.value))
  }
  allItems.value = filtered
  accountItems.value = filtered
})

function handleBack() {
  uni.navigateBack()
}

function handleInput(value: string) {
  if (!value) {
    accountItems.value = allItems.value
  }
  else {
    accountItems.value = allItems.value.filter((item: any) =>
      (item.name && item.name.toLowerCase().includes(value.toLowerCase()))
      || (item.account && item.account.toLowerCase().includes(value.toLowerCase())),
    )
  }
}

function handleDetail(item: any) {
  // TODO: 后续可接入详情页面
  uni.showToast({ title: `查看: ${item.name}`, icon: 'none' })
}
</script>

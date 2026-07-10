<script lang="ts" setup>
import { ref } from 'vue'
import CategoryGrid from '@/components/index/Category.vue'
import SearchBar from '@/components/index/SearchBar.vue'
import TopBar from '@/components/index/TopBar.vue'
import { useAuthStore } from '@/store/auth'
import { CATEGORY_MAP } from '@/utils/config'
import { getSecureStorage } from '@/utils/secureStorage'

defineOptions({
  name: 'Home',
})
const authStore = useAuthStore()
definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
  },
})

onShow(() => {
  fetchCategoryCounts()
})

// 1. 分类数据:从 CATEGORY_MAP 派生,保证单一数据源;count 由运行时统计累加
const categoryList = ref(
  Object.values(CATEGORY_MAP).map(c => ({
    id: Number(c.id),
    title: c.title,
    icon: c.icon,
    color: c.color,
    count: 0,
  })),
)

function fetchCategoryCounts() {
  // 【最关键的修复】如果没有密钥（应用未解锁或刷新丢失），重置数量并直接拦截
  if (!authStore.memoryAESKey) {
    console.warn('首页检测到未解锁，拦截解密操作')
    categoryList.value = categoryList.value.map(c => ({ ...c, count: 0 }))
    return
  }

  try {
    const allRecords = getSecureStorage('ENCRYPTED_VAULT') || []

    // 克隆数组重置 count
    const newList = categoryList.value.map(category => ({
      ...category,
      count: 0,
    }))

    // 统计逻辑
    allRecords.forEach((record: any) => {
      const matchedCategory = newList.find(c => String(c.id) === String(record.categoryId))
      if (matchedCategory) {
        matchedCategory.count += 1
      }
    })

    categoryList.value = newList
  }
  catch (error) {
    console.error('获取分类数量失败:', error)
  }
}

function handleCategoryClick(item: any) {
  uni.navigateTo({ url: `/pages/CategoryList/CategoryList?id=${item.id}&title=${item.title}` })
}

function handleAddCategory() {
  uni.navigateTo({ url: '/pages/addCategory/addCategory' })
}

// 2. 处理锁定按钮：安全闭环的核心操作！
function onManualLock() {
  uni.showModal({
    title: '锁定保险箱',
    content: '确定要立即锁定应用吗？',
    confirmColor: '#3b82f6',
    success: (res) => {
      if (res.confirm) {
        // [核心安全逻辑]：没收内存钥匙，踢回解锁页
        authStore.clearAESKey()
        uni.showToast({ title: '已安全锁定', icon: 'success' })

        setTimeout(() => {
          uni.reLaunch({ url: '/pages/Unlock/Unlock' })
        }, 500)
      }
    },
  })
}
</script>

<template>
  <view class="pt-safe">
    <view class="bg-[#000000f2] px-6">
      <TopBar @add="handleAddCategory" @lock="onManualLock" />
    </view>

    <view class="mt-6 px-6">
      <CategoryGrid :categories="categoryList" @click="handleCategoryClick" />
    </view>
  </view>
</template>

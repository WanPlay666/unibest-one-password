<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import CategoryGrid from '@/components/index/Category.vue'
import HeroCard from '@/components/HeroCard.vue'
import TopBar from '@/components/index/TopBar.vue'
import Skeleton from '@/components/Skeleton/Skeleton.vue'
import { useAuthStore } from '@/store/auth'
import { CATEGORY_MAP } from '@/utils/config'
import { getSecureStorage } from '@/utils/secureStorage'
import { STORAGE_KEYS } from '@/utils/storageKeys'

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

const isInitialLoading = ref(true)
const hasLoaded = ref(false)

onShow(() => {
  if (hasLoaded.value) {
    // 后续进入静默刷新,不再展示骨架
    fetchCategoryCounts()
    return
  }
  // 首次进入:展示骨架,等下一个 tick 再读保险箱,让骨架真实渲染一次
  isInitialLoading.value = true
  nextTick(() => {
    fetchCategoryCounts()
    isInitialLoading.value = false
    hasLoaded.value = true
  })
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

// 2. 首页统计指标
const totalCount = ref(0)
const favoriteCount = ref(0)
const usedCategoryCount = ref(0)

function fetchCategoryCounts() {
  // 【最关键的修复】如果没有密钥（应用未解锁或刷新丢失），重置数量并直接拦截
  if (!authStore.memoryAESKey) {
    console.warn('首页检测到未解锁，拦截解密操作')
    categoryList.value = categoryList.value.map(c => ({ ...c, count: 0 }))
    totalCount.value = 0
    favoriteCount.value = 0
    usedCategoryCount.value = 0
    return
  }
  try {
    const allRecords = (getSecureStorage(STORAGE_KEYS.VAULT) || []) as any[]

    // 克隆数组重置 count
    const newList = categoryList.value.map(category => ({
      ...category,
      count: 0,
    }))

    // 用 Map 索引,O(1) 查找,把原来的 O(n*m) 降到 O(n+m)
    const byId = new Map<string, typeof newList[number]>()
    for (const c of newList)
      byId.set(String(c.id), c)

    let favorites = 0
    for (const record of allRecords) {
      const matched = byId.get(String(record.categoryId))
      if (matched)
        matched.count += 1
      if (record.isFavorite)
        favorites += 1
    }

    categoryList.value = newList
    totalCount.value = allRecords.length
    favoriteCount.value = favorites
    usedCategoryCount.value = newList.filter(c => c.count > 0).length
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
    <view class="bg-[#000000f2] px-5">
      <TopBar @add="handleAddCategory" @lock="onManualLock" />
    </view>

    <view class="mt-6 px-5">
      <view v-if="isInitialLoading" class="flex flex-col gap-3">
        <Skeleton variant="row" :count="1" />
        <Skeleton variant="card" :count="8" />
      </view>
      <template v-else>
        <HeroCard
          :total="totalCount"
          :favorites="favoriteCount"
          :used-categories="usedCategoryCount"
        />
        <view class="mt-5">
          <CategoryGrid :categories="categoryList" @click="handleCategoryClick" />
        </view>
      </template>
    </view>
  </view>
</template>

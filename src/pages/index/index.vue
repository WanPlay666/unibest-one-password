<script lang="ts" setup>
import { ref } from 'vue'
import CategoryGrid from '@/components/index/Category.vue'
import SearchBar from '@/components/index/SearchBar.vue'
import TopBar from '@/components/index/TopBar.vue'
import { useAuthStore } from '@/store/auth'
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
  console.log('测试 uni API 自动引入:index  onLoad')
  fetchCategoryCounts()
})

// 1. 完整分类数据：对应 UI 设计稿中的 9 个分类
const categoryList = ref([
  { id: 1, title: '基础登录', count: 0, icon: 'i-carbon-password', color: 'bg-blue-600' },
  { id: 2, title: '身份信息', count: 0, icon: 'i-carbon-user', color: 'bg-indigo-500' },
  { id: 3, title: '银行支付', count: 0, icon: 'i-carbon-wallet', color: 'bg-emerald-500' },
  { id: 4, title: '社交通讯', count: 0, icon: 'i-carbon-chat', color: 'bg-sky-400' },
  { id: 5, title: '车辆信息', count: 0, icon: 'i-carbon-car', color: 'bg-orange-500' },
  { id: 6, title: '企业开票', count: 0, icon: 'i-carbon-receipt', color: 'bg-pink-400' },
  { id: 7, title: '医疗社保', count: 0, icon: 'i-carbon-stethoscope', color: 'bg-red-500' },
  { id: 8, title: 'Wi-Fi 网络', count: 0, icon: 'i-carbon-wifi', color: 'bg-violet-500' },
  { id: 9, title: '软件授权', count: 0, icon: 'i-carbon-code', color: 'bg-slate-500' },
])

// 2. 动态计算每个分类的数量
function fetchCategoryCounts() {
  console.log('---fetchCategoryCounts---')
  try {
    // 1. 去安全模块取数获取真实内容
    const allRecords = getSecureStorage('ENCRYPTED_VAULT') || []
    console.log('---ENCRYPTED_VAULT---', allRecords)
    // 2. [核心修复1]：不要直接改原数组，克隆出一个全新的数组重置 count
    // 这样重新赋值时，Vue 才能 100% 监听到数据变化并刷新页面
    const newList = categoryList.value.map(category => ({
      ...category,
      count: 0,
    }))

    // 3. 遍历所有记录，累加 count
    allRecords.forEach((record: any) => {
      // [核心修复2]：务必将两边的 id 都转成 String 再对比！
      // 因为路由传过来的 categoryId 是字符串 '3'，而你定义的 id 是数字 3
      const matchedCategory = newList.find(c => String(c.id) === String(record.categoryId))

      if (matchedCategory) {
        matchedCategory.count += 1
      }
    })

    // 4. 将全新数组赋值回去，强制触发视图的渲染
    categoryList.value = newList
  }
  catch (error) {
    console.error('获取分类数量失败:', error)
  }
}

function handleCategoryClick(item: any) {
  uni.navigateTo({ url: `/pages/CategoryList/CategoryList?id=${item.id}&title=${item.title}` })
}

function handleInput(value: string) {
  console.log('搜索输入：', value)
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

    <view class="b-0 b-b-1 border-white/10 b-solid bg-[#000000f2] px-6 pb-6">
      <SearchBar @search="handleInput" />
    </view>

    <view class="mt-6 px-6">
      <CategoryGrid :categories="categoryList" @click="handleCategoryClick" />
    </view>
  </view>
</template>

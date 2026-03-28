<template>
  <view>
    <Header title="收藏" :show-left="false" />

    <view class="b-0 b-b-1 border-white/10 b-solid bg-[#000000f2] px-6 pb-6 pt-2">
      <!-- 搜索栏 -->
      <SearchBar @search="handleInput" />
    </view>
    <view class="px-6 pt-6">
      <FavoriteList :list="favoriteItems" @click="handleDetail" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FavoriteList from '@/components/FavoriteList/FavoriteList.vue'
import Header from '@/components/Header.vue'
import SearchBar from '@/components/index/SearchBar.vue'

definePage({
  style: {
    navigationStyle: 'custom',
  },
})
const favoriteItems = ref([
  { id: 1, name: '微信', account: '138****8000', icon: '微', color: 'bg-[#31a4f1]', isStar: true },
  { id: 2, name: '支付宝', account: 'alipay****.com', icon: '支', color: 'bg-[#f33e54]', isStar: true },
  { id: 3, name: '家庭 Wi-Fi (TP-Link)', account: 'Xiaomi****e_5G', icon: '家', color: 'bg-[#9266f9]', isStar: true },
])

function handleInput(value: string) {
  console.log('搜索输入：', value)
}

function handleDetail(item: any) {
  uni.navigateTo({ url: `/pages/detail/index?id=${item.id}` })
}
</script>

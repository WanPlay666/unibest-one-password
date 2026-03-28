<script lang="ts" setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import { safeAreaInsets } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
  },
})

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

function handleClose() {
  uni.navigateBack()
}

function handleCategorySelect(item: any) {
  console.log('---选择的分类：', item.title)

  // 根据分类 id 跳转到对应的专属页面
  const routeMap: Record<number, string> = {
    1: `/pages/accountPasswordAdd/accountPasswordAdd`, // 基础登录
    2: `/pages/IdentityAdd/IdentityAdd`, // 身份信息
    3: `/pages/BankAdd/BankAdd`, // 银行支付
    4: `/pages/SocialAdd/SocialAdd`, // 社交通讯
    5: `/pages/VehicleAdd/VehicleAdd`, // 车辆信息
    6: `/pages/BusinessAdd/BusinessAdd`, // 企业开票
    7: `/pages/HealthcareAdd/HealthcareAdd`, // 医疗社保
    8: `/pages/WifiAdd/WifiAdd`, // Wi-Fi网络
    9: `/pages/SoftwareAdd/SoftwareAdd`, // 软件授权
  }

  const basePath = routeMap[item.id]
  if (!basePath) {
    uni.showToast({ title: '开发中', icon: 'none' })
    return
  }

  const url = `${basePath}?id=${item.id}&title=${item.title}&icon=${item.icon}&color=${item.color}`

  // 因为是在添加页面里面，应该直接用 navigateTo 跳转到表单详情，并保留该页在堆栈（或者 redirectTo）
  // 这里正常 navigateTo 是可以的
  uni.navigateTo({ url })
}
</script>

<template>
  <view class="pt-safe" :style="{ paddingTop: `${safeAreaInsets?.top}px` }">
    <Header title="选择分类" fixed :show-left="false" />

    <view class="grid grid-cols-3 mt-10 content-start gap-x-4 gap-y-12 px-6">
      <view
        v-for="item in categoryList" :key="item.title" class="flex flex-col items-center"
        @click="handleCategorySelect(item)"
      >
        <view
          :class="item.color"
          class="h-16 w-16 flex items-center justify-center rounded-[22px] shadow-black/40 shadow-lg transition-all active:scale-95 active:brightness-90"
        >
          <view :class="item.icon" class="text-2xl text-white" />
        </view>

        <text class="mt-3 text-sm text-white font-medium tracking-wide">
          {{ item.title }}
        </text>
      </view>
    </view>

    <view class="mt-18 flex justify-center">
      <view
        class="right-4 h-18 w-18 flex items-center justify-center rounded-full bg-white/10 transition-transform active:scale-90"
        @click="handleClose"
      >
        <view class="i-carbon-close text-lg text-white/70" />
      </view>
    </view>
  </view>
</template>

<style scoped>
.grid {
  display: grid;
}
</style>

<script lang="ts" setup>
import Header from '@/components/Header.vue'
import { useAuthStore } from '@/store/auth'

definePage({
  style: { navigationStyle: 'custom' },
})

const authStore = useAuthStore()

interface SecurityInfo {
  label: string
  value: string | boolean
  color?: string
}

const securityInfo: SecurityInfo[] = [
  { label: '加密算法', value: 'AES-256-CBC', color: 'text-emerald-400' },
  { label: '哈希算法', value: 'SHA-256', color: 'text-emerald-400' },
  { label: '工作密钥', value: authStore.isUnlocked ? '内存中 ✅' : '已销毁 ❌', color: authStore.isUnlocked ? 'text-green-400' : 'text-red-400' },
  { label: '生物解锁', value: authStore.isBiometricEnabled ? '已开启 ✅' : '未开启', color: authStore.isBiometricEnabled ? 'text-green-400' : 'text-gray-400' },
  { label: '主密码状态', value: '已设置 ✅', color: 'text-green-400' },
  { label: '数据隔离', value: '沙箱加密存储', color: 'text-emerald-400' },
]
</script>

<template>
  <view class="min-h-screen bg-[#050508] text-white pt-safe pb-safe">
    <Header title="安全设置" @back="uni.navigateBack()" />

    <view class="px-5">
      <view class="mb-6 mt-8 flex flex-col items-center">
        <view
          class="mb-4 h-16 w-16 flex items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10">
          <view class="i-carbon-ibm-cloud-key-protect text-3xl text-blue-500" />
        </view>
        <text class="text-lg font-bold tracking-wide">保险箱安全概览</text>
        <text class="mt-1 text-xs text-gray-500">所有数据均采用端到端加密</text>
      </view>

      <view class="overflow-hidden rounded-[24px] border border-white/5 bg-[#1A1A1A]">
        <view v-for="(info, idx) in securityInfo" :key="idx" class="flex items-center justify-between px-5 py-4"
          :class="idx < securityInfo.length - 1 ? 'border-b border-white/5' : ''">
          <text class="text-sm text-gray-400">{{ info.label }}</text>
          <text class="text-sm font-medium" :class="info.color || 'text-white'">{{ info.value }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

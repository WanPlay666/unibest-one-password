<script lang="ts" setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

function triggerBiometric() {
  uni.startSoterAuthentication({
    requestAuthModes: ['fingerPrint', 'facial'],
    challenge: 'hot_start_unlock',
    authContent: '请验证指纹或面容以解锁',
    success(_res) {
      // 成功：撤掉遮罩即可，因为 AES Key 依然在内存里，直接无缝继续使用
      authStore.showBiometricMask = false
    },
    fail(err) {
      console.warn('生物识别失败或取消', err)
      uni.showToast({ title: '验证失败，请使用主密码', icon: 'none' })
      authStore.clearAESKey() // 验证失败，没收内存钥匙，踢回密码页
      uni.reLaunch({ url: '/pages/Unlock/Unlock' })
    },
  })
}

// 遮罩组件一挂载，立即拉起原生指纹弹窗
onMounted(() => {
  triggerBiometric()
})

function handleCancel() {
  authStore.clearAESKey()
  uni.reLaunch({ url: '/pages/Unlock/Unlock' })
}
</script>

<template>
  <view class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050508] text-white">
    <view
      class="mb-6 h-20 w-20 flex animate-pulse items-center justify-center border border-blue-500/30 rounded-3xl bg-blue-500/10"
    >
      <view class="i-carbon-fingerprint-recognition text-5xl text-blue-500" />
    </view>

    <text class="mb-2 text-xl font-bold">已锁定</text>
    <text class="mb-12 text-sm text-gray-500">请验证生物特征以继续使用</text>

    <button
      class="mb-6 w-48 rounded-full border-none bg-blue-600 py-3 text-sm text-white font-bold"
      @click="triggerBiometric"
    >
      点击验证
    </button>

    <text class="py-2 text-sm text-gray-400 active:text-white" @click="handleCancel">
      使用主密码解锁
    </text>
  </view>
</template>

<style scoped>
button::after {
  border: none;
}
</style>

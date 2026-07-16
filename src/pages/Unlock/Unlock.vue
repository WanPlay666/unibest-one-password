<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import FieldGroup from '@/components/addCategory/FieldGroup.vue'
import FieldItem from '@/components/addCategory/FieldItem.vue'
import { useAuthStore } from '@/store/auth'
import { deriveAESKey, hashMasterPassword } from '@/utils/crypto'
import { getStorage } from '@/utils/storage'

definePage({ style: { navigationStyle: 'custom' } })

const authStore = useAuthStore()
const password = ref('')
const isError = ref(false)
const localSalt = ref('')
const localHash = ref('')

onLoad(() => {
  localSalt.value = getStorage('APP_SALT') || ''
  localHash.value = getStorage('MASTER_HASH') || ''
  if (!localSalt.value || !localHash.value) {
    uni.reLaunch({ url: '/pages/CreateMaster/CreateMaster' })
  }
})

function handleUnlock() {
  if (!password.value) {
    uni.showToast({ title: '请输入主密码', icon: 'none' })
    return
  }

  const inputHash = hashMasterPassword(password.value, localSalt.value)

  if (inputHash === localHash.value) {
    isError.value = false
    uni.showLoading({ title: '正在解锁...' })

    // 核心:重新派生出真正的 AES 密钥放入内存(大保险箱时 PBKDF2 + 解密可能耗时)
    try {
      const aesKey = deriveAESKey(password.value, localSalt.value)
      authStore.setAESKey(aesKey)
    }
    finally {
      uni.hideLoading()
    }

    uni.showToast({ title: '解锁成功', icon: 'success' })
    password.value = ''
    uni.reLaunch({ url: '/pages/index/index' })
  }
  else {
    isError.value = true
    password.value = ''
    uni.showToast({ title: '主密码错误', icon: 'error' })
  }
}
</script>

<template>
  <view class="min-h-screen flex flex-col items-center justify-center bg-[#050508] px-8 text-white">
    <view class="mb-12 flex flex-col items-center">
      <view
        class="mb-6 h-20 w-20 flex items-center justify-center rounded-[24px] from-blue-500 to-indigo-600 bg-gradient-to-br shadow-blue-500/30 shadow-lg">
        <view class="i-carbon-security text-4xl text-white" />
      </view>
      <text class="mb-2 text-2xl font-bold tracking-wider">密码保险箱</text>
      <text class="text-sm text-gray-500">请输入主密码解锁您的数据</text>
    </view>

    <view class="mb-8 w-full">
      <FieldGroup>
        <FieldItem v-model="password" label="主密码" type="password" placeholder="请输入主密码" :show-copy="false"
          :is-last="true" />
      </FieldGroup>
      <view class="mt-2 h-6 flex justify-center">
        <text v-if="isError" class="animate-pulse text-xs text-red-500">密码错误，请重试</text>
      </view>
    </view>

    <button
      class="w-full flex items-center justify-center rounded-[18px] border-none bg-blue-600 py-2 text-[10px] text-white font-bold shadow-blue-900/20 shadow-xl transition-transform active:scale-[0.97]"
      @click="handleUnlock">
      解 锁
    </button>
  </view>
</template>

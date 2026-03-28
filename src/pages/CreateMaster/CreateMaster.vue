<script lang="ts" setup>
import { ref } from 'vue'
import BottomButton from '@/components/addCategory/BottomButton.vue'
import FieldGroup from '@/components/addCategory/FieldGroup.vue'
import FieldItem from '@/components/addCategory/FieldItem.vue'
import Header from '@/components/Header.vue'
import { useAuthStore } from '@/store/auth'
import { deriveAESKey, generateSalt, hashMasterPassword } from '@/utils/crypto'
// 如果您之前封装了 BottomButton，直接引入。这里为了演示写成普通 button
import { setStorage } from '@/utils/storage'

definePage({
  style: { navigationStyle: 'custom' },
})

const formData = ref({
  password: '',
  confirmPassword: '',
})

const isSaving = ref(false)

function handleCreate() {
  const { password, confirmPassword } = formData.value

  // 1. 基础校验
  if (!password || password.length < 6) {
    uni.showToast({ title: '主密码至少需要6位', icon: 'none' })
    return
  }
  if (password !== confirmPassword) {
    uni.showToast({ title: '两次输入的密码不一致', icon: 'none' })
    return
  }

  if (isSaving.value)
    return
  isSaving.value = true

  try {
    // 2. 核心安全逻辑：生成盐并计算哈希
    const salt = generateSalt(16)
    const validationHash = hashMasterPassword(password, salt)

    // 3. 将 盐 和 哈希值 存入本地 (绝对不存 password 明文！)
    setStorage('APP_SALT', salt)
    setStorage('MASTER_HASH', validationHash)

    // 4. 计算 AES 存入内存，防止跳转到首页时抛出未解锁异常
    const authStore = useAuthStore()
    const aesKey = deriveAESKey(password, salt)
    authStore.setAESKey(aesKey)

    // 5. 存储一个经轻量混淆的凭证，供以后生物识别成功后恢复 AES Key
    // 妥协方案：微信小程序无纯本地硬件级安全存储，只能存于一般 Storage，以防君子
    const bioToken = aesKey.split('').reverse().join('')
    setStorage('BIOMETRIC_TOKEN', bioToken)

    uni.showToast({ title: '主密码创建成功', icon: 'success' })

    // 6. 跳转到首页 (或者解锁状态)
    setTimeout(() => {
      // 真实场景下，创建完成后应该直接进入首页
      uni.reLaunch({ url: '/pages/index/index' })
    }, 1000)
  }
  catch (error) {
    uni.showToast({ title: '创建失败，请重试', icon: 'none' })
    console.error('主密码创建异常:', error)
    isSaving.value = false
  }
}
</script>

<template>
  <view class="box-border bg-[#050508] px-6 text-white pt-safe pb-safe">
    <Header title="设置主密码" :show-left="false" />

    <view class="mb-10 mt-8 flex flex-col items-center justify-center text-center">
      <view
        class="mb-4 h-16 w-16 flex items-center justify-center border border-blue-500/30 rounded-2xl bg-blue-500/10"
      >
        <view class="i-carbon-locked text-3xl text-blue-500" />
      </view>
      <text class="mb-2 text-xl font-bold tracking-wide">保护您的所有数据</text>
      <text class="px-4 text-[12px] text-gray-500 leading-relaxed">
        主密码是解锁您所有账号的唯一凭证。<br>
      </text>
      <text class="text-[12px] text-red-600">请务必牢记，我们无法为您找回主密码。</text>
    </view>

    <FieldGroup>
      <FieldItem v-model="formData.password" label="主密码" type="password" placeholder="至少包含6个字符" :show-copy="false" />
      <FieldItem
        v-model="formData.confirmPassword" label="确认主密码" type="password" placeholder="请再次输入主密码"
        :show-copy="false" :is-last="true"
      />
    </FieldGroup>

    <view class="mt-6">
      <BottomButton text="确定创建" @save="handleCreate" />
    </view>
  </view>
</template>

<style scoped>
/* 隐藏原生按钮边框 */
button::after {
  border: none;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue'
import BottomButton from '@/components/addCategory/BottomButton.vue'
import FieldGroup from '@/components/addCategory/FieldGroup.vue'
import FieldItem from '@/components/addCategory/FieldItem.vue'
import Header from '@/components/Header.vue'
import { useAuthStore } from '@/store/auth'
import { deriveAESKey, decryptData, encryptData, generateSalt, hashMasterPassword } from '@/utils/crypto'
import { getStorage, setStorage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/utils/storageKeys'

definePage({
  style: { navigationStyle: 'custom' },
})

const authStore = useAuthStore()

const formData = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const isSaving = ref(false)

function handleSave() {
  const { oldPassword, newPassword, confirmPassword } = formData.value

  // 基础校验
  if (!oldPassword || !newPassword || !confirmPassword) {
    uni.showToast({ title: '请填写完整', icon: 'none' })
    return
  }
  if (newPassword.length < 6) {
    uni.showToast({ title: '新密码至少6位', icon: 'none' })
    return
  }
  if (newPassword !== confirmPassword) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
    return
  }
  if (oldPassword === newPassword) {
    uni.showToast({ title: '新密码与旧密码相同', icon: 'none' })
    return
  }

  if (isSaving.value) return
  isSaving.value = true

  try {
    // 1. 读取本地盐和哈希
    const oldSalt = getStorage('APP_SALT')
    const oldHash = getStorage('MASTER_HASH')
    if (!oldSalt || !oldHash) {
      uni.showToast({ title: '数据异常，请重新初始化', icon: 'none' })
      return
    }

    // 2. 验证旧密码
    const inputHash = hashMasterPassword(oldPassword, oldSalt)
    if (inputHash !== oldHash) {
      uni.showToast({ title: '旧密码错误', icon: 'error' })
      isSaving.value = false
      return
    }

    // 3. 用旧密钥解密所有记录
    const oldAesKey = deriveAESKey(oldPassword, oldSalt)
    const encryptedVault = uni.getStorageSync(STORAGE_KEYS.VAULT)
    let vaultData: any = []
    if (encryptedVault) {
      vaultData = decryptData(encryptedVault, oldAesKey)
    }

    // 4. 生成新盐和新密钥
    const newSalt = generateSalt(16)
    const newHash = hashMasterPassword(newPassword, newSalt)
    const newAesKey = deriveAESKey(newPassword, newSalt)

    // 5. 用新密钥重新加密数据
    const newEncryptedVault = vaultData ? encryptData(vaultData, newAesKey) : ''

    // 6. 保存
    setStorage('APP_SALT', newSalt)
    setStorage('MASTER_HASH', newHash)
    if (newEncryptedVault) {
      setStorage(STORAGE_KEYS.VAULT, newEncryptedVault)
    }

    // 7. 更新内存密钥
    authStore.setAESKey(newAesKey)

    uni.showToast({ title: '主密码修改成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  }
  catch (error) {
    console.error('修改密码异常:', error)
    uni.showToast({ title: '修改失败，请重试', icon: 'none' })
    isSaving.value = false
  }
}
</script>

<template>
  <view class="box-border bg-[#050508] px-6 text-white pt-safe pb-safe min-h-screen">
    <Header title="修改主密码" @back="uni.navigateBack()" />

    <view class="mb-8 mt-6 flex flex-col items-center text-center">
      <view class="mb-4 h-16 w-16 flex items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
        <view class="i-carbon-unlocked text-3xl text-emerald-500" />
      </view>
      <text class="mb-1 text-xl font-bold tracking-wide">重置主密码</text>
      <text class="text-xs text-gray-500">修改后所有数据会用新密钥重新加密</text>
    </view>

    <FieldGroup>
      <FieldItem
        v-model="formData.oldPassword" name="oldPassword" label="当前主密码" type="password"
        placeholder="输入当前主密码" :show-copy="false"
      />
      <FieldItem
        v-model="formData.newPassword" name="newPassword" label="新主密码" type="password"
        placeholder="至少6个字符" :show-copy="false"
      />
      <FieldItem
        v-model="formData.confirmPassword" name="confirmPassword" label="确认新密码" type="password"
        placeholder="再次输入新密码" :show-copy="false" :is-last="true"
      />
    </FieldGroup>

    <view class="mt-6">
      <BottomButton text="确认修改" @save="handleSave" />
    </view>
  </view>
</template>

<style scoped>
button::after {
  border: none;
}
</style>

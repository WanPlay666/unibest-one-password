import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { STORAGE_KEYS } from '@/utils/storageKeys'
import { getStorage } from '@/utils/storage'

export const useAuthStore = defineStore('auth', () => {
  // 核心机密：内存中的 AES 工作密钥，绝对不存本地
  const memoryAESKey = ref('')

  // 是否已解锁 (内存里有钥匙就算解锁)
  const isUnlocked = computed(() => !!memoryAESKey.value)

  // 控制热启动时的全局生物识别遮罩
  const showBiometricMask = ref(false)

  // 用户设置：是否开启了指纹/面容解锁 (只存布尔值，非常安全)
  const isBiometricEnabled = ref(getStorage(STORAGE_KEYS.BIOMETRIC) === true)

  function setAESKey(key: string) {
    memoryAESKey.value = key
  }

  function clearAESKey() {
    memoryAESKey.value = ''
    showBiometricMask.value = false // 销毁密钥时，遮罩也一并关掉
  }

  return {
    memoryAESKey,
    isUnlocked,
    showBiometricMask,
    isBiometricEnabled,
    setAESKey,
    clearAESKey,
  }
})

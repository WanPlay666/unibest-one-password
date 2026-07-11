import { useAuthStore } from '@/store/auth'
import { decryptData, encryptData } from './crypto'

/**
 * 获取当前会话的解密密钥
 */
function getSessionKey(): string {
  const authStore = useAuthStore()
  const key = authStore.memoryAESKey
  if (!key) {
    throw new Error('LOCKED') // 明确抛出锁定状态
  }
  return key
}

/**
 * 安全存入本地缓存。
 * 返回 `true` 表示写入成功,`false` 表示失败(无钥匙 / 加密失败 / 存储失败)。
 * 业务层可以根据返回值决定是否回滚 UI 状态或提示用户。
 */
export function setSecureStorage(key: string, data: any): boolean {
  try {
    const aesKey = getSessionKey()
    const ciphertext = encryptData(data, aesKey)
    if (ciphertext) {
      uni.setStorageSync(key, ciphertext)
      return true
    }
    return false
  }
  catch (error) {
    console.error(`安全存储 [${key}] 失败:`, error)
    return false
  }
}

/**
 * 从本地缓存安全读取
 */
export function getSecureStorage(key: string): any {
  try {
    const ciphertext = uni.getStorageSync(key)
    if (!ciphertext)
      return null

    const authStore = useAuthStore()
    const aesKey = authStore.memoryAESKey

    // 如果内存里没钥匙，根本不要传给 decryptData
    if (!aesKey)
      return null

    return decryptData(ciphertext, aesKey)
  }
  catch (error) {
    return null
  }
}

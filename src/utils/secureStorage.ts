import { useAuthStore } from '@/store/auth'
import { decryptData, encryptData } from './crypto'
import { getStorage, removeStorage, setStorage } from './storage'

/**
 * 安全持久化封装：所有存入持久层的数据均会被 `authStore` 的 `memoryAESKey` 加密。
 * 取出时自动解密。如果内存中无密钥（未解锁），抛出异常。
 */

/**
 * 获取当前会话的解密密钥
 */
function getSessionKey(): string {
  const authStore = useAuthStore()
  const key = authStore.memoryAESKey
  if (!key) {
    throw new Error('应用处于锁定状态，无法进行数据加解密操作')
  }
  return key
}

/**
 * 安全存入本地缓存
 * @param key 缓存的 Key
 * @param data 需要存入的原始数据 (对象/数组/字符串)
 */
export function setSecureStorage(key: string, data: any): void {
  try {
    const aesKey = getSessionKey()
    const ciphertext = encryptData(data, aesKey)
    if (ciphertext) {
      setStorage(key, ciphertext)
    } else {
      throw new Error('加密过程返回了空值')
    }
  } catch (error) {
    console.error(`安全存储 [${key}] 失败:`, error)
    throw error
  }
}

/**
 * 从本地缓存安全读取
 * @param key 缓存的 Key
 * @returns 解密后的原始数据。若不存在或解密失败则返回 null
 */
export function getSecureStorage(key: string): any {
  try {
    const ciphertext = getStorage(key)
    if (!ciphertext) return null

    const aesKey = getSessionKey()
    const decryptedData = decryptData(ciphertext, aesKey)
    return decryptedData
  } catch (error) {
    console.error(`安全读取 [${key}] 失败:`, error)
    return null
  }
}

/**
 * 移除指定的安全缓存数据
 */
export function removeSecureStorage(key: string): void {
  removeStorage(key)
}

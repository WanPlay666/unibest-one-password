/**
 * 封装 uni 的本地缓存 API
 */

/**
 * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容
 */
export function setStorage(key: string, data: any): void {
  try {
    uni.setStorageSync(key, data)
  }
  catch (e) {
    console.error(`设置缓存失败: ${key}`, e)
  }
}

/**
 * 从本地缓存中同步获取指定 key 对应的内容
 */
export function getStorage(key: string): any {
  try {
    return uni.getStorageSync(key)
  }
  catch (e) {
    console.error(`获取缓存失败: ${key}`, e)
    return null
  }
}

/**
 * 从本地缓存中同步移除指定 key
 */
export function removeStorage(key: string): void {
  try {
    uni.removeStorageSync(key)
  }
  catch (e) {
    console.error(`移除缓存失败: ${key}`, e)
  }
}

/**
 * 同步清理本地数据缓存
 */
export function clearStorage(): void {
  try {
    uni.clearStorageSync()
  }
  catch (e) {
    console.error('清理缓存失败', e)
  }
}

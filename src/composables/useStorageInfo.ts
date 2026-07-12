import { ref } from 'vue'
import { STORAGE_KEYS } from '@/utils/storageKeys'
import { getStorage } from '@/utils/storage'

export interface StorageBucket {
  id: 'vault' | 'settings'
  label: string
  size: number
  color: string
}

const BUCKETS: StorageBucket[] = [
  { id: 'vault', label: '业务数据', size: 0, color: 'bg-blue-500' },
  { id: 'settings', label: '系统配置', size: 0, color: 'bg-gray-600' },
]

function byteSize(value: any): number {
  if (value === null || value === undefined)
    return 0
  try {
    return new Blob([JSON.stringify(value)]).size
  }
  catch {
    try {
      return JSON.stringify(value).length
    }
    catch {
      return 0
    }
  }
}

export function formatSize(bytes: number): string {
  if (bytes < 1024)
    return `${bytes} B`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export function useStorageInfo() {
  const buckets = ref<StorageBucket[]>(BUCKETS.map(b => ({ ...b, size: 0 })))
  const totalSize = ref(0)
  const lastUpdated = ref(0)
  const isLoading = ref(false)

  function refresh() {
    isLoading.value = true
    try {
      const info = uni.getStorageInfoSync()
      const next: StorageBucket[] = BUCKETS.map(b => ({ ...b, size: 0 }))
      let total = 0

      for (const key of info.keys) {
        const size = byteSize(getStorage(key))
        total += size
        const bucket = key === STORAGE_KEYS.VAULT
          ? next.find(b => b.id === 'vault')!
          : next.find(b => b.id === 'settings')!
        bucket.size += size
      }

      buckets.value = next
      totalSize.value = total
      lastUpdated.value = Date.now()
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    buckets,
    totalSize,
    lastUpdated,
    isLoading,
    refresh,
    formatSize,
  }
}

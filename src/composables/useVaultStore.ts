import { genId, type ItemWithDup, type NormalizedItem } from '@/utils/importSchema'
import { STORAGE_KEYS } from '@/utils/storageKeys'
import { getSecureStorage, setSecureStorage } from '@/utils/secureStorage'

export interface RecordPayload {
  id?: string | number
  categoryId: string
  name: string
  account: string
  password?: string
  relatedApps?: any[]
  rawData?: Array<{ key: string, label: string, value: string }>
}

export function useVaultStore() {
  const getAllRecords = (): NormalizedItem[] => {
    return getSecureStorage(STORAGE_KEYS.VAULT) || []
  }

  const saveRecord = (payload: RecordPayload, isEdit: boolean, id?: string | number): NormalizedItem | null => {
    const list = getAllRecords()
    let saved: NormalizedItem | null = null

    if (isEdit && id) {
      const idx = list.findIndex(item => String(item.id) === String(id))
      if (idx > -1) {
        list[idx] = {
          ...list[idx],
          ...payload,
          id: list[idx].id,
          createdAt: list[idx].createdAt,
          updatedAt: Date.now(),
        }
        saved = list[idx]
      }
    }
    else {
      const newRecord: NormalizedItem = {
        ...(payload as NormalizedItem),
        id: genId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      list.unshift(newRecord)
      saved = newRecord
    }

    setSecureStorage(STORAGE_KEYS.VAULT, list)
    return saved
  }

  const deleteRecord = (id: string | number): boolean => {
    const list = getAllRecords()
    const next = list.filter(item => String(item.id) !== String(id))
    if (next.length === list.length)
      return false
    return setSecureStorage(STORAGE_KEYS.VAULT, next)
  }

  /**
   * 清空整个保险箱(用于"清除本地数据"功能)。
   * 注意:不会清空 PROFILE / BIOMETRIC 等非敏感 key。
   */
  const clearAll = (): boolean => {
    return setSecureStorage(STORAGE_KEYS.VAULT, [])
  }

  return { getAllRecords, saveRecord, deleteRecord, clearAll }
}

// 兼容旧导入:`import type { ItemWithDup } from '@/composables/useVaultStore'`
// 新代码请从 '@/utils/importSchema' 导入
export type { ItemWithDup }

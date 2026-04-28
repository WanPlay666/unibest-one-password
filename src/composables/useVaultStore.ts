import { getSecureStorage, setSecureStorage } from '@/utils/secureStorage'

const VAULT_KEY = 'ENCRYPTED_VAULT'

export function useVaultStore() {
  const getAllRecords = () => getSecureStorage(VAULT_KEY) || []

  const saveRecord = (payload: any, isEdit: boolean, id?: string | number) => {
    const list = getAllRecords()
    if (isEdit && id) {
      const idx = list.findIndex((item: any) => item.id === id)
      if (idx > -1) {
        list[idx] = { ...list[idx], ...payload, updatedAt: Date.now() }
      }
    }
    else {
      const newRecord = {
        ...payload,
        id: `REC_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      }
      list.unshift(newRecord)
    }
    setSecureStorage(VAULT_KEY, list)
  }

  return { getAllRecords, saveRecord }
}

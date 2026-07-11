// 数据导入业务逻辑:粘贴 JSON → 解析 → 去重 → 入库

import { ref } from 'vue'
import {
  parseImport,
  detectDuplicates,
  commitImport,
  type ItemWithDup,
  type NormalizedItem,
  type ParseResult,
  type DupAction,
} from '@/utils/importSchema'
import { getSecureStorage, setSecureStorage } from '@/utils/secureStorage'
import { STORAGE_KEYS } from '@/utils/storageKeys'
import { useAuthStore } from '@/store/auth'

export function useDataImport() {
  const isLocked = ref(false)
  const fileName = ref('')
  const fileSize = ref(0)
  const rawText = ref('')
  const parseResult = ref<ParseResult | null>(null)
  const entries = ref<ItemWithDup[]>([])
  const step = ref<1 | 2 | 3 | 4>(1)

  function ensureUnlocked(): boolean {
    const auth = useAuthStore()
    if (!auth.memoryAESKey) {
      isLocked.value = true
      return false
    }
    isLocked.value = false
    return true
  }

  function getExisting(): NormalizedItem[] {
    return (getSecureStorage(STORAGE_KEYS.VAULT) as NormalizedItem[] | null) || []
  }

  function loadFromText(text: string, fallbackName = '手动粘贴.json'): boolean {
    if (!ensureUnlocked()) {
      uni.showToast({ title: '请先解锁应用', icon: 'none' })
      return false
    }
    fileName.value = fallbackName
    fileSize.value = text.length
    rawText.value = text
    return runParse()
  }

  function runParse(): boolean {
    const result = parseImport(rawText.value)
    parseResult.value = result

    if (result.items.length === 0 && result.invalid.length === 0) {
      uni.showToast({ title: '内容中没有可识别的数据', icon: 'none' })
      return false
    }

    if (result.items.length > 0) {
      entries.value = detectDuplicates(result.items, getExisting())
    }
    else {
      entries.value = []
    }

    step.value = 2
    return true
  }

  function setEntryAction(index: number, action: DupAction) {
    if (!entries.value[index])
      return
    entries.value = entries.value.map((e, i) =>
      i === index ? { ...e, dupAction: action } : e,
    )
  }

  function bulkSetAction(action: DupAction) {
    entries.value = entries.value.map((e) => {
      if (!e.matchedLocalId)
        return e
      return { ...e, dupAction: action }
    })
  }

  function commit() {
    if (!ensureUnlocked()) {
      uni.showToast({ title: '请先解锁应用', icon: 'none' })
      return null
    }
    const { nextList, result } = commitImport(entries.value, getExisting())
    setSecureStorage(STORAGE_KEYS.VAULT, nextList)
    step.value = 4
    return result
  }

  function reset() {
    fileName.value = ''
    fileSize.value = 0
    rawText.value = ''
    parseResult.value = null
    entries.value = []
    step.value = 1
  }

  return {
    isLocked,
    fileName,
    fileSize,
    rawText,
    parseResult,
    entries,
    step,
    loadFromText,
    setEntryAction,
    bulkSetAction,
    commit,
    reset,
  }
}

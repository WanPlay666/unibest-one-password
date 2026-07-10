// 数据导入业务逻辑:粘贴 JSON → 解析 → 去重 → 入库

import { ref } from 'vue'
import {
  parseImport,
  detectDuplicates,
  commitImport,
  type ItemWithDup,
  type ParseResult,
  type DupAction,
} from '@/utils/importSchema'
import { getSecureStorage, setSecureStorage } from '@/utils/secureStorage'
import { useAuthStore } from '@/store/auth'

const VAULT_KEY = 'ENCRYPTED_VAULT'

export function useDataImport() {
  const isLocked = ref(false)
  const fileName = ref('')
  const fileSize = ref(0)
  const rawText = ref('')
  const parseResult = ref<ParseResult | null>(null)
  const entries = ref<ItemWithDup[]>([])
  const step = ref<1 | 2 | 3 | 4>(1) // 1=粘贴 2=预览 3=重复处理 4=完成

  function ensureUnlocked() {
    const auth = useAuthStore()
    if (!auth.memoryAESKey) {
      isLocked.value = true
      return false
    }
    isLocked.value = false
    return true
  }

  // ─── 步骤 1:粘贴 JSON ─────────────────────────────────

  function loadFromText(text: string, fallbackName = '手动粘贴.json') {
    if (!ensureUnlocked()) {
      uni.showToast({ title: '请先解锁应用', icon: 'none' })
      return false
    }
    fileName.value = fallbackName
    fileSize.value = text.length
    rawText.value = text
    return runParse()
  }

  // ─── 步骤 2:解析 + 去重检测 ─────────────────────────

  function runParse(): boolean {
    const result = parseImport(rawText.value)
    parseResult.value = result

    if (result.items.length === 0 && result.invalid.length === 0) {
      uni.showToast({ title: '内容中没有可识别的数据', icon: 'none' })
      return false
    }

    if (result.items.length > 0) {
      const existing = (getSecureStorage(VAULT_KEY) || []) as any[]
      entries.value = detectDuplicates(result.items, existing)
    }
    else {
      entries.value = []
    }

    step.value = 2
    return true
  }

  // ─── 步骤 3:重复处理 ────────────────────────────────

  function setEntryAction(index: number, action: DupAction) {
    if (entries.value[index]) {
      entries.value = entries.value.map((e, i) =>
        i === index ? { ...e, dupAction: action } : e,
      )
    }
  }

  function bulkSetAction(action: DupAction) {
    entries.value = entries.value.map(e => ({
      ...e,
      dupAction: e.matchedLocalId ? action : 'keep-both',
    }))
  }

  // ─── 步骤 4:入库 ─────────────────────────────────────

  function commit() {
    if (!ensureUnlocked()) {
      uni.showToast({ title: '请先解锁应用', icon: 'none' })
      return null
    }
    const existing = (getSecureStorage(VAULT_KEY) || []) as any[]
    const { nextList, result } = commitImport(entries.value, existing)
    setSecureStorage(VAULT_KEY, nextList)
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
    // state
    isLocked,
    fileName,
    fileSize,
    rawText,
    parseResult,
    entries,
    step,
    // actions
    loadFromText,
    setEntryAction,
    bulkSetAction,
    commit,
    reset,
  }
}

import { ref } from 'vue'
import type { RecordPayload } from './useVaultStore'
import { useVaultStore } from './useVaultStore'

export function useRecordActions() {
  const showDetailSheet = ref(false)

  const copyToClipboard = (text: string, label: string) => {
    if (!text)
      return
    uni.setClipboardData({
      data: text,
      success: () => uni.showToast({ title: `${label}已复制`, icon: 'none' }),
    })
  }

  const toggleDetailSheet = () => {
    showDetailSheet.value = !showDetailSheet.value
  }

  /**
   * 保存记录(新增/编辑),统一处理:
   *   - try { saveRecord } → 成功 toast + 800ms 返回上一页
   *   - catch → 失败 toast
   * 调用方只关心业务 payload,不再重复写 try/catch 模板。
   */
  const trySave = async (
    payload: RecordPayload,
    isEdit: boolean,
    id: string | number | undefined,
    options: { successMsg?: string, errorMsg?: string, backDelay?: number } = {},
  ): Promise<boolean> => {
    const {
      successMsg = '已安全存入',
      errorMsg = '存储异常',
      backDelay = 800,
    } = options

    const { saveRecord } = useVaultStore()
    try {
      await saveRecord(payload, isEdit, id)
      uni.showToast({ title: successMsg, icon: 'success' })
      setTimeout(() => uni.navigateBack(), backDelay)
      return true
    }
    catch (e) {
      console.error('保存记录失败:', e)
      uni.showToast({ title: errorMsg, icon: 'none' })
      return false
    }
  }

  /**
   * 删除记录(带二次确认),删除成功后由调用方决定如何更新本地 state。
   */
  const tryDelete = async (item: { id: string | number, name: string }): Promise<boolean> => {
    return new Promise((resolve) => {
      uni.showModal({
        title: '安全确认',
        content: `确定删除"${item.name}"?`,
        confirmColor: '#EF4444',
        success: async (res) => {
          if (!res.confirm) {
            resolve(false)
            return
          }
          const { deleteRecord } = useVaultStore()
          const ok = deleteRecord(item.id)
          if (!ok) {
            uni.showToast({ title: '删除失败', icon: 'none' })
            resolve(false)
            return
          }
          uni.showToast({ title: '删除成功', icon: 'success' })
          resolve(true)
        },
      })
    })
  }

  return { showDetailSheet, copyToClipboard, toggleDetailSheet, trySave, tryDelete }
}

import { ref } from 'vue'

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

  return { showDetailSheet, copyToClipboard, toggleDetailSheet }
}

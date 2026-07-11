import { ref } from 'vue'
import { CATEGORY_MAP } from '@/utils/config'
import { useVaultStore } from './useVaultStore'

/**
 * 保险箱导出逻辑(小程序端)。
 *
 * 流程:
 *   1. 读所有加密记录 → 解密 → 转成可再导入的 JSON 结构
 *   2. 写临时文件 → openDocument 调起系统打开
 *   3. 失败降级到 setClipboardData 复制到剪贴板
 *
 * 内部用 isExporting 标志位防重复点击。
 */
export function useVaultExport() {
  const { getAllRecords } = useVaultStore()
  const isExporting = ref(false)

  /**
   * 把内部存储格式转成可再导入的格式:
   *   - 顶层字段: type / name / account / password / relatedApps
   *   - 业务字段从 rawData 展开(让 parseImport 能正确读到 schema.fields 的 key)
   *   - 去掉内部字段: id / createdAt / updatedAt / fingerprint / isFavorite / categoryId
   */
  function buildExportItem(rec: any): Record<string, any> {
    const schema = CATEGORY_MAP[String(rec.categoryId)]
    const result: Record<string, any> = {
      type: schema?.type || rec.type,
      name: rec.name,
      account: rec.account,
      password: rec.password || '',
      relatedApps: rec.relatedApps || [],
    }
    const skipKeys = new Set(['type', 'name', 'account', 'password', 'relatedApps', 'categoryId'])
    if (Array.isArray(rec.rawData)) {
      for (const f of rec.rawData) {
        if (f.key && !skipKeys.has(f.key) && f.value !== undefined && f.value !== '') {
          result[f.key] = String(f.value)
        }
      }
    }
    return result
  }

  async function handleExport(): Promise<boolean> {
    if (isExporting.value)
      return false
    isExporting.value = true
    uni.showLoading({ title: '正在导出...' })

    try {
      const data = getAllRecords()
      if (data.length === 0) {
        uni.showToast({ title: '暂无数据可导出', icon: 'none' })
        return false
      }

      const items = data.map(buildExportItem)
      const payload = { version: '1.0', exportedAt: Date.now(), items }
      const json = JSON.stringify(payload, null, 2)
      const filename = `password-vault-${Date.now()}.json`

      // 小程序端:写临时文件 → openDocument
      const wxFs = uni.getFileSystemManager()
      const wxFilePath = `${wx.env.USER_DATA_PATH}/${filename}`
      wxFs.writeFile({
        filePath: wxFilePath,
        data: json,
        encoding: 'utf8',
        success() {
          uni.openDocument({
            filePath: wxFilePath,
            showMenu: true,
            success: () => uni.showToast({ title: '导出成功', icon: 'success' }),
            fail: () => copyToClipboard(json),
          })
        },
        fail: () => copyToClipboard(json),
      })
      return true
    }
    catch (error) {
      console.error('导出失败:', error)
      uni.showToast({ title: '导出失败', icon: 'none' })
      return false
    }
    finally {
      isExporting.value = false
      uni.hideLoading()
    }
  }

  function copyToClipboard(json: string) {
    uni.setClipboardData({
      data: json,
      success: () => uni.showToast({ title: '已复制到剪贴板', icon: 'none' }),
    })
  }

  return { isExporting, handleExport }
}

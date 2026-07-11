import { ref } from 'vue'
import type { NormalizedItem } from '@/utils/importSchema'

export interface FormInitOptions {
  /** onLoad 传入的页面参数 */
  options?: Record<string, any>
  /** 编辑回显就绪后回调(用于回填非通用字段) */
  onReady?: (data: NormalizedItem) => void
}

/**
 * 表单引擎:封装 formData 状态 + 编辑模式回显 + 详情页自描述 rawData。
 * 不再吃 `any`:options 是 Record<string, any>,data 是 NormalizedItem。
 */
export function useFormEngine<T extends Record<string, string>>(initialState: T) {
  const formData = ref<T>({ ...initialState })
  const isEditMode = ref(false)
  const recordId = ref<string | number>('')

  const init = (options: Record<string, any> | undefined, onReady?: (data: NormalizedItem) => void) => {
    if (options?.data) {
      try {
        const data = JSON.parse(decodeURIComponent(options.data)) as NormalizedItem
        isEditMode.value = true
        recordId.value = data.id

        const dataMap: Record<string, any> = {}
        for (const f of data.rawData || [])
          dataMap[f.key] = f.value

        for (const key of Object.keys(initialState)) {
          ;(formData.value as any)[key] = data[key as keyof NormalizedItem] ?? dataMap[key] ?? initialState[key]
        }

        onReady?.(data)
      }
      catch (e) {
        console.error('解析回显失败:', e)
      }
    }
  }

  const getRawData = (fieldRegistry: Map<string, any>, relatedApps: Array<{ value: string }>) => {
    const fields = Array.from(fieldRegistry.values())
      .filter(f => f.value)
      .map(f => ({ key: f.name, label: f.label, value: f.value }))

    const validApps = relatedApps.filter(app => app.value)
    if (validApps.length) {
      fields.push({
        key: 'relatedApps',
        label: '关联应用',
        value: validApps.map(app => String(app.value)).join(', '),
      })
    }

    return fields
  }

  return { formData, isEditMode, recordId, init, getRawData }
}

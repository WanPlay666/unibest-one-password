import { ref } from 'vue'

export function useFormEngine<T extends Record<string, any>>(initialState: T) {
  const formData = ref<T>({ ...initialState })
  const isEditMode = ref(false)
  const recordId = ref('')

  // 职责：一键解析并初始化数据
  const init = (options: any, onReady?: (data: any) => void) => {
    if (options?.data) {
      try {
        const data = JSON.parse(decodeURIComponent(options.data))
        isEditMode.value = true
        recordId.value = data.id

        // 将数组转为 Map 提高回显查找效率
        const dataMap = (data.rawData || []).reduce((acc: any, cur: any) => {
          acc[cur.key] = cur.value
          return acc
        }, {})

        // 声明式回显：自动匹配字段
        Object.keys(initialState).forEach((key) => {
          // 逻辑优先级：根节点同名属性 > rawData 存储属性 > 初始值
          (formData.value as any)[key] = data[key] ?? dataMap[key] ?? initialState[key]
        })

        onReady?.(data)
      }
      catch (e) {
        console.error('解析回显失败:', e)
      }
    }
  }

  // 职责：构建详情页自描述数组
  const getRawData = (fieldRegistry: Map<string, any>, relatedApps: any[]) => {
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

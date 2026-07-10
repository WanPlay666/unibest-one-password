// 把一条记录转成详情页可用的列表。
// rawData 已经是详情页自描述结构(useFormEngine.getRawData / buildRawData 都会写入
// 业务字段 + 关联应用),本函数只做"补全关联应用"兜底——其它字段不重复补全,避免
// 像 identity 的「号码」和「账号」这种同值异标签的重复显示。

interface DetailRow {
  label: string
  value: string
  key?: string
}

interface DetailItem {
  relatedApps?: Array<{ id?: string, value?: string }>
  rawData?: Array<{ key?: string, label?: string, value?: string | number }>
}

export function buildDetailList(item: DetailItem | null | undefined): DetailRow[] {
  if (!item)
    return []

  const result: DetailRow[] = []
  const seenKeys = new Set<string>()
  const seenLabels = new Set<string>()

  const push = (key: string, label: string, value: string | number | undefined | null) => {
    if (value === undefined || value === null || value === '')
      return
    const v = String(value)
    if (!v)
      return
    if (seenKeys.has(key) || seenLabels.has(label))
      return
    seenKeys.add(key)
    seenLabels.add(label)
    result.push({ key, label, value: v })
  }

  // 1. 用 rawData 里的字段(由 useFormEngine.getRawData 或 buildRawData 写入)
  if (Array.isArray(item.rawData)) {
    for (const f of item.rawData) {
      if (!f || !f.label)
        continue
      push(f.key || f.label, f.label, f.value)
    }
  }

  // 2. 兜底补全关联应用:旧数据 rawData 可能没有 relatedApps 项
  //    (新数据 useFormEngine / buildRawData 已写入,会被 seenLabels 去重,不会重复)
  if (Array.isArray(item.relatedApps) && item.relatedApps.length) {
    const apps = item.relatedApps
      .map(a => (a && a.value ? String(a.value) : ''))
      .filter(Boolean)
    if (apps.length)
      push('relatedApps', '关联应用', apps.join(', '))
  }

  return result
}

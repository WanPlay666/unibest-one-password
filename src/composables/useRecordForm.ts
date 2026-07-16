import { computed, reactive, ref } from 'vue'
import { CATEGORY_MAP } from '@/utils/config'
import { getFormDataInitial, getTypeByName, type TypeName, type NormalizedItem } from '@/utils/importSchema'
import { useFormEngine } from './useFormEngine'
import { useRelatedItems } from './useRelatedItems'
import { useFormValidation } from './useFormValidation'
import { useRecordActions } from './useRecordActions'
import type { RecordPayload } from './useVaultStore'

/**
 * 业务字段映射:把 formData 翻译成存储字段。
 * 调用方在新增/编辑页实现此接口,决定每种 type 的 account / password / name 怎么取。
 */
export interface RecordFieldMapping {
  /** 主键(账号/卡号/证件号/SSID...),值存到 payload.account */
  account: string
  /** 密码(login/medical/wifi 有),存到 payload.password */
  password?: string
  /** 业务字段回退的显示名(RecordNameCard 为空时的兜底) */
  nameFallback: string
}

export interface UseRecordFormOptions {
  type: TypeName
  /** onLoad options 兜底类型(默认从 schema.categoryId 取) */
  defaultCategoryId?: string
  /** 新增时 Header 显示的页标题 */
  title: string
  /**
   * 业务字段映射:把 formData 翻译成 storage 字段。
   *   - account: 必填(主键),从 formData 中取
   *   - password: 可选(只有 login/medical/wifi 之类需要密码的 type 才填)
   *   - nameFallback: RecordNameCard 为空时的兜底(取 formData 的某个业务字段)
   */
  fieldMapping: (formData: Record<string, string>) => RecordFieldMapping
  /** 额外的保存前校验(返回 false 终止保存),错误用 uni.showToast 自报 */
  extraValidate?: () => boolean
  /**
   * 额外的 payload 字段(可空)。例如 BankAdd 想要 'cardNumber' 作为 account 而不是 rawData 派生。
   * 不用此选项就能覆盖 8 种 type 的常见情况,需要时再扩展。
   */
}

export function useRecordForm(options: UseRecordFormOptions) {
  const { type, defaultCategoryId, title, fieldMapping, extraValidate } = options

  const schema = getTypeByName(type)
  const fallbackCategoryId = defaultCategoryId || schema?.categoryId || '1'

  // 1. formData
  const { formData, isEditMode, recordId, init, getRawData } = useFormEngine(getFormDataInitial(type))
  // 2. 关联应用
  const { items: relatedApps, setItems: setRelatedApps } = useRelatedItems()
  // 3. 校验
  const { validateBase } = useFormValidation()
  // 4. 保存
  const { trySave } = useRecordActions()

  // 5. 页面 UI 状态
  const pageTitle = ref(title)
  const inputTitle = ref('')
  const categoryId = ref(fallbackCategoryId)
  const currentCategory = computed(() => CATEGORY_MAP[categoryId.value] || CATEGORY_MAP[fallbackCategoryId])
  const isSaving = ref(false)

  // 6. 字段注册中心(由 FieldItem 自动注册)
  const fieldRegistry = reactive(new Map<string, any>())

  // 7. onLoad 编辑回显
  onLoad((pageOptions: any) => {
    init(pageOptions, (data: NormalizedItem) => {
      inputTitle.value = data.name
      categoryId.value = String(data.categoryId)
      setRelatedApps(data.relatedApps || [])
    })
    if (!isEditMode.value && pageOptions?.id) {
      categoryId.value = pageOptions.id
    }
  })

  // 8. 保存流程
  async function handleSave(): Promise<boolean> {
    if (isSaving.value)
      return false
    if (!validateBase(fieldRegistry))
      return false
    if (extraValidate && !extraValidate())
      return false

    isSaving.value = true
    try {
      const finalRelatedApps = JSON.parse(JSON.stringify(relatedApps.value))
      const rawData = getRawData(fieldRegistry, finalRelatedApps)
      const mapping = fieldMapping(formData.value as Record<string, string>)
      // 记录名称由 RecordNameCard 必填校验保证非空,不再兜底
      const name = inputTitle.value.trim()

      const payload: RecordPayload = {
        categoryId: categoryId.value,
        name,
        account: mapping.account,
        password: mapping.password || '',
        relatedApps: finalRelatedApps,
        rawData,
      }

      return await trySave(payload, isEditMode.value, recordId.value)
    }
    finally {
      isSaving.value = false
    }
  }

  return {
    formData,
    isEditMode,
    recordId,
    relatedApps,
    setRelatedApps,
    fieldRegistry,
    inputTitle,
    categoryId,
    currentCategory,
    pageTitle,
    isSaving,
    handleSave,
  }
}

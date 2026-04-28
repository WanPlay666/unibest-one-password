export function useFormValidation() {
  // 职责：通用必填校验
  const validateBase = (fieldRegistry: Map<string, any>) => {
    const fieldList = Array.from(fieldRegistry.values())
    for (const field of fieldList) {
      if (field.required && !String(field.value || '').trim()) {
        uni.showToast({ title: `请输入${field.label}`, icon: 'none' })
        return false
      }
    }
    return true
  }

  return { validateBase }
}

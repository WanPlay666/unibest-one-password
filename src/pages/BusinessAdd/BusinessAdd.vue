<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, provide, reactive, ref } from 'vue'
import BottomButton from '@/components/addCategory/BottomButton.vue'
import FieldGroup from '@/components/addCategory/FieldGroup.vue'
import FieldItem from '@/components/addCategory/FieldItem.vue'
import RecordNameCard from '@/components/addCategory/RecordNameCard.vue'
import RelatedAppsCard from '@/components/addCategory/RelatedAppsCard.vue'
import Header from '@/components/Header.vue'

import { useFormEngine } from '@/composables/useFormEngine'
import { useFormValidation } from '@/composables/useFormValidation'
import { useRelatedItems } from '@/composables/useRelatedItems'
// 导入统一的业务引擎
import { useVaultStore } from '@/composables/useVaultStore'
import { CATEGORY_MAP } from '@/utils/config'
import { getFormDataInitial } from '@/utils/importSchema'

// 1. 初始化引擎 - 字段清单从 Schema 派生
const { formData, isEditMode, recordId, init, getRawData } = useFormEngine(getFormDataInitial('business'))

const { items: relatedApps, setItems: setRelatedApps } = useRelatedItems()
const { saveRecord } = useVaultStore()
const { validateBase } = useFormValidation()

// 页面基础状态
const title = ref('企业开票')
const inputTitle = ref('')
const categoryId = ref('6')
const currentCategory = computed(() => CATEGORY_MAP[categoryId.value] || CATEGORY_MAP['6'])

// --- 2. 表单注册中心 (实现自动化校验的核心) ---
const fieldRegistry = reactive(new Map<string, any>())
provide('formManager', {
  register: (name, meta) => fieldRegistry.set(name, meta),
  update: (name, meta) => fieldRegistry.set(name, meta),
  unregister: name => fieldRegistry.delete(name),
})

// --- 3. 数据初始化与回显 ---
onLoad((options: any) => {
  init(options, (data) => {
    // 引擎自动映射 formData 后，处理特殊字段
    inputTitle.value = data.name
    categoryId.value = String(data.categoryId)
    if (data.relatedApps) {
      setRelatedApps(data.relatedApps) // 恢复关联应用编辑状态
    }
  })

  if (!isEditMode.value && options?.id) {
    categoryId.value = options.id
  }
})

// --- 4. 业务逻辑 ---

async function handleSave() {
  // A. 基础必填校验
  if (!validateBase(fieldRegistry))
    return

  // B. 企业特有逻辑：纳税人识别号简单长度校验
  if (formData.value.taxId && formData.value.taxId.length < 15) {
    uni.showToast({ title: '纳税人识别号格式不正确', icon: 'none' })
    return
  }

  // 关键：强制深拷贝数据快照，确保保存成功
  const finalRelatedApps = JSON.parse(JSON.stringify(relatedApps.value))

  const payload = {
    id: isEditMode.value ? recordId.value : `${Date.now()}`,
    categoryId: categoryId.value,
    // 逻辑：优先用别名，否则用公司全称
    name: inputTitle.value.trim() || formData.value.companyName || '未命名企业',
    account: formData.value.taxId, // 将税号作为主显示账号
    password: '',
    relatedApps: finalRelatedApps, // 根路径存储，解决回显失效
    rawData: getRawData(fieldRegistry, finalRelatedApps), // 供详情页展示
    updatedAt: Date.now(),
  }

  try {
    await saveRecord(payload, isEditMode.value, recordId.value)
    uni.showToast({ title: '已安全保存', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
  }
  catch (e) {
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}
</script>

<template>
  <view class="bg-[#050508] text-white">
    <Header :title="isEditMode ? '编辑发票信息' : title" fixed @back="uni.navigateBack()" />

    <view class="px-6 py-4">
      <RecordNameCard v-model="inputTitle" :icon="currentCategory.icon" placeholder="记录别名 (如: 我的公司)" />

      <FieldGroup>
        <FieldItem v-model="formData.companyName" name="companyName" label="公司全称" required placeholder="请输入营业执照上的全称" />

        <FieldItem v-model="formData.taxId" name="taxId" label="税号" required placeholder="纳税人识别号 (15-20位)" />

        <FieldItem v-model="formData.addressPhone" name="addressPhone" label="地址电话" placeholder="注册地址及公司电话" />

        <FieldItem v-model="formData.bankAccount" name="bankAccount" label="开户行账号" placeholder="开户银行及账号" />

        <FieldItem v-model="formData.email" name="email" label="接收邮箱" is-last placeholder="用于接收电子发票" />
      </FieldGroup>

      <RelatedAppsCard v-model="relatedApps" />

      <BottomButton @save="handleSave" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { provide, reactive, ref } from 'vue'
import BottomButton from '@/components/addCategory/BottomButton.vue'
import FieldGroup from '@/components/addCategory/FieldGroup.vue'
import FieldItem from '@/components/addCategory/FieldItem.vue'
import RecordNameCard from '@/components/addCategory/RecordNameCard.vue'
import RelatedAppsCard from '@/components/addCategory/RelatedAppsCard.vue'
import Header from '@/components/Header.vue'

import { useFormEngine } from '@/composables/useFormEngine'
import { useFormValidation } from '@/composables/useFormValidation'
import { useRelatedItems } from '@/composables/useRelatedItems'
// 导入核心引擎
import { useVaultStore } from '@/composables/useVaultStore'

// 1. 初始化引擎：定义软件授权字段契约
const { formData, isEditMode, recordId, init, getRawData } = useFormEngine({
  softwareName: '',
  licenseKey: '',
  limitation: '',
})

const { items: relatedApps, setItems: setRelatedApps } = useRelatedItems()
const { saveRecord } = useVaultStore()
const { validateBase } = useFormValidation()

// 2. 表单注册中心
const fieldRegistry = reactive(new Map<string, any>())
provide('formManager', {
  register: (name: string, meta: any) => fieldRegistry.set(name, meta),
  update: (name: string, meta: any) => fieldRegistry.set(name, meta),
  unregister: (name: string) => fieldRegistry.delete(name),
})

// 3. 基础 UI 状态
const title = ref('软件授权')
const inputTitle = ref('')
const categoryIcon = ref('i-carbon-code')
const categoryId = ref('7')

onLoad((options: any) => {
  init(options, (data) => {
    inputTitle.value = data.name
    categoryId.value = String(data.categoryId)
    setRelatedApps(data.relatedApps || [])
  })

  if (!isEditMode.value && options) {
    title.value = options.title || '软件授权'
    categoryIcon.value = options.icon || 'i-carbon-code'
    categoryId.value = options.id || '7'
  }
})

// 4. 保存逻辑
async function handleSave() {
  if (!validateBase(fieldRegistry))
    return

  const latestApps = JSON.parse(JSON.stringify(relatedApps.value))

  const payload = {
    id: isEditMode.value ? recordId.value : `${Date.now()}`,
    categoryId: categoryId.value,
    name: inputTitle.value.trim() || formData.softwareName || '未命名授权',
    account: formData.value.licenseKey, // 授权码作为主要搜索信息
    password: '',
    relatedApps: latestApps,
    rawData: getRawData(fieldRegistry, latestApps),
    updatedAt: Date.now(),
  }

  try {
    await saveRecord(payload, isEditMode.value, recordId.value)
    uni.showToast({ title: '授权信息已存入', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
  }
  catch (e) {
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}
</script>

<template>
  <view class="min-h-screen bg-[#050508] text-white pt-safe">
    <Header :title="isEditMode ? '编辑授权' : title" fixed @back="uni.navigateBack()" />

    <view class="px-6 py-4">
      <RecordNameCard v-model="inputTitle" :icon="categoryIcon" placeholder="记录名称 (如: 办公软件)" />

      <FieldGroup>
        <FieldItem v-model="formData.softwareName" name="softwareName" label="软件名称" placeholder="请输入软件名称" />
        <FieldItem
          v-model="formData.licenseKey" name="licenseKey" label="激活码"
          placeholder="License Key / Serial Number"
        />
        <FieldItem
          v-model="formData.limitation" name="limitation" label="限制条件" placeholder="如: 3台设备 / 永久授权"
          is-last
        />
      </FieldGroup>

      <RelatedAppsCard v-model="relatedApps" />
      <BottomButton @save="handleSave" />
    </view>
  </view>
</template>

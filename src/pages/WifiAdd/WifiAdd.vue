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
// 核心 Composables
import { useVaultStore } from '@/composables/useVaultStore'
import { CATEGORY_MAP } from '@/utils/config'
import { getFormDataInitial } from '@/utils/importSchema'

// 1. 初始化引擎 - 字段清单从 Schema 派生
const { formData, isEditMode, recordId, init, getRawData } = useFormEngine(getFormDataInitial('wifi'))

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
const title = ref('Wi-Fi 网络')
const inputTitle = ref('')
const categoryId = ref('8')
const currentCategory = computed(() => CATEGORY_MAP[categoryId.value] || CATEGORY_MAP['8'])

onLoad((options: any) => {
  init(options, (data) => {
    inputTitle.value = data.name
    categoryId.value = String(data.categoryId)
    setRelatedApps(data.relatedApps || [])
  })

  if (!isEditMode.value && options?.id) {
    categoryId.value = options.id
  }
})

// 4. 保存逻辑
async function handleSave() {
  // 校验：Wi-Fi 名称必须填写
  if (!validateBase(fieldRegistry))
    return

  const latestApps = JSON.parse(JSON.stringify(relatedApps.value))

  const payload = {
    id: isEditMode.value ? recordId.value : `${Date.now()}`,
    categoryId: categoryId.value,
    name: inputTitle.value.trim() || formData.value.ssid || '未命名网络',
    account: formData.value.ssid, // SSID 作为主搜索键
    password: formData.value.wifiPassword, // Wi-Fi 密码作为主密码
    relatedApps: latestApps,
    rawData: getRawData(fieldRegistry, latestApps),
    updatedAt: Date.now(),
  }

  try {
    await saveRecord(payload, isEditMode.value, recordId.value)
    uni.showToast({ title: '配置已安全存入', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
  }
  catch (e) {
    uni.showToast({ title: '存储异常', icon: 'none' })
  }
}
</script>

<template>
  <view class="min-h-screen bg-[#050508] text-white pt-safe">
    <Header :title="isEditMode ? '编辑 Wi-Fi' : title" fixed @back="uni.navigateBack()" />

    <view class="px-6 py-4">
      <RecordNameCard v-model="inputTitle" :icon="currentCategory.icon" placeholder="记录名称 (如: 家里宽带)" />

      <FieldGroup>
        <FieldItem v-model="formData.ssid" name="ssid" label="网络名称" required placeholder="请输入 Wi-Fi 名称" />
        <FieldItem v-model="formData.wifiPassword" name="wifiPassword" label="Wi-Fi密码" required placeholder="请输入 Wi-Fi 密码" is-last />
      </FieldGroup>

      <FieldGroup>
        <FieldItem v-model="formData.adminAccount" name="adminAccount" label="后台账号" placeholder="路由器管理账号" />
        <FieldItem v-model="formData.adminPassword" name="adminPassword" label="后台密码" placeholder="路由器管理密码" is-last />
      </FieldGroup>

      <RelatedAppsCard v-model="relatedApps" />
      <BottomButton @save="handleSave" />
    </view>
  </view>
</template>

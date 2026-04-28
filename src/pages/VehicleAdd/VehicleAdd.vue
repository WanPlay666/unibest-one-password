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
// 核心 Composables
import { useVaultStore } from '@/composables/useVaultStore'

// 1. 初始化引擎
const { formData, isEditMode, recordId, init, getRawData } = useFormEngine({
  plateNumber: '',
  vin: '',
  engineNumber: '',
  registerDate: '',
  insurance: '',
  insuranceExpiry: '',
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
const title = ref('车辆信息')
const inputTitle = ref('')
const categoryIcon = ref('i-carbon-car')
const categoryId = ref('8')

onLoad((options: any) => {
  init(options, (data) => {
    inputTitle.value = data.name
    categoryId.value = String(data.categoryId)
    setRelatedApps(data.relatedApps || [])
  })

  if (!isEditMode.value && options) {
    title.value = options.title || '车辆信息'
    categoryIcon.value = options.icon || 'i-carbon-car'
    categoryId.value = options.id || '8'
  }
})

// 4. 业务逻辑
function handleDateSelect(field: 'registerDate' | 'insuranceExpiry', e: any) {
  formData.value[field] = e.detail.value
}

async function handleSave() {
  if (!validateBase(fieldRegistry))
    return

  const latestApps = JSON.parse(JSON.stringify(relatedApps.value))

  const payload = {
    id: isEditMode.value ? recordId.value : `${Date.now()}`,
    categoryId: categoryId.value,
    name: inputTitle.value.trim() || formData.value.plateNumber || '未命名车辆',
    account: formData.value.plateNumber, // 车牌号作为主搜索键
    password: '',
    relatedApps: latestApps,
    rawData: getRawData(fieldRegistry, latestApps),
    updatedAt: Date.now(),
  }

  try {
    await saveRecord(payload, isEditMode.value, recordId.value)
    uni.showToast({ title: '已安全存入', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
  }
  catch (e) {
    uni.showToast({ title: '存储异常', icon: 'none' })
  }
}
</script>

<template>
  <view class="min-h-screen bg-[#050508] text-white pt-safe">
    <Header :title="isEditMode ? '编辑车辆信息' : title" fixed @back="uni.navigateBack()" />

    <view class="px-6 py-4">
      <RecordNameCard v-model="inputTitle" :icon="categoryIcon" placeholder="记录名称 (如: 我的爱车)" />

      <FieldGroup>
        <FieldItem v-model="formData.plateNumber" name="plateNumber" label="车牌号" required placeholder="粤B·XXXXX" />
        <FieldItem v-model="formData.vin" name="vin" label="识别号 (VIN)" placeholder="车辆识别代码" />
        <FieldItem v-model="formData.engineNumber" name="engineNumber" label="发动机号" placeholder="请输入发动机号" />

        <picker mode="date" @change="(e) => handleDateSelect('registerDate', e)">
          <FieldItem
            v-model="formData.registerDate" name="registerDate" label="注册日期" readonly placeholder="年 / 月 / 日"
            show-calendar
          />
        </picker>

        <FieldItem v-model="formData.insurance" name="insurance" label="保险信息" placeholder="保险公司及保单号" />

        <picker mode="date" @change="(e) => handleDateSelect('insuranceExpiry', e)">
          <FieldItem
            v-model="formData.insuranceExpiry" name="insuranceExpiry" label="到期日" readonly
            placeholder="保险到期日" show-calendar is-last
          />
        </picker>
      </FieldGroup>

      <RelatedAppsCard v-model="relatedApps" />
      <BottomButton @save="handleSave" />
    </view>
  </view>
</template>

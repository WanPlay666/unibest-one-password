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
// 导入核心引擎
import { useVaultStore } from '@/composables/useVaultStore'
import { CATEGORY_MAP } from '@/utils/config'
import { getFormDataInitial } from '@/utils/importSchema'

// 1. 引擎初始化 - 字段清单从 Schema 派生
const { formData, isEditMode, recordId, init, getRawData } = useFormEngine(getFormDataInitial('medical'))

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
const title = ref('医疗社保')
const inputTitle = ref('')
const categoryId = ref('7')
const currentCategory = computed(() => CATEGORY_MAP[categoryId.value] || CATEGORY_MAP['7'])

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
  if (!validateBase(fieldRegistry))
    return

  const latestApps = JSON.parse(JSON.stringify(relatedApps.value))

  const payload = {
    id: isEditMode.value ? recordId.value : `${Date.now()}`,
    categoryId: categoryId.value,
    name: inputTitle.value.trim() || '个人社保卡',
    account: formData.value.cardNumber,
    password: formData.value.password,
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
  <view class="bg-[#050508] text-white">
    <Header :title="isEditMode ? '编辑医疗社保' : title" fixed @back="uni.navigateBack()" />

    <view class="px-6 py-4">
      <RecordNameCard v-model="inputTitle" :icon="currentCategory.icon" placeholder="记录名称 (如: 个人社保)" />

      <FieldGroup>
        <FieldItem v-model="formData.cardNumber" name="cardNumber" label="卡号" placeholder="医保/社保卡号" />
        <FieldItem v-model="formData.password" name="password" label="查询密码" type="password" placeholder="请输入系统查询密码" />
        <FieldItem v-model="formData.fundAccount" name="fundAccount" label="公积金号" placeholder="请输入公积金账号" />
        <FieldItem v-model="formData.hospital" name="hospital" label="定点医院" is-last placeholder="绑定的定点医院" />
      </FieldGroup>

      <RelatedAppsCard v-model="relatedApps" />
      <BottomButton @save="handleSave" />
    </view>
  </view>
</template>

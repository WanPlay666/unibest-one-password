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

// 1. 初始化引擎：定义社交账号字段契约
const { formData, isEditMode, recordId, init, getRawData } = useFormEngine({
  platform: '',
  account: '',
  payPassword: '',
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
const title = ref('社交账号')
const inputTitle = ref('')
const categoryIcon = ref('i-carbon-chat')
const categoryId = ref('6')

onLoad((options: any) => {
  init(options, (data) => {
    inputTitle.value = data.name
    categoryId.value = String(data.categoryId)
    setRelatedApps(data.relatedApps || [])
  })

  if (!isEditMode.value && options) {
    title.value = options.title || '社交账号'
    categoryIcon.value = options.icon || 'i-carbon-chat'
    categoryId.value = options.id || '6'
  }
})

// 4. 保存逻辑
async function handleSave() {
  // A. 执行基础必填验证
  if (!validateBase(fieldRegistry))
    return

  // 获取最新状态快照
  const latestApps = JSON.parse(JSON.stringify(relatedApps.value))

  const payload = {
    id: isEditMode.value ? recordId.value : `${Date.now()}`,
    categoryId: categoryId.value,
    // 逻辑：优先用别名，否则用平台+账号
    name: inputTitle.value.trim() || `${formData.value.platform} (${formData.value.account})`,
    account: formData.value.account,
    password: formData.value.payPassword,
    relatedApps: latestApps,
    rawData: getRawData(fieldRegistry, latestApps),
    updatedAt: Date.now(),
  }

  try {
    await saveRecord(payload, isEditMode.value, recordId.value)
    uni.showToast({ title: '已安全保存', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
  }
  catch (e) {
    uni.showToast({ title: '存储异常', icon: 'none' })
  }
}
</script>

<template>
  <view class="min-h-screen bg-[#050508] text-white pt-safe">
    <Header :title="isEditMode ? '编辑社交账号' : title" fixed @back="uni.navigateBack()" />

    <view class="px-6 py-4">
      <RecordNameCard v-model="inputTitle" :icon="categoryIcon" placeholder="记录名称 (如: 私人微信)" />

      <FieldGroup>
        <FieldItem v-model="formData.platform" name="platform" label="平台" placeholder="微信/QQ/微博/TikTok" />
        <FieldItem v-model="formData.account" name="account" label="账号" placeholder="手机号/微信号/UID" />
        <FieldItem
          v-model="formData.payPassword" name="payPassword" label="密码" type="password"
          placeholder="请输入密码/支付密码" is-last
        />
      </FieldGroup>

      <RelatedAppsCard v-model="relatedApps" />
      <BottomButton @save="handleSave" />
    </view>
  </view>
</template>

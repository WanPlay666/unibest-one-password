<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, provide, reactive, ref } from 'vue'
import { useFormEngine } from '@/composables/useFormEngine'
import { useFormValidation } from '@/composables/useFormValidation'
import { useRelatedItems } from '@/composables/useRelatedItems'
import { useVaultStore } from '@/composables/useVaultStore'
import { CATEGORY_MAP } from '@/utils/config'
import { getFormDataInitial } from '@/utils/importSchema'

// 1. 初始化引擎 - 字段清单从 Schema 派生
const { formData, isEditMode, recordId, init, getRawData } = useFormEngine(getFormDataInitial('identity'))

const { validateBase } = useFormValidation()
const { saveRecord } = useVaultStore()
const { items: relatedApps, setItems: setRelatedApps } = useRelatedItems()
const fieldRegistry = reactive(new Map<string, any>())

provide('formManager', {
  register: (name, meta) => fieldRegistry.set(name, meta),
  update: (name, meta) => fieldRegistry.set(name, meta),
  unregister: name => fieldRegistry.delete(name),
})

// 2. 初始化与生命周期
const title = ref('身份信息')
const inputTitle = ref('')
const categoryId = ref('2')
const currentCategory = computed(() => CATEGORY_MAP[categoryId.value] || CATEGORY_MAP['2'])
const idTypeOptions = ['身份证', '护照', '港澳通行证', '驾驶证', '社保卡']
const handleTypeChange = e => formData.value.idType = idTypeOptions[e.detail.value]
const handleDateSelect = (field, e) => formData.value[field] = e.detail.value

onLoad((options) => {
  init(options, (data) => {
    inputTitle.value = data.name
    categoryId.value = String(data.categoryId)
    setRelatedApps(data.relatedApps || [])
  })
  if (!isEditMode.value && options?.id) {
    categoryId.value = options.id
  }
})

// 3. 业务校验逻辑
function validate() {
  if (!validateBase(fieldRegistry))
    return false

  const idNum = formData.value.idNumber
  if (idNum && !/^[a-z0-9]+$/i.test(idNum)) {
    uni.showToast({ title: '证件号码仅支持数字和字母', icon: 'none' })
    return false
  }
  return true
}

/**
 * 保存执行
 */
async function handleSave() {
  if (!validate())
    return

  // 关键：获取最新的相关应用数据快照
  const latestRelatedApps = JSON.parse(JSON.stringify(relatedApps.value))

  // 构造最终存储的 Payload
  const payload = {
    // 基础元数据
    id: isEditMode.value ? recordId.value : `${Date.now()}`,
    categoryId: categoryId.value,
    name: inputTitle.value.trim() || formData.value.realName || '未命名身份',

    // 业务主键
    account: String(formData.value.idNumber).trim(),
    password: '',

    // 编辑回显的核心：必须存入根节点
    relatedApps: latestRelatedApps,

    // 详情展示的核心：自描述数组
    rawData: getRawData(fieldRegistry, latestRelatedApps),

    updatedAt: Date.now(),
  }

  try {
    // 调用 useVaultStore 中的保存方法
    await saveRecord(payload, isEditMode.value, recordId.value)
    uni.showToast({ title: '已安全存入', icon: 'success' })
    // 延迟返回，确保用户看到成功提示
    setTimeout(() => uni.navigateBack(), 800)
  }
  catch (e) {
    uni.showToast({ title: '存储异常', icon: 'none' })
  }
}
</script>

<template>
  <view class="min-h-screen bg-[#050508] text-white pt-safe">
    <Header :title="isEditMode ? '编辑记录' : title" fixed @back="uni.navigateBack()" />
    <view class="px-6 py-4">
      <RecordNameCard v-model="inputTitle" :icon="currentCategory.icon" />
      <view class="mt-6">
        <FieldGroup>
          <picker mode="selector" :range="idTypeOptions" @change="handleTypeChange">
            <FieldItem v-model="formData.idType" name="idType" label="证件类型" required readonly show-arrow />
          </picker>
          <FieldItem v-model="formData.realName" name="realName" label="姓名" required />
          <FieldItem v-model="formData.idNumber" name="idNumber" label="号码" required type="idcard" />
          <FieldItem v-model="formData.phone" name="phone" label="手机号码" type="phone" placeholder="输入手机号码" />
          <picker mode="date" @change="(e) => handleDateSelect('validFrom', e)">
            <FieldItem v-model="formData.validFrom" name="validFrom" label="生效日期" readonly show-calendar />
          </picker>
          <picker mode="date" @change="(e) => handleDateSelect('validTo', e)">
            <FieldItem v-model="formData.validTo" name="validTo" label="失效日期" readonly show-calendar />
          </picker>
          <FieldItem v-model="formData.authority" name="authority" label="签发机关" is-last />
        </FieldGroup>
      </view>
      <RelatedAppsCard v-model="relatedApps" />
      <BottomButton @save="handleSave" />
    </view>
  </view>
</template>

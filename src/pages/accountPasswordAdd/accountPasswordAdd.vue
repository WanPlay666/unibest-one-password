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
// 核心 Composables 与工具
import { useRelatedItems } from '@/composables/useRelatedItems'
import { useVaultStore } from '@/composables/useVaultStore'
import { CATEGORY_MAP } from '@/utils/config'
import { getFormDataInitial } from '@/utils/importSchema'
import { checkPasswordStrength } from '@/utils/password-strength'

// 1. 初始化引擎与状态
const { formData, isEditMode, recordId, init, getRawData } = useFormEngine(getFormDataInitial('login'))
const { items: relatedApps, setItems: setRelatedApps } = useRelatedItems()
const { saveRecord } = useVaultStore()
const { validateBase } = useFormValidation()

const categoryId = ref('1')
const inputTitle = ref('')
const isSaving = ref(false)

// 动态 UI 表现 (不参与存储)
const currentCategory = computed(() => CATEGORY_MAP[categoryId.value] || CATEGORY_MAP['1'])
const strength = computed(() => checkPasswordStrength(formData.value.password))

// --- 2. 表单注册中心 ---
const fieldRegistry = reactive(new Map<string, any>())
provide('formManager', {
  register: (name: string, meta: any) => fieldRegistry.set(name, meta),
  update: (name: string, meta: any) => fieldRegistry.set(name, meta),
  unregister: (name: string) => fieldRegistry.delete(name),
})

// --- 3. 生命周期与回显 ---
onLoad((options: any) => {
  init(options, (data) => {
    // 处理非通用字段回显
    inputTitle.value = data.name
    categoryId.value = String(data.categoryId)
    setRelatedApps(data.relatedApps || [])
  })

  if (!isEditMode.value && options?.id) {
    categoryId.value = options.id
  }
})

// --- 4. 业务逻辑拆解 (SRP) ---

/**
 * 职责：本页特有校验
 */
function validate(): boolean {
  if (!validateBase(fieldRegistry))
    return false

  const { account, password } = formData.value
  if (!account && !password) {
    uni.showToast({ title: '账号和密码至少填写一项', icon: 'none' })
    return false
  }
  return true
}

/**
 * 职责：执行保存
 */
async function handleSave() {
  if (isSaving.value)
    return
  if (!validate())
    return
  isSaving.value = true

  // 获取最新的相关应用快照，确保响应式数据已同步
  const finalRelatedApps = JSON.parse(JSON.stringify(relatedApps.value))

  const payload = {
    id: isEditMode.value ? recordId.value : `${Date.now()}`,
    categoryId: categoryId.value,
    // 逻辑：优先取手动输入的标题，其次取账号名
    name: inputTitle.value.trim() || formData.value.account || '未命名记录',
    account: String(formData.value.account).trim(),
    password: formData.value.password,
    relatedApps: finalRelatedApps, // 根节点存储供编辑回显
    rawData: getRawData(fieldRegistry, finalRelatedApps), // 整合供详情展示
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
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <view class="bg-[#050508] text-white">
    <Header :title="isEditMode ? '编辑记录' : '新增账号'" fixed @back="uni.navigateBack()" />

    <view class="px-5 py-4">
      <RecordNameCard v-model="inputTitle" :icon="currentCategory.icon" />

      <FieldGroup>
        <FieldItem v-model="formData.account" name="account" label="账号" required placeholder="手机/邮箱/用户名" />
        <FieldItem v-model="formData.password" name="password" label="密码" required type="password" placeholder="输入登录密码"
          show-copy :is-last="true" />
        <FieldItem v-model="formData.phone" name="phone" label="手机号码" type="phone" placeholder="输入手机号码" />


      </FieldGroup>

      <!-- <StrengthSlider :strength-score="strength.score" :strength-color="strength.color" /> -->

      <RelatedAppsCard v-model="relatedApps" />

      <BottomButton :loading="isSaving" @save="handleSave" />
    </view>
  </view>
</template>

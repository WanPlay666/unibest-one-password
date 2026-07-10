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
// 导入核心 Composables
import { useVaultStore } from '@/composables/useVaultStore'
import { CATEGORY_MAP } from '@/utils/config'
import { getFormDataInitial } from '@/utils/importSchema'

// 1. 初始化引擎 - 字段清单从 Schema 派生
const { formData, isEditMode, recordId, init, getRawData } = useFormEngine(getFormDataInitial('bank'))

const { items: relatedApps, setItems: setRelatedApps } = useRelatedItems()
const { saveRecord } = useVaultStore()
const { validateBase } = useFormValidation()

// 页面基础 UI 状态
const title = ref('添加银行卡')
const inputTitle = ref('')
const categoryId = ref('3')
const currentCategory = computed(() => CATEGORY_MAP[categoryId.value] || CATEGORY_MAP['3'])

// --- 2. 表单注册中心 ---
const fieldRegistry = reactive(new Map<string, any>())
provide('formManager', {
  register: (name, meta) => fieldRegistry.set(name, meta),
  update: (name, meta) => fieldRegistry.set(name, meta),
  unregister: name => fieldRegistry.delete(name),
})

// --- 3. 生命周期与数据初始化 ---
onLoad((options: any) => {
  init(options, (data) => {
    // 引擎自动映射字段后，在此处理非通用字段
    inputTitle.value = data.name
    categoryId.value = String(data.categoryId)
    if (data.relatedApps) {
      setRelatedApps(data.relatedApps)
    }
  })

  if (!isEditMode.value && options?.id) {
    categoryId.value = options.id
  }
})

// --- 4. 业务逻辑 ---

const cardTypeOptions = ['储蓄卡', '信用卡', '其它']

function handleTypeChange(e: any) {
  formData.value.cardType = cardTypeOptions[e.detail.value]
}

function validate(): boolean {
  // A. 基础必填校验 (由注册中心自动完成)
  if (!validateBase(fieldRegistry))
    return false

  // B. 银行卡号特殊校验
  if (formData.value.cardNumber && formData.value.cardNumber.length < 12) {
    uni.showToast({ title: '银行卡号位数不足', icon: 'none' })
    return false
  }
  return true
}

async function handleSave() {
  if (!validate())
    return

  // 关键：强制深拷贝当前相关应用状态，断开响应式引用干扰
  const finalRelatedApps = JSON.parse(JSON.stringify(relatedApps.value))

  const payload = {
    id: isEditMode.value ? recordId.value : `${Date.now()}`,
    categoryId: categoryId.value,
    // 逻辑：优先用别名，否则用银行名+卡号后四位
    name: inputTitle.value.trim() || `${formData.value.bankName} (${formData.value.cardNumber.slice(-4)})`,
    account: formData.value.cardNumber,
    password: '',
    relatedApps: finalRelatedApps, // 根路径存储，解决编辑回显失效
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
    <Header :title="isEditMode ? '编辑银行卡' : title" fixed @back="uni.navigateBack()" />

    <view class="px-6 py-4">
      <RecordNameCard v-model="inputTitle" :icon="currentCategory.icon" placeholder="记录别名 (如: 招商工资卡)" />

      <FieldGroup>
        <FieldItem v-model="formData.bankName" name="bankName" label="银行名称" required placeholder="如: 招商银行" />

        <picker mode="selector" :range="cardTypeOptions" @change="handleTypeChange">
          <FieldItem
            v-model="formData.cardType" name="cardType" label="卡片类型" required readonly show-arrow
            placeholder="请选择卡片类型"
          />
        </picker>

        <FieldItem
          v-model="formData.cardNumber" name="cardNumber" label="卡号" type="tel" required
          placeholder="请输入银行卡号"
        />

        <FieldItem v-model="formData.holderName" name="holderName" label="持卡人" required is-last placeholder="请输入姓名" />
      </FieldGroup>

      <FieldGroup>
        <FieldItem v-model="formData.phone" name="phone" label="预留手机" type="tel" placeholder="可选" />
        <FieldItem v-model="formData.cvv" name="cvv" label="CVV / 有效期" placeholder="信用卡专用 (如: 123 / 09-28)" />
        <FieldItem v-model="formData.remark" name="remark" label="备注说明" is-last placeholder="可选" />
      </FieldGroup>

      <RelatedAppsCard v-model="relatedApps" />

      <BottomButton @save="handleSave" />
    </view>
  </view>
</template>

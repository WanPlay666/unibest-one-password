<script lang="ts" setup>
import { provide } from 'vue'
import BottomButton from '@/components/addCategory/BottomButton.vue'
import FieldGroup from '@/components/addCategory/FieldGroup.vue'
import FieldItem from '@/components/addCategory/FieldItem.vue'
import RecordNameCard from '@/components/addCategory/RecordNameCard.vue'
import RelatedAppsCard from '@/components/addCategory/RelatedAppsCard.vue'
import Header from '@/components/Header.vue'
import { useRecordForm } from '@/composables/useRecordForm'

const cardTypeOptions = ['储蓄卡', '信用卡', '其它']
function handleTypeChange(e: any) {
  formData.value.cardType = cardTypeOptions[e.detail.value]
}

const {
  formData,
  isEditMode,
  fieldRegistry,
  inputTitle,
  currentCategory,
  pageTitle,
  handleSave,
} = useRecordForm({
  type: 'bank',
  title: '添加银行卡',
  fieldMapping: (f) => ({
    account: f.cardNumber || '',
    nameFallback: f.bankName
      ? `${f.bankName} (${(f.cardNumber || '').slice(-4)})`
      : '未命名银行卡',
  }),
  extraValidate: () => {
    if (formData.value.cardNumber && formData.value.cardNumber.length < 12) {
      uni.showToast({ title: '银行卡号位数不足', icon: 'none' })
      return false
    }
    return true
  },
})

provide('formManager', {
  register: (name: string, meta: any) => fieldRegistry.set(name, meta),
  update: (name: string, meta: any) => fieldRegistry.set(name, meta),
  unregister: (name: string) => fieldRegistry.delete(name),
})
</script>

<template>
  <view class="bg-[#050508] text-white">
    <Header :title="isEditMode ? '编辑银行卡' : pageTitle" fixed @back="uni.navigateBack()" />

    <view class="px-5 py-4">
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
      <BottomButton :loading="isSaving" @save="handleSave" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { provide } from 'vue'
import BottomButton from '@/components/addCategory/BottomButton.vue'
import FieldGroup from '@/components/addCategory/FieldGroup.vue'
import FieldItem from '@/components/addCategory/FieldItem.vue'
import RecordNameCard from '@/components/addCategory/RecordNameCard.vue'
import RelatedAppsCard from '@/components/addCategory/RelatedAppsCard.vue'
import Header from '@/components/Header.vue'
import { useRecordForm } from '@/composables/useRecordForm'

const {
  formData,
  isEditMode,
  fieldRegistry,
  relatedApps,
  inputTitle,
  currentCategory,
  pageTitle,
  handleSave,
} = useRecordForm({
  type: 'business',
  title: '企业开票',
  fieldMapping: (f) => ({
    account: f.taxId || '',
    nameFallback: f.companyName || '未命名企业',
  }),
  extraValidate: () => {
    if (formData.value.taxId && formData.value.taxId.length < 15) {
      uni.showToast({ title: '纳税人识别号格式不正确', icon: 'none' })
      return false
    }
    return true
  },
})

provide('formManager', {
  register: (name, meta) => fieldRegistry.set(name, meta),
  update: (name, meta) => fieldRegistry.set(name, meta),
  unregister: name => fieldRegistry.delete(name),
})
</script>

<template>
  <view class="bg-[#050508] text-white">
    <Header :title="isEditMode ? '编辑发票信息' : pageTitle" fixed @back="uni.navigateBack()" />
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

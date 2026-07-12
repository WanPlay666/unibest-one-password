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
  type: 'social',
  title: '社交账号',
  fieldMapping: (f) => ({
    account: f.account || '',
    password: f.payPassword || '',
    nameFallback: f.platform || '未命名社交账号',
  }),
})

provide('formManager', {
  register: (name, meta) => fieldRegistry.set(name, meta),
  update: (name, meta) => fieldRegistry.set(name, meta),
  unregister: name => fieldRegistry.delete(name),
})
</script>

<template>
  <view class="min-h-screen bg-[#050508] text-white pt-safe">
    <Header :title="isEditMode ? '编辑社交账号' : pageTitle" fixed @back="uni.navigateBack()" />
    <view class="px-5 py-4">
      <RecordNameCard v-model="inputTitle" :icon="currentCategory.icon" placeholder="记录名称 (如: 私人微信)" />

      <FieldGroup>
        <FieldItem v-model="formData.platform" name="platform" label="平台" required placeholder="如: 微信" />
        <FieldItem v-model="formData.account" name="account" label="账号" required is-last placeholder="如: wxid_xxx" />
      </FieldGroup>

      <FieldGroup>
        <FieldItem
          v-model="formData.payPassword" name="payPassword" label="支付密码" type="password"
          show-copy is-last placeholder="如: 微信支付密码"
        />
      </FieldGroup>

      <RelatedAppsCard v-model="relatedApps" />
      <BottomButton @save="handleSave" />
    </view>
  </view>
</template>

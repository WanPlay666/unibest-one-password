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
  type: 'software',
  title: '软件授权',
  fieldMapping: (f) => ({
    account: f.licenseKey || '',
    nameFallback: f.softwareName || '未命名授权',
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
    <Header :title="isEditMode ? '编辑授权' : pageTitle" fixed @back="uni.navigateBack()" />
    <view class="px-5 py-4">
      <RecordNameCard v-model="inputTitle" :icon="currentCategory.icon" placeholder="记录名称 (如: 办公软件)" :required="true" />

      <FieldGroup>
        <FieldItem v-model="formData.softwareName" name="softwareName" label="软件名称" required placeholder="请输入软件名称" />
        <FieldItem v-model="formData.licenseKey" name="licenseKey" label="激活码" placeholder="License Key / Serial Number" />
        <FieldItem v-model="formData.limitation" name="limitation" label="限制条件" placeholder="如: 3台设备 / 永久授权" is-last />
      </FieldGroup>

      <RelatedAppsCard v-model="relatedApps" />
      <BottomButton :loading="isSaving" @save="handleSave" />
    </view>
  </view>
</template>

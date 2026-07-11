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
  type: 'wifi',
  title: 'Wi-Fi 网络',
  fieldMapping: (f) => ({
    account: f.ssid || '',
    password: f.wifiPassword || '',
    nameFallback: f.ssid || '未命名网络',
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
    <Header :title="isEditMode ? '编辑 Wi-Fi' : pageTitle" fixed @back="uni.navigateBack()" />
    <view class="px-6 py-4">
      <RecordNameCard v-model="inputTitle" :icon="currentCategory.icon" placeholder="记录名称 (如: 家里宽带)" />

      <FieldGroup>
        <FieldItem v-model="formData.ssid" name="ssid" label="网络名称" required placeholder="请输入 Wi-Fi 名称" />
        <FieldItem v-model="formData.wifiPassword" name="wifiPassword" label="Wi-Fi密码" required placeholder="请输入 Wi-Fi 密码" is-last />
      </FieldGroup>

      <FieldGroup>
        <FieldItem v-model="formData.adminAccount" name="adminAccount" label="后台账号" placeholder="路由器管理账号" />
        <FieldItem v-model="formData.adminPassword" name="adminPassword" label="后台密码" placeholder="路由器管理密码" is-last />
      </FieldGroup>

      <RelatedAppsCard v-model="relatedApps" />
      <BottomButton @save="handleSave" />
    </view>
  </view>
</template>

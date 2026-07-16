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
  isSaving,
  handleSave,
} = useRecordForm({
  type: 'login',
  title: '基础登录',
  fieldMapping: f => ({
    account: f.account || '',
    password: f.password || '',
    nameFallback: f.account || '未命名账号',
  }),
})

provide('formManager', {
  register: (name: string, meta: any) => fieldRegistry.set(name, meta),
  update: (name: string, meta: any) => fieldRegistry.set(name, meta),
  unregister: (name: string) => fieldRegistry.delete(name),
})
</script>

<template>
  <view class="min-h-screen bg-[#050508] text-white">
    <Header :title="isEditMode ? '编辑记录' : pageTitle" fixed @back="uni.navigateBack()" />

    <view class="px-5 py-4">
      <RecordNameCard v-model="inputTitle" :icon="currentCategory.icon" :required="true" />

      <FieldGroup>
        <FieldItem v-model="formData.account" name="account" label="账号" required placeholder="手机/邮箱/用户名" />
        <FieldItem v-model="formData.password" name="password" label="密码" required type="password" placeholder="输入登录密码"
          show-copy :is-last="true" />
        <FieldItem v-model="formData.phone" name="phone" label="手机号码" type="phone" placeholder="输入手机号码" />
      </FieldGroup>

      <RelatedAppsCard v-model="relatedApps" />

      <BottomButton :loading="isSaving" @save="handleSave" />
    </view>
  </view>
</template>

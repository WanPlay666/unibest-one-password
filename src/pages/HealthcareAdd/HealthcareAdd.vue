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
  type: 'medical',
  title: '医疗社保',
  fieldMapping: (f) => ({
    account: f.cardNumber || '',
    password: f.password || '',
    nameFallback: f.cardNumber || '个人社保卡',
  }),
})

provide('formManager', {
  register: (name, meta) => fieldRegistry.set(name, meta),
  update: (name, meta) => fieldRegistry.set(name, meta),
  unregister: name => fieldRegistry.delete(name),
})
</script>

<template>
  <view class="bg-[#050508] text-white">
    <Header :title="isEditMode ? '编辑医疗社保' : pageTitle" fixed @back="uni.navigateBack()" />
    <view class="px-5 py-4">
      <RecordNameCard v-model="inputTitle" :icon="currentCategory.icon" placeholder="记录名称 (如: 个人社保)" :required="true" />

      <FieldGroup>
        <FieldItem v-model="formData.cardNumber" name="cardNumber" label="卡号" required placeholder="医保/社保卡号" />
        <FieldItem v-model="formData.password" name="password" label="查询密码" type="password" placeholder="请输入系统查询密码" />
        <FieldItem v-model="formData.fundAccount" name="fundAccount" label="公积金号" placeholder="请输入公积金账号" />
        <FieldItem v-model="formData.hospital" name="hospital" label="定点医院" is-last placeholder="绑定的定点医院" />
      </FieldGroup>

      <RelatedAppsCard v-model="relatedApps" />
      <BottomButton :loading="isSaving" @save="handleSave" />
    </view>
  </view>
</template>

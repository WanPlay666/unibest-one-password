<script lang="ts" setup>
import { provide } from 'vue'
import BottomButton from '@/components/addCategory/BottomButton.vue'
import FieldGroup from '@/components/addCategory/FieldGroup.vue'
import FieldItem from '@/components/addCategory/FieldItem.vue'
import RecordNameCard from '@/components/addCategory/RecordNameCard.vue'
import RelatedAppsCard from '@/components/addCategory/RelatedAppsCard.vue'
import Header from '@/components/Header.vue'
import { useRecordForm } from '@/composables/useRecordForm'

function handleDateSelect(field: 'registerDate' | 'insuranceExpiry', e: any) {
  formData.value[field] = e.detail.value
}

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
  type: 'vehicle',
  title: '车辆信息',
  fieldMapping: (f) => ({
    account: f.plateNumber || '',
    nameFallback: f.plateNumber || '未命名车辆',
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
    <Header :title="isEditMode ? '编辑车辆信息' : pageTitle" fixed @back="uni.navigateBack()" />
    <view class="px-5 py-4">
      <RecordNameCard v-model="inputTitle" :icon="currentCategory.icon" placeholder="记录名称 (如: 我的爱车)" />

      <FieldGroup>
        <FieldItem v-model="formData.plateNumber" name="plateNumber" label="车牌号" required placeholder="粤B·XXXXX" />
        <FieldItem v-model="formData.vin" name="vin" label="识别号 (VIN)" placeholder="车辆识别代码" />
        <FieldItem v-model="formData.engineNumber" name="engineNumber" label="发动机号" placeholder="请输入发动机号" />

        <picker mode="date" @change="(e) => handleDateSelect('registerDate', e)">
          <FieldItem
            v-model="formData.registerDate" name="registerDate" label="注册日期" readonly placeholder="年 / 月 / 日"
            show-calendar
          />
        </picker>

        <FieldItem v-model="formData.insurance" name="insurance" label="保险信息" placeholder="保险公司及保单号" />

        <picker mode="date" @change="(e) => handleDateSelect('insuranceExpiry', e)">
          <FieldItem
            v-model="formData.insuranceExpiry" name="insuranceExpiry" label="到期日" readonly
            placeholder="保险到期日" show-calendar is-last
          />
        </picker>
      </FieldGroup>

      <RelatedAppsCard v-model="relatedApps" />
      <BottomButton :loading="isSaving" @save="handleSave" />
    </view>
  </view>
</template>

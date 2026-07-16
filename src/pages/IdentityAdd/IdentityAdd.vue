<script lang="ts" setup>
import { provide } from 'vue'
import BottomButton from '@/components/addCategory/BottomButton.vue'
import FieldGroup from '@/components/addCategory/FieldGroup.vue'
import FieldItem from '@/components/addCategory/FieldItem.vue'
import RecordNameCard from '@/components/addCategory/RecordNameCard.vue'
import RelatedAppsCard from '@/components/addCategory/RelatedAppsCard.vue'
import Header from '@/components/Header.vue'
import { useRecordForm } from '@/composables/useRecordForm'

const idTypeOptions = ['身份证', '护照', '港澳通行证', '驾驶证', '社保卡']
function handleTypeChange(e: any) {
  formData.value.idType = idTypeOptions[e.detail.value]
}
function handleDateSelect(field: string, e: any) {
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
  type: 'identity',
  title: '身份信息',
  fieldMapping: (f) => ({
    account: f.idNumber || '',
    nameFallback: f.realName || '未命名身份',
  }),
  extraValidate: () => {
    if (formData.value.idNumber && !/^[a-z0-9]+$/i.test(formData.value.idNumber)) {
      uni.showToast({ title: '证件号码仅支持数字和字母', icon: 'none' })
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
  <view class="min-h-screen bg-[#050508] text-white pt-safe">
    <Header :title="isEditMode ? '编辑记录' : pageTitle" fixed @back="uni.navigateBack()" />
    <view class="px-5 py-4">
      <RecordNameCard v-model="inputTitle" :icon="currentCategory.icon" :required="true" />
      <view class="mt-6">
        <FieldGroup>
          <picker mode="selector" :range="idTypeOptions" @change="handleTypeChange">
            <FieldItem v-model="formData.idType" name="idType" label="证件类型" required readonly show-arrow />
          </picker>
          <FieldItem v-model="formData.realName" name="realName" label="姓名" required />
          <FieldItem v-model="formData.idNumber" name="idNumber" label="号码" required type="idcard" />
          <picker mode="date" @change="(e) => handleDateSelect('validFrom', e)">
            <FieldItem v-model="formData.validFrom" name="validFrom" label="生效日期" readonly show-calendar />
          </picker>
          <picker mode="date" @change="(e) => handleDateSelect('validTo', e)">
            <FieldItem v-model="formData.validTo" name="validTo" label="失效日期" readonly show-calendar />
          </picker>
          <FieldItem v-model="formData.authority" name="authority" label="签发机关" is-last />
        </FieldGroup>
      </view>
      <RelatedAppsCard v-model="relatedApps" />
      <BottomButton :loading="isSaving" @save="handleSave" />
    </view>
  </view>
</template>

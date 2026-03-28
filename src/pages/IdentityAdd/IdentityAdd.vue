<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import BottomButton from '@/components/addCategory/BottomButton.vue'
import FieldGroup from '@/components/addCategory/FieldGroup.vue'
import FieldItem from '@/components/addCategory/FieldItem.vue'
import RecordNameCard from '@/components/addCategory/RecordNameCard.vue'
import Header from '@/components/Header.vue'

definePage({
  style: { navigationStyle: 'custom' },
})

const title = ref('')
const inputTitle = ref('')
const bgColor = ref('')
const categoryIcon = ref('')

const formData = ref({
  idType: '',
  realName: '',
  idNumber: '',
  validFrom: '',
  validTo: '',
  authority: '',
})

const idTypeOptions = ['身份证', '护照', '港澳通行证', '驾驶证', '社保卡']

function handleTypeChange(e: any) {
  const index = e.detail.value
  formData.value.idType = idTypeOptions[index]
}

function handleDateSelect(field: 'validFrom' | 'validTo', e: any) {
  formData.value[field] = e.detail.value
}

onLoad((options: any) => {
  if (options) {
    title.value = options.title || '身份信息'
    bgColor.value = options.color || 'bg-indigo-500'
    categoryIcon.value = options.icon || 'i-carbon-user'
  }
})

function handleBack() {
  uni.navigateBack()
}

function handleSave() {
  console.log('保存身份信息:', { title: inputTitle.value, ...formData.value })
  uni.navigateBack()
}
</script>

<template>
  <view class="bg-[#050508] text-white pt-safe pb-safe">
    <Header :title="title" fixed @back="handleBack" />
    <view class="px-6">
      <view class="mt-6">
        <RecordNameCard v-model="inputTitle" :icon="categoryIcon" placeholder="记录别名 (如: 身份证)" />
      </view>
      <view class="mt-6">
        <FieldGroup>
          <picker mode="selector" :range="idTypeOptions" @change="handleTypeChange">
            <FieldItem v-model="formData.idType" label="证件类型" placeholder="请选择证件类型" :show-arrow="true" />
          </picker>

          <FieldItem v-model="formData.realName" label="真实姓名" placeholder="请输入真实姓名" />
          <FieldItem v-model="formData.idNumber" label="证件号码" placeholder="请输入证件号码" />

          <picker mode="date" @change="(e) => handleDateSelect('validFrom', e)">
            <FieldItem v-model="formData.validFrom" label="有效期（起）" placeholder="年 /月/日" :show-calendar="true" />
          </picker>

          <picker mode="date" @change="(e) => handleDateSelect('validTo', e)">
            <FieldItem v-model="formData.validTo" label="有效期（止）" placeholder="年 /月/日" :show-calendar="true" />
          </picker>

          <FieldItem v-model="formData.authority" label="签发机关" placeholder="请输入签发机关" :is-last="true" />
        </FieldGroup>
      </view>
      <view class="mt-6">
        <BottomButton @save="handleSave" />
      </view>
    </view>
  </view>
</template>

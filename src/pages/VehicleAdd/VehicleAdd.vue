<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import BottomButton from '@/components/addCategory/BottomButton.vue'
import FieldGroup from '@/components/addCategory/FieldGroup.vue'
import FieldItem from '@/components/addCategory/FieldItem.vue'
import RecordNameCard from '@/components/addCategory/RecordNameCard.vue'
import RelatedAppsCard from '@/components/addCategory/RelatedAppsCard.vue'
import Header from '@/components/Header.vue'

definePage({
  style: { navigationStyle: 'custom' },
})

const title = ref('')
const inputTitle = ref('')
const bgColor = ref('')
const categoryIcon = ref('')

onLoad((options: any) => {
  if (options) {
    title.value = options.title || '车辆信息'
    bgColor.value = options.color || 'bg-orange-500'
    categoryIcon.value = options.icon || 'i-carbon-car'
  }
})

const formData = ref({
  plateNumber: '',
  vin: '',
  engineNumber: '',
  registerDate: '',
  insurance: '',
  insuranceExpiry: '',
})
const relatedApps = ref<string[]>([])

function handleDateSelect(field: 'registerDate' | 'insuranceExpiry', e: any) {
  formData.value[field] = e.detail.value
}

function handleBack() {
  uni.navigateBack()
}

function handleSave() {
  console.log('保存:', {
    name: inputTitle.value,
    ...formData.value,
    relatedApps: relatedApps.value,
  })
  uni.navigateBack()
}
</script>

<template>
  <view class="bg-[#050508] px-6 text-white pt-safe pb-safe">
    <Header :title="title" fixed @back="handleBack" />
    <view class="mt-6">
      <RecordNameCard v-model="inputTitle" :icon="categoryIcon" placeholder="记录名称 (如: 我的爱车)" />
    </view>

    <view class="mt-6">
      <FieldGroup>
        <FieldItem v-model="formData.plateNumber" label="车牌号" placeholder="粤B·XXXXX" />
        <FieldItem v-model="formData.vin" label="车辆识别号 (VIN)" placeholder="请输入车辆识别代码" />
        <FieldItem v-model="formData.engineNumber" label="发动机号" placeholder="请输入发动机号" />

        <picker mode="date" @change="(e) => handleDateSelect('registerDate', e)">
          <FieldItem v-model="formData.registerDate" label="注册日期" placeholder="年 /月/日" :show-calendar="true" />
        </picker>

        <FieldItem v-model="formData.insurance" label="保险公司及保单号" placeholder="请输入保险信息" />

        <picker mode="date" @change="(e) => handleDateSelect('insuranceExpiry', e)">
          <FieldItem v-model="formData.insuranceExpiry" label="保险到期日" placeholder="年 /月/日" :show-calendar="true" :is-last="true" />
        </picker>
      </FieldGroup>
    </view>

    <view class="mt-6">
      <RelatedAppsCard v-model="relatedApps" label="关联网址 / APP" placeholder="绑定网址/app名称" />
    </view>

    <view class="mt-6">
      <BottomButton @save="handleSave" />
    </view>
  </view>
</template>

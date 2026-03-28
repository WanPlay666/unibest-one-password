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
    title.value = options.title || '企业开票'
    bgColor.value = options.color || 'bg-pink-400'
    categoryIcon.value = options.icon || 'i-carbon-receipt'
  }
})

const formData = ref({
  companyName: '',
  taxId: '',
  addressPhone: '',
  bankAccount: '',
  email: '',
})
const relatedApps = ref<string[]>([])

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
      <RecordNameCard v-model="inputTitle" :icon="categoryIcon" placeholder="记录名称 (如: 公司发票)" />
    </view>

    <view class="mt-6">
      <FieldGroup>
        <FieldItem v-model="formData.companyName" label="公司全称" placeholder="请输入公司全称" />
        <FieldItem v-model="formData.taxId" label="纳税人识别号" placeholder="请输入统一社会信用代码" />
        <FieldItem v-model="formData.addressPhone" label="注册地址与电话" placeholder="请输入地址与电话" />
        <FieldItem v-model="formData.bankAccount" label="开户行及账号" placeholder="请输入开户行及账号" />
        <FieldItem v-model="formData.email" label="电子发票接收邮箱" type="text" placeholder="请输入邮箱地址" :is-last="true" />
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

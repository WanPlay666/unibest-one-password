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
    title.value = options.title || '医疗社保'
    bgColor.value = options.color || 'bg-red-500'
    categoryIcon.value = options.icon || 'i-carbon-stethoscope'
  }
})

const formData = ref({
  cardNumber: '',
  password: '',
  fundAccount: '',
  hospital: '',
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
      <RecordNameCard v-model="inputTitle" :icon="categoryIcon" placeholder="记录名称 (如: 个人社保)" />
    </view>

    <view class="mt-6">
      <FieldGroup>
        <FieldItem v-model="formData.cardNumber" label="医保/社保卡号" placeholder="请输入医保/社保卡号" />
        <FieldItem v-model="formData.password" label="系统查询密码" type="password" placeholder="请输入查询密码" />
        <FieldItem v-model="formData.fundAccount" label="公积金账号" placeholder="请输入公积金账号" />
        <FieldItem v-model="formData.hospital" label="定点医院" placeholder="请输入绑定的定点医院" :is-last="true" />
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

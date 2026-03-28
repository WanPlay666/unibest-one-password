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
    title.value = options.title || '社交账号'
    bgColor.value = options.color || 'bg-sky-400'
    categoryIcon.value = options.icon || 'i-carbon-chat'
  }
})

// 表单数据
const formData = ref({
  platform: '', // 平台 (微信/QQ...)
  account: '', // 账号 / UID
  securityInfo: '', // 密保信息
  payPassword: '', // 支付密码
})
const relatedApps = ref<string[]>([])

function handleBack() {
  uni.navigateBack()
}

function handleSave() {
  console.log('保存社交账号:', {
    name: inputTitle.value,
    ...formData.value,
    relatedApps: relatedApps.value,
  })
  uni.navigateBack()
}
</script>

<template>
  <view class="bg-[#050508] px-6 text-white pb-safe">
    <Header :title="title" fixed @back="handleBack" />
    <view class="mt-6">
      <RecordNameCard v-model="inputTitle" :icon="categoryIcon" placeholder="记录名称 (如: 私人微信)" />
    </view>
    <view class="mt-2">
      <FieldGroup>
        <FieldItem v-model="formData.platform" label="平台" placeholder="请输入平台 (微信/QQ/微博)" />
      </FieldGroup>
    </view>

    <view class="mt-6">
      <FieldGroup>
        <FieldItem v-model="formData.account" label="账号" placeholder="请输入手机号/微信号/QQ号" :is-last="true" />
        <FieldItem v-model="formData.payPassword" label="密码" type="password" placeholder="请输入密码" :is-last="true" />
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

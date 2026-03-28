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
    title.value = options.title || 'Wi-Fi 网络'
    bgColor.value = options.color || 'bg-violet-500'
    categoryIcon.value = options.icon || 'i-carbon-wifi'
  }
})

const formData = ref({
  ssid: '',
  wifiPassword: '',
  adminAccount: '',
  adminPassword: '',
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
      <RecordNameCard v-model="inputTitle" :icon="categoryIcon" placeholder="记录名称 (如: 家里宽带)" />
    </view>

    <view class="mt-6">
      <FieldGroup>
        <FieldItem v-model="formData.ssid" label="网络名称" placeholder="请输入Wi-Fi名称" />
        <FieldItem v-model="formData.wifiPassword" label="Wi-Fi密码" placeholder="请输入Wi-Fi密码" :is-last="true" />
      </FieldGroup>
    </view>

    <view class="mt-6">
      <FieldGroup>
        <FieldItem v-model="formData.adminAccount" label="管理员账号" placeholder="请输入后台管理员账号" />
        <FieldItem v-model="formData.adminPassword" label="管理员密码" placeholder="请输入后台管理员密码" :is-last="true" />
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

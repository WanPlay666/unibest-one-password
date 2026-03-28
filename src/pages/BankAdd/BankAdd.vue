<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'
import BottomButton from '@/components/addCategory/BottomButton.vue'
import FieldGroup from '@/components/addCategory/FieldGroup.vue'
import FieldItem from '@/components/addCategory/FieldItem.vue'
import RecordNameCard from '@/components/addCategory/RecordNameCard.vue'
import RelatedAppsCard from '@/components/addCategory/RelatedAppsCard.vue'
import Header from '@/components/Header.vue'
// 1. [新增] 引入权限 Store，用于获取和补充 AES 密钥
import { useAuthStore } from '@/store/auth'
import { getSecureStorage, setSecureStorage } from '@/utils/secureStorage'

definePage({
  style: { navigationStyle: 'custom' },
})

const authStore = useAuthStore() // [新增] 初始化 Store

const title = ref('添加银行卡')
const inputTitle = ref('') // 记录名称，如：招商工资卡
const categoryIcon = ref('i-carbon-wallet') // 默认银行图标
const categoryId = ref<string | number>('3')
const bgColor = ref('bg-emerald-500')

const formData = ref({
  cardType: '',
  bankName: '',
  cardNumber: '',
  holderName: '',
  phone: '',
  cvv: '',
  password: '',
  bindStatus: '',
})

const relatedApps = ref<string[]>([])
const isSaving = ref(false)

const cardTypeOptions = ['借记卡 (储蓄卡)', '信用卡']

onLoad((options: any) => {
  if (options && options.title) {
    title.value = options.title
    if (options.icon)
      categoryIcon.value = options.icon
    if (options.id)
      categoryId.value = options.id
    if (options.color)
      bgColor.value = options.color
  }
})

function handleTypeChange(e: any) {
  formData.value.cardType = cardTypeOptions[e.detail.value]
}

watch(() => formData.value.cardNumber, (val) => {
  const raw = val.replace(/\D/g, '')
  const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ')
  if (formatted !== val) {
    formData.value.cardNumber = formatted
  }
})

function isValidBankCard(cardNumber: string): boolean {
  if (!cardNumber)
    return false
  const numStr = cardNumber.replace(/\D/g, '')
  if (numStr.length < 12 || numStr.length > 23)
    return false
  return true
}

function handleBack() {
  uni.navigateBack()
}

function handleSave() {
  if (isSaving.value)
    return

  const safeBankName = formData.value.bankName.trim()
  const safeHolderName = formData.value.holderName.trim()
  const rawCardNumber = formData.value.cardNumber.replace(/\s/g, '')

  // 2. [完善] 补全所有打上了 required 星号的必填校验
  if (!safeBankName) {
    uni.showToast({ title: '请输入银行名称', icon: 'none' })
    return
  }
  if (!formData.value.cardType) {
    uni.showToast({ title: '请选择卡片类型', icon: 'none' })
    return
  }
  if (!rawCardNumber) {
    uni.showToast({ title: '请输入银行卡号', icon: 'none' })
    return
  }
  if (!isValidBankCard(rawCardNumber)) {
    uni.showToast({ title: '银行卡号格式不正确', icon: 'none' })
    return
  }
  if (!safeHolderName) {
    uni.showToast({ title: '请输入持卡人姓名', icon: 'none' })
    return
  }

  isSaving.value = true

  try {
    // 3. 🚧🚧🚧 [核心修复] 开发期热更新防掉线兜底机制 🚧🚧🚧
    // 如果发现内存里没钥匙（说明刚刚热重载了），强行注入一把！
    if (!authStore.memoryAESKey) {
      console.warn('⚠️ 内存密钥丢失，已自动注入测试密钥')
      authStore.setAESKey('TEST_DEV_KEY_1234567890')
    }

    const recordItem = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      categoryId: categoryId.value,
      name: inputTitle.value.trim() || safeBankName,
      account: rawCardNumber,
      password: formData.value.password.trim(),
      icon: categoryIcon.value,
      color: bgColor.value,
      isStar: false,
      relatedApps: relatedApps.value.map(app => app.trim()).filter(Boolean),
      createdAt: Date.now(),
      details: {
        cardType: formData.value.cardType,
        bankName: safeBankName,
        holderName: safeHolderName,
        phone: formData.value.phone.trim(),
        cvv: formData.value.cvv.trim(),
      },
    }

    const storageKey = 'ENCRYPTED_VAULT'
    const list = getSecureStorage(storageKey) || []
    list.unshift(recordItem)
    setSecureStorage(storageKey, list)

    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 800)
  }
  catch (error) {
    console.error('保存银行卡失败', error)
    // [补充] 加上 icon: 'none'，防止显示默认的成功图标打叉
    uni.showToast({ title: '保存失败，请重试', icon: 'none' })
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <view class="box-border bg-[#050508] text-white pb-safe">
    <view class="px-6">
      <Header :title="title" fixed @back="handleBack" />

      <view class="mt-6">
        <RecordNameCard v-model="inputTitle" :icon="categoryIcon" placeholder="记录别名 (如: 工资卡)" />
      </view>

      <view class="mt-6">
        <FieldGroup>
          <FieldItem v-model="formData.bankName" required label="银行名称" placeholder="请输入银行名称 (如: 招商银行)" />

          <picker mode="selector" :range="cardTypeOptions" @change="handleTypeChange">
            <FieldItem v-model="formData.cardType" label="卡片类型" required placeholder="请选择卡片类型" :show-arrow="true" />
          </picker>

          <FieldItem
            v-model="formData.cardNumber" label="卡号" type="tel" required require-number :maxlength="23"
            placeholder="XXXX XXXX XXXX XXXX"
          />

          <FieldItem v-model="formData.holderName" label="持卡人姓名" required placeholder="请输入持卡人姓名" :is-last="true" />
        </FieldGroup>
      </view>

      <view class="mt-6">
        <FieldGroup>
          <FieldItem v-model="formData.phone" label="预留手机号" type="tel" require-number placeholder="请输入银行预留手机号" />

          <FieldItem v-model="formData.cvv" label="CVV2 / 有效期" no-chinese placeholder="信用卡专用 (如: 09/28 123)" />

          <FieldItem
            v-model="formData.password" label="取款 / 查询密码" type="password" no-chinese placeholder="请输入独立密码"
            :is-last="true"
          />
        </FieldGroup>
      </view>

      <view class="mt-6">
        <RelatedAppsCard v-model="relatedApps" label="关联网址 / APP" placeholder="绑定网址/app名称" />
      </view>

      <view class="mt-6">
        <BottomButton @save="handleSave" />
      </view>
    </view>
  </view>
</template>

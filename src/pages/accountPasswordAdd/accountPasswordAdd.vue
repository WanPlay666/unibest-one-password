<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import BottomButton from '@/components/addCategory/BottomButton.vue'
import FieldGroup from '@/components/addCategory/FieldGroup.vue'
import FieldItem from '@/components/addCategory/FieldItem.vue'
import RecordNameCard from '@/components/addCategory/RecordNameCard.vue'
import RelatedAppsCard from '@/components/addCategory/RelatedAppsCard.vue'
import StrengthSlider from '@/components/addCategory/StrengthSlider.vue'
import Header from '@/components/Header.vue'
import { checkPasswordStrength } from '@/utils/password-strength'
import { getSecureStorage, setSecureStorage } from '@/utils/secureStorage'

definePage({
  style: { navigationStyle: 'custom' },
})

const title = ref('')
const inputTitle = ref('')
const bgColor = ref('')
const categoryIcon = ref('')
const categoryId = ref<string | number>('')

onLoad((options: any) => {
  if (options) {
    title.value = options.title || '新增记录'
    bgColor.value = options.color || 'bg-blue-600'
    categoryIcon.value = options.icon || 'i-carbon-password'
    categoryId.value = options.id || '1'
  }
})

const formData = ref({
  account: '',
  password: '',
})

const passwordStatus = computed(() => checkPasswordStrength(formData.value.password))
const strengthScore = computed(() => passwordStatus.value.score)
const strengthColor = computed(() => passwordStatus.value.color)

const relatedApps = ref<string[]>([])
const isSaving = ref(false) // 防重复提交状态

function handleBack() {
  uni.navigateBack()
}

function handleSave() {
  // 1. 防抖拦截：如果正在保存，直接忽略多余点击
  if (isSaving.value)
    return

  // 2. 基础校验 & 去除前后看不见的空格 (防呆设计)
  const safeAccount = formData.value.account.trim()
  const safePassword = formData.value.password.trim()
  const safeName = inputTitle.value.trim() || title.value // 没填别名就用分类名兜底

  if (!safeAccount && !safePassword) {
    uni.showToast({ title: '请至少填写账号或密码', icon: 'none' })
    return
  }

  isSaving.value = true

  try {
    // 3. 构造极度严谨的数据对象
    const accountItem = {
      // 时间戳 + 5位随机字符，确保未来导入导出时绝对唯一
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      categoryId: categoryId.value,
      name: safeName,
      account: safeAccount,
      password: safePassword,
      icon: categoryIcon.value,
      color: bgColor.value,
      isStar: false,
      strength: strengthScore.value,
      // 过滤掉网址两端的空格，并剔除空字符串
      relatedApps: relatedApps.value.map(app => app.trim()).filter(Boolean),
      createdAt: Date.now(), // 记录创建时间，方便后续做时间倒序排列
    }

    // 4. 读取全局黑匣子 (底层会自动拦截未解锁状态并解密)
    const storageKey = 'ENCRYPTED_VAULT'
    const list = getSecureStorage(storageKey) || []

    // 5. 最新添加的记录插入到最前面
    list.unshift(accountItem)

    // 6. 安全存盘 (底层会自动 AES 加密落盘)
    setSecureStorage(storageKey, list)

    // 7. 成功反馈与页面跳转
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 800)
  }
  catch (error) {
    // 捕获极小概率的加密崩溃或内存不足异常
    console.error('保存记录失败:', error)
    uni.showToast({ title: '保存失败，请重试', icon: 'error' })
  }
  finally {
    // 无论成功还是失败，最后都要释放保存按钮的状态
    isSaving.value = false
  }
}
</script>

<template>
  <view class="box-border min-h-screen bg-[#050508] text-white pb-safe">
    <Header :title="title" fixed @back="handleBack" />
    <view class="px-6">
      <view class="mt-6">
        <RecordNameCard v-model="inputTitle" :icon="categoryIcon" placeholder="记录别名 (如: 支付宝)" />
      </view>
      <view class="mt-6">
        <FieldGroup>
          <FieldItem v-model="formData.account" label="账号" placeholder="请输入账号/邮箱/手机号" />
          <FieldItem v-model="formData.password" label="密码" placeholder="请输入密码" :is-last="true" />
        </FieldGroup>
      </view>

      <view class="mb-6">
        <StrengthSlider :strength-score="strengthScore" :strength-color="strengthColor" />
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

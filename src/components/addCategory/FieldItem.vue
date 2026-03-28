<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  modelValue: string
  placeholder?: string
  type?: 'text' | 'number' | 'idcard' | 'digit' | 'tel' | 'safe-password' | 'nickname' | 'password' // 输入框类型
  showCopy?: boolean // 是否显示复制图标
  showCalendar?: boolean // 是否显示日历图标
  showArrow?: boolean // 是否显示箭头（用于选择器模式）
  isLast?: boolean // 是否为列表最后一项
  requireNumber?: boolean // 只能输入数字
  noChinese?: boolean // 不能包含中文
  allowClear?: boolean // 是否允许清空
  maxlength?: number // 最大长度,-1表示不限制
  required?: boolean// 新增 required 属性
}>(), {
  type: 'text',
  placeholder: '请输入',
  showCopy: true,
  showCalendar: false,
  showArrow: false,
  isLast: false,
  requireNumber: false,
  noChinese: false,
  allowClear: true,
  maxlength: 50,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'click': [] // 抛出点击事件
}>()

function handleInput(e: any) {
  const val = e.detail.value
  let filteredVal = val

  // 如果要求只能输入数字
  if (props.requireNumber) {
    // 允许数字和空格（配合外部诸如银行卡的四位一空格分段）
    filteredVal = val.replace(/[^\d\s]/g, '')
  }
  // 如果要求不能包含中文
  else if (props.noChinese) {
    filteredVal = val.replace(/[\u4E00-\u9FA5]/g, '')
  }
  // 没有任何限制时，默认过滤所有空白字符
  else {
    filteredVal = val.replace(/\s/g, '')
  }

  emit('update:modelValue', filteredVal)

  // 微信小程序特性：如果在 input 事件处理函数中返回一个字符串，将替换输入框里的内容
  // 只有当经过我们过滤发现出现了不合法字符时，强制要求原生输入框更新这部分残留
  if (filteredVal !== val) {
    return filteredVal
  }
}

function handleClear() {
  emit('update:modelValue', '')
}

function handleCopy() {
  if (!props.modelValue)
    return
  uni.setClipboardData({
    data: props.modelValue,
    success: () => uni.showToast({ title: '已复制', icon: 'none' }),
  })
}

// 判断是否为只读模式
const isReadOnly = computed(() => props.showCalendar || props.showArrow)

// uni-app 的 input 没有 type="password"，而是通过 password 属性控制
const inputType = computed(() => props.type === 'password' ? 'text' : props.type as any)
const isPassword = computed(() => props.type === 'password')
</script>

<template>
  <view class="relative p-5 transition-colors active:bg-white/5" @click="isReadOnly ? emit('click') : null">
    <view class="mb-3 flex items-center">
      <text v-if="required" class="mr-1 text-red-500">*</text>
      <text class="text-[12px] text-blue-400 font-bold leading-none tracking-wider uppercase">
        {{ label }}
      </text>
    </view>

    <view class="flex items-center gap-3">
      <input
        :value="modelValue" :maxlength="maxlength" :type="inputType" :password="isPassword"
        class="h-6 flex-1 text-[16px] text-gray-200" :class="{ 'pointer-events-none': isReadOnly }"
        :placeholder="placeholder" :min="0" placeholder-class="text-[#555555] text-[14px]" :disabled="isReadOnly"
        @input="handleInput"
      >

      <view v-if="showCalendar" class="p-2 -mr-2">
        <view class="i-carbon-calendar text-lg text-gray-500" />
      </view>

      <view v-if="showArrow" class="p-2 -mr-2">
        <view class="i-carbon-chevron-right text-lg text-gray-500" />
      </view>

      <view
        v-if="allowClear && modelValue && !isReadOnly" class="p-2 transition-opacity -mr-2 active:opacity-60"
        @click.stop="handleClear"
      >
        <view class="i-carbon-close-outline text-lg text-gray-500" />
      </view>

      <view
        v-if="showCopy && !isReadOnly" class="p-2 transition-opacity -mr-2 active:opacity-60"
        @click.stop="handleCopy"
      >
        <view class="i-carbon-copy text-lg text-gray-500" />
      </view>
    </view>

    <view v-if="!isLast" class="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5" />
  </view>
</template>

<style scoped>
input {
  background: transparent;
  min-height: auto;
}
</style>

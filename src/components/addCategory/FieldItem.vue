<script lang="ts" setup>
import { computed, inject, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  name: string // 字段 Key (必须传，如 'cardNumber')
  label: string // 标签名称
  modelValue: string // 绑定值
  placeholder?: string
  type?: 'text' | 'number' | 'idcard' | 'digit' | 'tel' | 'password'
  showCopy?: boolean
  showCalendar?: boolean
  showArrow?: boolean
  isLast?: boolean
  requireNumber?: boolean
  noChinese?: boolean
  allowClear?: boolean
  maxlength?: number
  required?: boolean
  readonly?: boolean
}>(), {
  type: 'text',
  placeholder: '请输入',
  showCopy: false,
  showCalendar: false,
  showArrow: false,
  isLast: false,
  requireNumber: false,
  noChinese: false,
  allowClear: true,
  maxlength: 50,
  required: false,
  readonly: false,
})

const emit = defineEmits(['update:modelValue', 'click'])

// --- 表单中心联动逻辑 ---
const formManager = inject<any>('formManager', null)

function getMeta() {
  return {
    name: props.name,
    label: props.label,
    value: props.modelValue,
    required: props.required,
  }
}

onMounted(() => formManager?.register(props.name, getMeta()))
onUnmounted(() => formManager?.unregister(props.name))

watch(() => [props.modelValue, props.label, props.required], () => {
  formManager?.update(props.name, getMeta())
})

// --- 统一方法区 ---
function handleInput(e: any) {
  const val = e.detail.value
  let filteredVal = val

  if (props.requireNumber) {
    filteredVal = val.replace(/[^\d\s]/g, '')
  }
  else if (props.noChinese) {
    filteredVal = val.replace(/[\u4E00-\u9FA5]/g, '')
  }
  else {
    filteredVal = val.replace(/\s/g, '')
  }

  emit('update:modelValue', filteredVal)
  if (filteredVal !== val)
    return filteredVal
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

// 内部计算
const isReadOnly = computed(() => props.showCalendar || props.showArrow || props.readonly)
const inputType = computed(() => props.type === 'password' ? 'text' : props.type as any)
const isPassword = computed(() => props.type === 'password')
</script>

<template>
  <view class="relative bg-[#1A1A1A] p-5 transition-colors" @click="isReadOnly ? emit('click') : null">
    <view class="mb-3 flex items-center">
      <text v-if="required" class="mr-1 text-red-500 font-bold">*</text>
      <text class="text-[14px] text-blue-400 font-bold leading-none tracking-wider uppercase">
        {{ label }}
      </text>
    </view>

    <view class="h-6 w-full flex items-center pl-1">
      <input
        :value="modelValue" :maxlength="maxlength" :type="inputType"
        class="h-full min-w-0 flex-1 text-[16px] text-gray-200" :class="{ 'pointer-events-none': isReadOnly }"
        :placeholder="placeholder" placeholder-class="text-[#555555] text-[14px]" :disabled="isReadOnly"
        @input="handleInput"
      >

      <view class="ml-2 h-full flex flex-shrink-0 items-center">
        <view v-if="showCalendar" class="flex items-center px-1">
          <view class="i-carbon-calendar text-[16px] text-gray-500" />
        </view>

        <view v-if="showArrow" class="flex items-center px-1">
          <view class="i-carbon-chevron-right text-[16px] text-gray-500" />
        </view>

        <view
          v-if="allowClear && modelValue && !isReadOnly" class="h-full flex items-center px-1 active:opacity-60"
          @click.stop="handleClear"
        >
          <view class="i-carbon-close-outline text-[16px] text-gray-500" />
        </view>

        <view
          v-if="showCopy && modelValue" class="h-full flex items-center px-1 active:opacity-60"
          @click.stop="handleCopy"
        >
          <view class="i-carbon-copy text-[16px] text-gray-500" />
        </view>
      </view>
    </view>

    <view v-if="!isLast" class="absolute bottom-0 left-5 right-0 h-[1px] bg-white/5" />
  </view>
</template>

<style scoped>
input {
  background: transparent;
  min-height: 0;
  padding: 0;
  margin: 0;
  /* 确保文字能铺满 */
  width: 100%;
  display: block;
}

/* 彻底解决小程序下 input 无法垂直居中的顽疾 */
:deep(.uni-input-wrapper),
:deep(.uni-input-input) {
  display: flex;
  align-items: center;
}
</style>

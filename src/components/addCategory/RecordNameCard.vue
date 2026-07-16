<script lang="ts" setup>
import { computed, inject, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  icon?: string
  placeholder?: string
  required?: boolean
}>(), {
  icon: 'i-carbon-notebook',
  placeholder: '记录名称',
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

// 与 FieldItem 一致:通过 formManager 注册到字段中心,参与必填校验
const formManager = inject<any>('formManager', null)
const FIELD_KEY = '__recordName'

function getMeta() {
  return {
    name: FIELD_KEY,
    label: '记录名称',
    value: localValue.value,
    required: props.required,
  }
}

onMounted(() => formManager?.register(FIELD_KEY, getMeta()))
onUnmounted(() => formManager?.unregister(FIELD_KEY))
watch([() => localValue.value, () => props.required], () => {
  formManager?.update(FIELD_KEY, getMeta())
})
</script>

<template>
  <view class="mb-6 flex items-center gap-3">
    <view
      class="h-12 w-12 flex shrink-0 items-center justify-center border border-blue-500/30 rounded-[16px] bg-blue-500/10 transition-colors"
    >
      <view :class="icon" class="text-xl text-blue-500" />
    </view>

    <view
      class="h-12 flex flex-1 items-center border border-white/5 rounded-[16px] bg-[#1A1A1A] px-4 transition-colors focus-within:border-blue-500/50"
      :class="{ 'border-red-500/50': required && !localValue.trim() }"
    >
      <text v-if="required" class="mr-1 text-red-500 font-bold">*</text>
      <input
        v-model="localValue" type="text" class="h-full flex-1 text-[15px] text-white" :placeholder="placeholder"
        placeholder-class="text-[#555555]"
      >
    </view>
  </view>
</template>

<style scoped>
input {
  background: transparent;
  outline: none;
  min-height: auto;
}
</style>

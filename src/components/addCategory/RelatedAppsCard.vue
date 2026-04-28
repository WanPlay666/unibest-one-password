<script lang="ts" setup>
import { ref } from 'vue'

interface RelatedItem {
  id: string
  value: string
}

const props = defineProps<{
  modelValue: RelatedItem[]
  label?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: RelatedItem[]]
}>()

// 状态管理
const isAdding = ref(false)
const pendingValue = ref('')
const editingId = ref<string | null>(null)
const editingValue = ref('')

/**
 * 核心逻辑：确认新增
 * 只有在有值的情况下才触发 emit
 */
function handleConfirmNew() {
  const val = pendingValue.value.trim()
  if (val) {
    if (props.modelValue.some(i => i.value === val)) {
      uni.showToast({ title: '内容重复', icon: 'none' })
      return
    }
    const newItem = { id: `APP_${Date.now()}`, value: val }
    emit('update:modelValue', [...props.modelValue, newItem])
  }
  // 操作完成后直接关闭，不依赖聚焦状态
  isAdding.value = false
  pendingValue.value = ''
}

/**
 * 核心逻辑：确认编辑
 */
function confirmEdit(id: string) {
  const val = editingValue.value.trim()
  if (val) {
    const newList = props.modelValue.map(i => i.id === id ? { ...i, value: val } : i)
    emit('update:modelValue', newList)
  }
  editingId.value = null
}

function handleRemove(id: string) {
  emit('update:modelValue', props.modelValue.filter(i => i.id !== id))
  if (editingId.value === id)
    editingId.value = null
}

/**
 * 顶部按钮点击处理
 */
function handleHeaderBtnClick() {
  if (isAdding.value) {
    // 再次点击 X，相当于取消
    isAdding.value = false
    pendingValue.value = ''
  }
  else {
    // 开启新增，同时关闭正在进行的编辑
    editingId.value = null
    isAdding.value = true
  }
}
</script>

<template>
  <view class="my-6 border border-white/5 rounded-[24px] bg-[#1A1A1A] p-5 shadow-sm">
    <view class="mb-4 flex items-center justify-between">
      <text class="text-[12px] text-gray-500 font-bold tracking-wider uppercase">{{ label || '关联网址 / APP' }}</text>

      <view
        class="h-7 w-7 flex items-center justify-center rounded-full bg-black transition-transform active:scale-90"
        @click="handleHeaderBtnClick"
      >
        <view :class="isAdding ? 'i-carbon-close text-gray-400' : 'i-carbon-add text-blue-500'" class="text-[18px]" />
      </view>
    </view>

    <view class="flex flex-col gap-3">
      <view
        v-for="item in modelValue" :key="item.id"
        class="min-h-[48px] flex items-center justify-between border border-white/5 rounded-2xl bg-[#1A1A1A]/60 px-4 py-2"
      >
        <template v-if="editingId !== item.id">
          <text class="flex-1 truncate text-sm text-gray-300 font-mono">{{ item.value }}</text>
          <view class="ml-2 flex shrink-0 items-center">
            <view
              class="p-2 opacity-60 active:opacity-100"
              @click="editingId = item.id; editingValue = item.value; isAdding = false"
            >
              <view class="i-carbon-edit text-[16px] text-gray-400" />
            </view>
            <view class="p-2 opacity-60 active:opacity-100" @click="handleRemove(item.id)">
              <view class="i-carbon-trash-can text-[16px] text-gray-400" />
            </view>
          </view>
        </template>

        <view v-else class="flex flex-1 items-center">
          <input
            v-model="editingValue" class="h-6 flex-1 text-sm text-white" placeholder="输入新名称"
            @confirm="confirmEdit(item.id)"
          >
          <view class="p-2" @click="confirmEdit(item.id)">
            <view class="i-carbon-checkmark text-[16px] text-green-500" />
          </view>
        </view>
      </view>

      <view
        v-if="isAdding"
        class="min-h-[48px] flex items-center border border-blue-500/30 rounded-2xl bg-[#080808] px-4"
      >
        <input
          v-model="pendingValue" :placeholder="placeholder || '输入网址或APP'" class="h-6 flex-1 text-sm text-white"
          @confirm="handleConfirmNew"
        >
        <view class="p-2 active:opacity-50" @click="handleConfirmNew">
          <view class="i-carbon-checkmark text-[16px] text-green-500" />
        </view>
      </view>

      <view v-if="modelValue.length === 0 && !isAdding" class="flex flex-col items-center py-6 opacity-20">
        <view class="i-carbon-link mb-1 text-3xl" />
        <text class="text-[10px]">暂无关联项</text>
      </view>
    </view>
  </view>
</template>

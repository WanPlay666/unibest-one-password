<script lang="ts" setup>
import { ref } from 'vue'

// 使用 withDefaults 设置默认值
const props = withDefaults(defineProps<{
  modelValue: string[]
  label?: string // [新增] 标题传值
  placeholder?: string // [新增] 占位符传值
}>(), {
  label: '关联网址 / APP',
  placeholder: '绑定网址/app名称',
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

// ... 其他逻辑保持不变 (pendingList, handleAdd 等) ...
const pendingList = ref<string[]>([])

function handleAdd() {
  pendingList.value.push('')
}

function handleConfirm(index: number) {
  const val = pendingList.value[index].trim()
  if (val) {
    const newList = [...props.modelValue, val]
    emit('update:modelValue', newList)
    pendingList.value.splice(index, 1)
  }
}

function handleCancelPending(index: number) {
  pendingList.value.splice(index, 1)
}

function handleRemoveSaved(index: number) {
  const newList = [...props.modelValue]
  newList.splice(index, 1)
  emit('update:modelValue', newList)
}

function handleInput(index: number, event: any) {
  const val = event.detail.value
  pendingList.value[index] = val.replace(/\s/g, '').slice(0, 100)
}
</script>

<template>
  <view class="min-h-[140px] flex flex-col border border-white/5 rounded-[24px] bg-[#1A1A1A] p-5 shadow-sm">
    <view class="mb-4 flex items-center justify-between">
      <text class="pl-1 text-[12px] text-gray-500 font-bold tracking-wider uppercase">
        {{ label }}
      </text>

      <view
        class="h-7 w-7 flex items-center justify-center rounded-full bg-[#000000] transition-all active:scale-95 active:bg-[#333]"
        @click="handleAdd"
      >
        <view class="i-carbon-add text-[16px] text-blue-500" />
      </view>
    </view>

    <view class="flex flex-1 flex-col gap-3">
      <view
        v-for="(app, index) in modelValue" :key="`saved-${index}`"
        class="flex items-center justify-between border border-white/5 rounded-2xl bg-[#1A1A1A]/60 px-4 py-3"
      >
        <text class="truncate text-[14px] text-gray-300 font-mono">{{ app }}</text>
        <view class="p-2 opacity-60 transition-opacity -mr-2 active:opacity-100" @click="handleRemoveSaved(index)">
          <view class="i-carbon-trash-can text-[16px] text-gray-500 hover:text-red-400" />
        </view>
      </view>

      <view
        v-for="(item, index) in pendingList" :key="`pending-${index}`"
        class="flex animate-fade-in items-center justify-between border border-blue-500/30 rounded-2xl bg-[#080808] px-4 py-1"
      >
        <view class="flex flex-1 items-center gap-3">
          <input
            v-model="pendingList[index]" type="text" class="h-6 flex-1 bg-transparent text-[14px] text-white"
            :placeholder="placeholder" placeholder-class="text-gray-600" :focus="true" :maxlength="100"
            @input="handleInput(index, $event)" @confirm="handleConfirm(index)"
          >
        </view>

        <view class="p-2 -mr-2 active:opacity-70" @click="handleCancelPending(index)">
          <view class="i-carbon-trash-can text-lg text-gray-600" />
        </view>
      </view>

      <view
        v-if="modelValue.length === 0 && pendingList.length === 0"
        class="flex flex-1 flex-col items-center justify-center py-6 opacity-40"
      >
        <view class="i-carbon-link mb-2 text-3xl" />
        <text class="text-xs">暂无{{ label }}</text>
      </view>
    </view>
  </view>
</template>

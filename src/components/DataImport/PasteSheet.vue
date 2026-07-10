<script lang="ts" setup>
import { ref, watch } from 'vue'
import { THEME } from './constants'

interface Props {
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirm: [text: string]
}>()

const pasteText = ref('')

watch(() => props.show, (v) => {
  if (v)
    pasteText.value = ''
})

function handleClose() {
  emit('close')
}

function handleConfirm() {
  const text = pasteText.value.trim()
  if (!text) {
    uni.showToast({ title: '请粘贴 JSON 内容', icon: 'none' })
    return
  }
  emit('confirm', text)
}
</script>

<template>
  <view v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
    @click="handleClose">
    <view
      class="flex w-full max-w-[520px] max-h-[92vh] flex-col overflow-hidden rounded-3xl bg-[#1A1A1A] px-6 pb-6 pt-5"
      @click.stop>
      <text class="mb-3 block text-center text-sm text-white font-bold">粘贴 JSON</text>

      <textarea v-model="pasteText" :maxlength="-1"
        class="box-border w-full flex-1 min-h-[320px] rounded-[16px] border border-white/10 bg-[#050508] p-3 text-sm text-[#7fb8ff] font-mono"
        placeholder="将导出的 JSON 粘贴到这里..." placeholder-class="text-sm text-[#6b7280]" />
      <view class="mt-1 flex justify-between text-[10px] text-gray-600">
        <text>建议从「查看示例」复制完整 JSON 填入</text>
        <text>{{ pasteText.length }} 字符</text>
      </view>

      <view class="mt-4 flex flex-row">
        <button
          class="flex-1 rounded-[18px] border-none bg-white/10 py-3 mr-2 text-sm text-gray-300 font-bold active:scale-[0.97]"
          @click="handleClose">
          取消
        </button>
        <button class="flex-1 rounded-[18px] border-none py-3 ml-2 text-sm text-white font-bold active:scale-[0.97]"
          :style="{ backgroundColor: THEME }" @click="handleConfirm">
          解析
        </button>
      </view>
    </view>
  </view>
</template>

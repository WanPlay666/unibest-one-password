<script lang="ts" setup>
import { ref, watch } from 'vue'

interface Props {
  show: boolean
  currentName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirm: [name: string]
}>()

const nameDraft = ref('')

watch(() => props.show, (v) => {
  if (v)
    nameDraft.value = props.currentName
})

function handleConfirm() {
  const name = nameDraft.value.trim()
  if (!name) {
    uni.showToast({ title: '名称不能为空', icon: 'none' })
    return
  }
  emit('confirm', name)
}
</script>

<template>
  <view
    v-if="show" class="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60"
    @click="emit('close')"
  >
    <view class="w-full rounded-t-3xl bg-[#1A1A1A] px-5 pb-10 pt-6" @click.stop>
      <text class="mb-6 block text-center text-lg font-bold text-white">修改昵称</text>

      <view
        class="mb-6 flex h-12 items-center rounded-[16px] border border-white/10 bg-[#050508] px-4"
      >
        <input
          v-model="nameDraft" type="text" class="h-full flex-1 text-base text-white"
          placeholder="输入昵称" placeholder-class="text-gray-500" @confirm="handleConfirm"
        >
      </view>

      <view class="flex flex-row">
        <button
          class="mr-2 flex-1 rounded-[18px] border-none bg-white/10 py-3 text-sm font-bold text-gray-300 transition-transform active:scale-[0.97]"
          @click="emit('close')"
        >
          取消
        </button>
        <button
          class="ml-2 flex-1 rounded-[18px] border-none bg-blue-600 py-3 text-sm font-bold text-white shadow-xl shadow-blue-900/20 transition-transform active:scale-[0.97]"
          @click="handleConfirm"
        >
          确定
        </button>
      </view>
    </view>
  </view>
</template>

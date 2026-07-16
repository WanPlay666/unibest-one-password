<script lang="ts" setup>
interface Props {
  text?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  text: '完成',
  loading: false,
})

const emit = defineEmits<{
  save: []
}>()

function handleSave() {
  emit('save')
}
</script>

<template>
  <view class="bg-[#050508] from-[#050508] via-[#050508] to-transparent bg-gradient-to-t pb-safe">
    <button
      class="w-full flex items-center justify-center rounded-[18px] border-none bg-blue-600 py-2 text-[14px] text-white font-bold shadow-blue-900/20 shadow-xl transition-transform active:scale-[0.97] disabled:opacity-60"
      :loading="loading"
      :disabled="loading"
      @click="handleSave"
    >
      {{ loading ? '保存中...' : text }}
    </button>
  </view>
</template>

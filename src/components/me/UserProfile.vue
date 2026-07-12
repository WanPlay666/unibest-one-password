<script lang="ts" setup>
interface Props {
  name: string
}

defineProps<Props>()

const emit = defineEmits<{
  edit: []
}>()
</script>

<template>
  <view class="flex flex-col items-center px-5 pt-14 pb-6">
    <view
      class="h-16 w-16 flex items-center justify-center rounded-full border-[3px] border-[#206371] bg-[#1A1A1A]"
    >
      <view class="i-carbon-user-filled text-4xl text-gray-700" />
    </view>

    <view class="mt-4 flex items-center" @click="emit('edit')">
      <text class="text-xl font-bold tracking-tight text-white">{{ name }}</text>
      <view class="i-carbon-edit ml-2 text-sm text-gray-500" />
    </view>
  </view>
</template>

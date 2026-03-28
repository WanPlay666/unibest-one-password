<script lang="ts" setup>
defineProps<{
  strengthScore: number
  strengthColor: string
}>()
</script>

<template>
  <view class="flex items-center gap-4 px-2">
    <view class="i-carbon-security text-xl transition-colors duration-300" :style="{ color: strengthColor }" />
    <slider
      class="flex-1" :value="strengthScore" :min="0" :max="32" disabled :active-color="strengthColor"
      background-color="#222" :block-size="12" :block-color="strengthColor"
    />
    <view
      class="h-2 w-2 rounded-full shadow-lg transition-all duration-500" :style="{
        backgroundColor: strengthColor,
        boxShadow: strengthScore > 0 ? `0 0 10px ${strengthColor}88` : 'none',
      }"
    />
  </view>
</template>

<style scoped>
:deep(slider) {
  margin: 0;
}
</style>

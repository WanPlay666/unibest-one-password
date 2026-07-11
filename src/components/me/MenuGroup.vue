<script lang="ts" setup>
interface MenuItem {
  id: string
  title: string
  icon: string
  color: string
  type?: 'switch'
  isDanger?: boolean
}

interface Props {
  items: MenuItem[]
  biometricEnabled: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  action: [item: MenuItem]
  'biometric-change': [value: boolean]
}>()

function handleBiometricChange(e: any) {
  emit('biometric-change', e.detail.value)
}
</script>

<template>
  <view class="overflow-hidden rounded-[32px] border border-white/5 bg-[#111111]">
    <view
      v-for="item in items" :key="item.id"
      class="group-item transition-all duration-200 active:bg-white/10"
      @tap="emit('action', item)"
    >
      <view class="mr-4 text-xl" :class="[item.icon, item.color]" />
      <text class="flex-1 text-[12px] font-medium" :class="item.isDanger ? 'text-red-500' : 'text-white'">
        {{ item.title }}
      </text>
      <switch
        v-if="item.type === 'switch'" :checked="biometricEnabled" color="#3478F6"
        style="transform:scale(0.8)" @change.stop="handleBiometricChange"
      />
      <view v-else class="i-carbon-chevron-right text-[12px] text-[#333333]" />
    </view>
  </view>
</template>

<style scoped>
.group-item {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.group-item:last-child {
  border-bottom: none;
}
</style>

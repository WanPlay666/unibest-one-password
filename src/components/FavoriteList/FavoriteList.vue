<template>
  <view class="overflow-hidden border border-white/5 rounded-[24px] bg-[#121212]">
    <view
      v-for="(item, index) in list" :key="item.id"
      class="relative flex items-center px-4 py-4 transition-all active:bg-white/5" @click="handleClick(item)"
    >
      <view
        :class="item.color"
        class="h-12 w-12 flex items-center justify-center rounded-[14px] text-lg text-white font-bold shadow-md"
      >
        <view v-if="item.icon?.startsWith('i-')" :class="item.icon" class="text-2xl" />
        <text v-else>{{ item.icon }}</text>
      </view>

      <view class="ml-4 flex flex-1 flex-col justify-center">
        <view class="flex items-center gap-1.5">
          <text class="text-[16px] text-white font-semibold tracking-wide">
            {{ item.name }}
          </text>
          <view v-if="item.isStar" class="i-carbon-star-filled text-[12px] text-yellow-500" />
        </view>

        <text class="mt-1 text-[13px] text-gray-500 font-mono">
          {{ item.account }}
        </text>
      </view>

      <view class="i-carbon-chevron-right text-xl text-white/20" />

      <view v-if="index !== list.length - 1" class="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5" />
    </view>
  </view>
</template>

<script lang="ts" setup>
interface Item {
  id: number
  name: string
  account: string
  icon: string
  color: string
  isStar: boolean
}

const props = defineProps<{
  list: Item[]
}>()

const emit = defineEmits<{
  (e: 'click', item: Item): void
}>()

function handleClick(item: Item) {
  emit('click', item)
}
</script>

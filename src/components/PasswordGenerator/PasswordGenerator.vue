<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { generateRandomString } from '@/utils/PasswordGenerator'
import { safeAreaInsets } from '@/utils/systemInfo'

/**
  状态定义
 */
const mode = ref<'custom' | 'pin'>('custom')
const length = ref(16)
const hasSymbols = ref(true)
const hasNumbers = ref(true)
const hasUppercase = ref(true)
const result = ref('')

/**
 * 生成逻辑：
 * PIN 模式：纯数字，关闭字母
 * 自定义模式：根据开关选择
 */
function handleGenerate() {
  if (mode.value === 'pin') {
    result.value = generateRandomString(length.value, {
      symbols: false,
      numbers: true,
      uppercase: false,
      lowercase: false, // PIN 码不需要字母
    })
  }
  else {
    result.value = generateRandomString(length.value, {
      symbols: hasSymbols.value,
      numbers: hasNumbers.value,
      uppercase: hasUppercase.value,
      lowercase: true,
    })
  }
}

// 监听模式切换
watch(mode, (newMode) => {
  length.value = newMode === 'pin' ? 6 : 16
  handleGenerate()
})

// 监听配置项变化（实现滑动/点击即时反馈）
watch([hasSymbols, hasNumbers, hasUppercase], () => {
  if (mode.value === 'custom')
    handleGenerate()
})

function copy() {
  uni.setClipboardData({
    data: result.value,
    success: () => {
      uni.showToast({ title: '已复制', icon: 'none' })
    },
  })
}

onMounted(() => {
  handleGenerate()
})
</script>

<template>
  <view class="mt-6 b-1 border-white/10 rounded-3xl b-solid bg-[#1a1a1a] p-6 shadow-2xl">
    <view class="mb-8 flex items-center justify-between">
      <view class="flex items-center gap-2">
        <view class="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600/20">
          <view class="i-carbon-flash-filled text-xl text-blue-500" />
        </view>
      </view>

      <view class="flex border border-white/5 rounded-xl bg-black p-1">
        <view :class="mode === 'pin' ? 'bg-[#222] text-white shadow-sm' : 'text-gray-500'"
          class="cursor-pointer rounded-lg px-4 py-1.5 text-xs font-bold transition-all" @click="mode = 'pin'">
          PIN
        </view>
        <view :class="mode === 'custom' ? 'bg-[#222] text-white shadow-sm' : 'text-gray-500'"
          class="cursor-pointer rounded-lg px-4 py-1.5 text-xs font-bold transition-all" @click="mode = 'custom'">
          自定义
        </view>
      </view>
    </view>

    <view
      class="group relative mb-6 min-h-120px flex items-center justify-center border border-white/5 rounded-2xl bg-black p-8">
      <text class="break-all text-center text-white tracking-widest font-mono transition-all"
        :class="mode === 'pin' ? 'text-4xl' : 'text-2xl'">
        {{ result }}
      </text>
      <view
        class="absolute bottom-3 right-3 rounded-full bg-white/5 p-3 transition-all active:scale-90 active:bg-white/10"
        @click="copy">
        <view class="i-carbon-copy text-lg text-gray-500" />
      </view>
    </view>

    <view class="mb-8 px-2">
      <view class="mb-4 flex items-center justify-between">
        <view class="flex items-baseline gap-1">
          <text class="text-sm text-gray-500 uppercase">长度:</text>
          <text class="text-sm text-blue-500 font-bold font-mono">{{ length }}</text>
        </view>
        <text class="rounded bg-white/5 px-2 py-0.5 text-sm text-gray-500 ">
          推荐：{{ mode === 'pin' ? '4-8位' : '12位以上' }}
        </text>
      </view>
      <slider :value="length" :min="mode === 'pin' ? 4 : 8" :max="32" active-color="#3b82f6" background-color="#222"
        :block-size="20" @change="(e) => { length = e.detail.value; handleGenerate() }" />
    </view>

    <view v-if="mode === 'custom'" class="grid grid-cols-2 mb-4 animate-fade-in animate-duration-300 gap-3">
      <view
        :class="hasSymbols ? 'bg-blue-600 text-white border-blue-400/30' : 'bg-[#1a1a1a] text-gray-500 border-white/5'"
        class="border rounded-2xl px-2 py-3.5 text-center text-sm font-bold transition-all active:scale-95"
        @click="hasSymbols = !hasSymbols">
        符号
      </view>
      <view
        :class="hasNumbers ? 'bg-blue-600 text-white border-blue-400/30' : 'bg-[#1a1a1a] text-gray-500 border-white/5'"
        class="border rounded-2xl px-2 py-3.5 text-center text-sm font-bold transition-all active:scale-95"
        @click="hasNumbers = !hasNumbers">
        数字
      </view>
      <view
        :class="hasUppercase ? 'bg-blue-600 text-white border-blue-400/30' : 'bg-[#1a1a1a] text-gray-500 border-white/5'"
        class="col-span-2 border rounded-2xl py-3.5 text-center text-sm font-bold transition-all active:scale-95"
        @click="hasUppercase = !hasUppercase">
        大写字母
      </view>
    </view>
    <button
      class="w-full flex items-center justify-center gap-3 rounded-2xl border-none bg-white py-3.5 text-black transition-all active:scale-[0.98] hover:bg-gray-100"
      @click="handleGenerate">
      <view class="i-carbon-renew text-sm" />
      <text class="text-sm font-bold  tracking-wider uppercase">
        重新生成 {{ mode === 'pin' ? 'PIN' : '' }}
      </text>
    </button>
  </view>
</template>

<style scoped>
/* 深度美化滑块 */
:deep(slider) {
  margin: 0;
}

/* 简单的淡入动画 */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

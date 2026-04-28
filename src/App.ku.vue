<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import BiometricMask from '@/components/BiometricMask.vue'
// [新增] 引入权限 store 和 遮罩组件
import { useAuthStore } from '@/store/auth'
import FgTabbar from '@/tabbar/index.vue'
import { isPageTabbar } from './tabbar/store'
import { currRoute } from './utils'

const authStore = useAuthStore()

// 只需要一个变量控制显示隐藏即可，删除了冗余的 isCurrentPageTabbar
const isShowTabbar = ref(true)

function updateTabbarVisibility() {
  const { path } = currRoute()

  // 核心优化：直接使用底层框架提供的 isPageTabbar 判断
  // '/' 通常作为首页默认显示，其他的完全交给底层的配置表
  if (path === '/') {
    isShowTabbar.value = true
  }
  else {
    isShowTabbar.value = isPageTabbar(path)
  }
}

onShow(() => {
  updateTabbarVisibility()
})

const helloKuRoot = ref('Hello AppKuVue')
const exposeRef = ref('this is form app.Ku.vue')

defineExpose({
  exposeRef,
})
</script>

<template>
  <view class="fixed inset-0 h-100vh flex flex-col overflow-hidden overscroll-y-none bg-[#050508]">
    <view class="body-content relative min-h-0 flex-1 overflow-hidden">
      <scroll-view scroll-y class="h-full w-full" :enhanced="true" :bounces="false" :show-scrollbar="false">
        <KuRootView />
      </scroll-view>
    </view>

    <FgTabbar v-if="isShowTabbar" class="flex-none" />

    <BiometricMask v-if="authStore.showBiometricMask" />
  </view>
</template>

<style scoped lang="scss">
:deep(page),
page {
  background-color: #0a0a0a;
  overflow: hidden;
}

.body-content {
  width: 100%;
}

/* 删除了原先的 .has-tabbar 计算逻辑，把工作交给 Flexbox 布局引擎自动完成 */
</style>

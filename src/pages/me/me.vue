<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { setStorage } from '@/utils/storage'

definePage({
  style: { navigationStyle: 'custom' },
})

const authStore = useAuthStore()

// 定义菜单项接口
interface MenuItem {
  id: string
  title: string
  icon: string
  color: string
  type?: 'switch'
  isDanger?: boolean
}

// 1. [复用安全逻辑]：直接从 authStore 读取初始状态
const isBiometricEnabled = ref(authStore.isBiometricEnabled)

const menuGroups: MenuItem[][] = [
  [
    { id: 'security', title: '安全设置', icon: 'i-carbon-ibm-cloud-key-protect', color: 'text-blue-500' },
    { id: 'password', title: '修改主密码', icon: 'i-carbon-unlocked', color: 'text-emerald-500' },
    { id: 'biometric', title: '生物识别设置', icon: 'i-carbon-settings', color: 'text-gray-400', type: 'switch' },
    { id: 'history', title: '登录历史', icon: 'i-carbon-time', color: 'text-orange-400' },
  ],
  [
    { id: 'export', title: '导出库 (JSON)', icon: 'i-carbon-copy', color: 'text-blue-400' },
    { id: 'delete', title: '清除本地数据', icon: 'i-carbon-trash-can', color: 'text-red-400', isDanger: true },
  ],
]

// 2. [新增逻辑]：处理生物识别开关切换
function handleBiometricChange(e: any) {
  const val = e.detail.value
  isBiometricEnabled.value = val

  // 同步更新到 Pinia 和 本地缓存
  authStore.isBiometricEnabled = val
  setStorage('SETTING_BIOMETRIC', val)

  uni.showToast({ title: val ? '已开启生物解锁' : '已关闭生物解锁', icon: 'none' })
}

// 3. [新增逻辑]：处理各种菜单点击事件
function handleAction(item: MenuItem) {
  if (item.type === 'switch')
    return

  // 处理危险操作：清除数据
  if (item.id === 'delete') {
    uni.showModal({
      title: '极其危险',
      content: '确定要清除所有本地数据吗？您的所有密码将被永久销毁且无法恢复！',
      confirmColor: '#ef4444',
      success: (res) => {
        if (res.confirm) {
          // 清空所有本地缓存 (包括盐、哈希、AES密文等)
          uni.clearStorageSync()
          // 清空内存钥匙
          authStore.clearAESKey()

          uni.showToast({ title: '数据已清空', icon: 'success' })
          setTimeout(() => {
            // 踢回初始化页面
            uni.reLaunch({ url: '/pages/CreateMaster/CreateMaster' })
          }, 1000)
        }
      },
    })
    return
  }

  // 其他路由跳转逻辑
  console.log('Action triggered:', item.title)
  // uni.navigateTo({ url: `/pages/${item.id}/${item.id}` })
}
</script>

<template>
  <view class="mt-10 px-6 pt-safe">
    <view class="flex flex-col items-center py-10">
      <view class="relative h-24 w-24 flex items-center justify-center border-[3px] border-[#206371] rounded-full">
        <view class="h-full w-full flex items-center justify-center overflow-hidden rounded-full bg-[#1A1A1A]">
          <view class="i-carbon-user-filled text-5xl text-gray-700" />
        </view>
      </view>
      <text class="mt-6 text-2xl text-white font-bold tracking-tight">Alex Doe</text>
    </view>

    <view
      v-for="(group, gIdx) in menuGroups" :key="gIdx"
      class="mb-6 overflow-hidden border border-white/5 rounded-[32px] bg-[#111111]"
    >
      <view
        v-for="item in group" :key="item.id" class="group-item transition-all duration-200 active:bg-white/10"
        @tap="handleAction(item)"
      >
        <view class="mr-4 text-[22px]" :class="[item.icon, item.color]" />

        <text class="flex-1 text-[15px] font-medium" :class="item.isDanger ? 'text-red-500' : 'text-white'">
          {{ item.title }}
        </text>

        <switch
          v-if="item.type === 'switch'" :checked="isBiometricEnabled" color="#3478F6" style="transform:scale(0.8)"
          @change="handleBiometricChange"
        />
        <view v-else class="i-carbon-chevron-right text-xl text-[#333333]" />
      </view>
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

/* [核心修复] 利用原生伪类，自动匹配并去除每组最后一个元素的底边框 */
.group-item:last-child {
  border-bottom: none;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useVaultStore } from '@/composables/useVaultStore'
import { useVaultExport } from '@/composables/useVaultExport'
import { getStorage, setStorage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/utils/storageKeys'
import UserProfile from '@/components/me/UserProfile.vue'
import NameEditorSheet from '@/components/me/NameEditorSheet.vue'
import MenuGroup from '@/components/me/MenuGroup.vue'
import StorageDashboard from '@/components/me/StorageDashboard.vue'

definePage({
  style: { navigationStyle: 'custom' },
})

const authStore = useAuthStore()
const { clearAll } = useVaultStore()
const { handleExport } = useVaultExport()

// ─── 用户档案 ─────────────────────────────────────────────
const profile = ref(getStorage(STORAGE_KEYS.PROFILE) || { name: '用户' })
const showNameEditor = ref(false)

function saveProfile(update: Partial<typeof profile.value>) {
  Object.assign(profile.value, update)
  setStorage(STORAGE_KEYS.PROFILE, { ...profile.value })
  uni.showToast({ title: '已更新', icon: 'success' })
}

function handleNameConfirm(name: string) {
  saveProfile({ name })
  showNameEditor.value = false
}

// ─── 菜单配置 ─────────────────────────────────────────────
interface MenuItem {
  id: string
  title: string
  icon: string
  color: string
  type?: 'switch'
  isDanger?: boolean
}

const isBiometricEnabled = ref(authStore.isBiometricEnabled)

const menuGroups: MenuItem[][] = [
  [
    { id: 'security', title: '安全设置', icon: 'i-carbon-ibm-cloud-key-protect', color: 'text-blue-500' },
    { id: 'password', title: '修改主密码', icon: 'i-carbon-unlocked', color: 'text-emerald-500' },
    { id: 'biometric', title: '生物识别设置', icon: 'i-carbon-settings', color: 'text-gray-400', type: 'switch' },
  ],
  [
    { id: 'export', title: '导出库 (JSON)', icon: 'i-carbon-copy', color: 'text-blue-400' },
    { id: 'import', title: '导入数据', icon: 'i-carbon-document-import', color: 'text-cyan-400' },
    { id: 'delete', title: '清除本地数据', icon: 'i-carbon-trash-can', color: 'text-red-400', isDanger: true },
  ],
]

const routeMap: Record<string, string> = {
  security: '/pages/SecuritySettings/SecuritySettings',
  password: '/pages/ChangePassword/ChangePassword',
  import: '/pages/DataImport/DataImport',
}

function handleBiometricChange(val: boolean) {
  isBiometricEnabled.value = val
  authStore.isBiometricEnabled = val
  setStorage(STORAGE_KEYS.BIOMETRIC, val)
  uni.showToast({
    title: val ? '已开启生物解锁' : '已关闭生物解锁',
    icon: 'none',
    duration: 1500,
  })
}

function handleAction(item: MenuItem) {
  if (item.type === 'switch')
    return
  if (routeMap[item.id]) {
    uni.navigateTo({ url: routeMap[item.id] })
    return
  }
  // 非路由动作
  switch (item.id) {
    case 'export':
      handleExport()
      break
    case 'delete':
      confirmClearAll()
      break
  }
}

function confirmClearAll() {
  uni.showModal({
    title: '极其危险',
    content: '确定要清除所有本地数据吗？您的所有密码将被永久销毁且无法恢复！',
    confirmColor: '#ef4444',
    success: (res) => {
      if (!res.confirm)
        return
      const ok = clearAll()
      if (!ok) {
        uni.showToast({ title: '清除失败', icon: 'none' })
        return
      }
      authStore.clearAESKey()
      uni.showToast({ title: '数据已清空', icon: 'success' })
      setTimeout(() => uni.reLaunch({ url: '/pages/CreateMaster/CreateMaster' }), 1000)
    },
  })
}
</script>

<template>
  <view class="min-h-screen bg-[#050508]  text-white pt-safe">
    <UserProfile :name="profile.name" @edit="showNameEditor = true" />

    <view class="flex flex-col gap-8 px-5 pb-safe">
      <StorageDashboard />

      <MenuGroup v-for="group in menuGroups" :key="group[0].id" :items="group" :biometric-enabled="isBiometricEnabled"
        @action="handleAction" @biometric-change="handleBiometricChange" />
    </view>

    <NameEditorSheet :show="showNameEditor" :current-name="profile.name" @close="showNameEditor = false"
      @confirm="handleNameConfirm" />
  </view>
</template>

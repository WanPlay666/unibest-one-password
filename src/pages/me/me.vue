<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { CATEGORY_MAP } from '@/utils/config'
import { getSecureStorage } from '@/utils/secureStorage'
import { getStorage, setStorage } from '@/utils/storage'

definePage({
  style: { navigationStyle: 'custom' },
})

const authStore = useAuthStore()

// ─── 用户档案 ─────────────────────────────────────────────
const PROFILE_KEY = 'USER_PROFILE'
const profile = ref(getStorage(PROFILE_KEY) || { name: '用户' })
const showNameEditor = ref(false)
const nameDraft = ref('')

function saveProfile(update: Partial<typeof profile.value>) {
  Object.assign(profile.value, update)
  setStorage(PROFILE_KEY, { ...profile.value })
}

function startEditName() {
  nameDraft.value = profile.value.name
  showNameEditor.value = true
}

function confirmName() {
  const name = nameDraft.value.trim()
  if (!name) {
    uni.showToast({ title: '名称不能为空', icon: 'none' })
    return
  }
  saveProfile({ name })
  showNameEditor.value = false
  uni.showToast({ title: '已更新', icon: 'success' })
}

// ─── 菜单功能 ─────────────────────────────────────────────
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

function handleBiometricChange(e: any) {
  const val = e.detail.value
  isBiometricEnabled.value = val
  authStore.isBiometricEnabled = val
  setStorage('SETTING_BIOMETRIC', val)
  uni.showToast({
    title: val ? '已开启生物解锁' : '已关闭生物解锁',
    icon: 'none',
    duration: 1500,
  })
}

function handleAction(item: MenuItem) {
  if (item.type === 'switch') return

  switch (item.id) {
    case 'security':
      uni.navigateTo({ url: '/pages/SecuritySettings/SecuritySettings' })
      break
    case 'password':
      uni.navigateTo({ url: '/pages/ChangePassword/ChangePassword' })
      break
    case 'export':
      handleExport()
      break
    case 'import':
      uni.navigateTo({ url: '/pages/DataImport/DataImport' })
      break
    case 'delete':
      handleDelete()
      break
  }
}

// ─── 导出 JSON ───────────────────────────────────────────
function handleExport() {
  try {
    const data = getSecureStorage('ENCRYPTED_VAULT')
    if (!data || (Array.isArray(data) && data.length === 0)) {
      uni.showToast({ title: '暂无数据可导出', icon: 'none' })
      return
    }

    // 为每条记录补上语义化 type 字段(便于导入时识别)
    const items = (Array.isArray(data) ? data : []).map((rec: any) => ({
      ...rec,
      type: CATEGORY_MAP[String(rec.categoryId)]?.type || rec.type,
    }))

    const payload = {
      version: '1.0',
      exportedAt: Date.now(),
      items,
    }

    const json = JSON.stringify(payload, null, 2)
    const filename = `password-vault-${Date.now()}.json`

    // #ifdef MP-WEIXIN
    const wxFs = uni.getFileSystemManager()
    const wxFilePath = `${wx.env.USER_DATA_PATH}/${filename}`
    wxFs.writeFile({
      filePath: wxFilePath,
      data: json,
      encoding: 'utf8',
      success() {
        uni.openDocument({
          filePath: wxFilePath,
          showMenu: true,
          success: () => uni.showToast({ title: '导出成功', icon: 'success' }),
          fail: () => uni.setClipboardData({
            data: json,
            success: () => uni.showToast({ title: '已复制到剪贴板', icon: 'none' }),
          }),
        })
      },
      fail() {
        uni.setClipboardData({
          data: json,
          success: () => uni.showToast({ title: '已复制到剪贴板', icon: 'none' }),
        })
      },
    })
    // #endif

    // #ifdef APP-PLUS
    plus.io.requestFileSystem(plus.io.PRIVATE_DOC, () => {
      const appFilename = filename
      plus.io.resolveLocalFileSystemURL('_doc', (entry) => {
        entry.getFile(appFilename, { create: true }, (fileEntry) => {
          fileEntry.createWriter((writer) => {
            writer.write(json)
            uni.showToast({ title: '导出成功', icon: 'success' })
            plus.runtime.openFile(fileEntry.toLocalURL())
          })
        })
      })
    })
    // #endif
  }
  catch (error) {
    console.error('导出失败:', error)
    uni.showToast({ title: '导出失败', icon: 'none' })
  }
}

// ─── 清除本地数据 ─────────────────────────────────────────
function handleDelete() {
  uni.showModal({
    title: '极其危险',
    content: '确定要清除所有本地数据吗？您的所有密码将被永久销毁且无法恢复！',
    confirmColor: '#ef4444',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        authStore.clearAESKey()
        uni.showToast({ title: '数据已清空', icon: 'success' })
        setTimeout(() => uni.reLaunch({ url: '/pages/CreateMaster/CreateMaster' }), 1000)
      }
    },
  })
}
</script>

<template>
  <view class="min-h-screen bg-[#050508] text-white pt-safe pb-safe">
    <!-- 用户信息 -->
    <view class="flex flex-col items-center px-6 pt-14 pb-6">
      <view class="h-16 w-16 flex items-center justify-center rounded-full bg-[#1A1A1A] border-[3px] border-[#206371]">
        <view class="i-carbon-user-filled text-4xl text-gray-700" />
      </view>

      <view class="mt-4 flex items-center" @click="startEditName">
        <text class="text-xl text-white font-bold tracking-tight">{{ profile.name }}</text>
        <view class="i-carbon-edit ml-2 text-sm text-gray-500" />
      </view>
    </view>

    <!-- 菜单组 -->
    <view class="px-6">
      <view
        v-for="(group, gIdx) in menuGroups" :key="gIdx"
        class="mb-6 overflow-hidden rounded-[32px] border border-white/5 bg-[#111111]"
      >
        <view
          v-for="item in group" :key="item.id"
          class="group-item transition-all duration-200 active:bg-white/10"
          @tap="handleAction(item)"
        >
        <view class="mr-4 text-xl" :class="[item.icon, item.color]" />

        <text class="flex-1 text-[12px] font-medium" :class="item.isDanger ? 'text-red-500' : 'text-white'">
          {{ item.title }}
        </text>

        <switch
          v-if="item.type === 'switch'" :checked="isBiometricEnabled"
          color="#3478F6" style="transform:scale(0.8)"
          @change="handleBiometricChange"
        />
        <view v-else class="i-carbon-chevron-right text-[12px] text-[#333333]" />
      </view>
    </view>
    </view>

    <!-- 名称编辑浮层 -->
    <view
      v-if="showNameEditor" class="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60"
      @click="showNameEditor = false"
    >
      <view
        class="w-full rounded-t-3xl bg-[#1A1A1A] px-6 pb-10 pt-6"
        @click.stop
      >
        <text class="mb-6 block text-center text-lg text-white font-bold">修改昵称</text>

        <view class="mb-6 h-12 flex items-center rounded-[16px] border border-white/10 bg-[#050508] px-4">
          <input v-model="nameDraft" type="text" class="h-full flex-1 text-base text-white" placeholder="输入昵称"
            placeholder-class="text-gray-500" @confirm="confirmName"
          >
        </view>

        <view class="flex flex-row">
          <button
            class="flex-1 rounded-[18px] border-none bg-white/10 py-3 mr-2 text-sm text-gray-300 font-bold transition-transform active:scale-[0.97]"
            @click="showNameEditor = false"
          >
            取消
          </button>
          <button
            class="flex-1 rounded-[18px] border-none bg-blue-600 py-3 ml-2 text-sm text-white font-bold shadow-blue-900/20 shadow-xl transition-transform active:scale-[0.97]"
            @click="confirmName"
          >
            确定
          </button>
        </view>
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
.group-item:last-child {
  border-bottom: none;
}
</style>

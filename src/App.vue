<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { navigateToInterceptor } from '@/router/interceptor'
import { useAuthStore } from '@/store/auth'
import { removeStorage, setStorage } from '@/utils/storage'

// 设定阀值：切后台超过 3 分钟，彻底销毁内存钥匙
const HOT_START_MAX_TIME = 3 * 60 * 1000

onLaunch((options) => {
  console.log('App.vue onLaunch', options)
})

onShow((options) => {
  const authStore = useAuthStore()

  // ==========================================
  // 🚧🚧🚧 测试阶段：临时开启免密后门 🚧🚧🚧
  // ==========================================

  // 强行注入测试密钥，保证 setSecureStorage 依然能正常加密！
  //  32 位
  authStore.setAESKey('TEST_DEV_KEY_1234567890_12345678')

  // 清除计时器印记
  removeStorage('LAST_HIDE_TIME')

  // 👇 [修改这里] 暴力测试模式：不管你要去哪，一律给我回首页！ 👇
  uni.reLaunch({ url: '/pages/index/index' })
  // 👇 --- 下面这三大块拦截逻辑，在测试阶段统统注释掉 --- 👇

  /* // 1. 检查是否初始化过主密码
  const hasMaster = !!(getStorage('APP_SALT') && getStorage('MASTER_HASH'))
  if (!hasMaster) {
    uni.reLaunch({ url: '/pages/CreateMaster/CreateMaster' })
    return
  }

  // 2. 检查内存状态 (防冷启动绕过 / 杀进程绕过)
  if (!authStore.isUnlocked) {
    uni.reLaunch({ url: '/pages/Unlock/Unlock' })
    return
  }

  // 3. 热启动判定：处理从后台切回来的情况
  const lastHideTime = getStorage('LAST_HIDE_TIME')
  if (lastHideTime) {
    const timeInBackground = Date.now() - Number(lastHideTime)

    if (timeInBackground > HOT_START_MAX_TIME) {
      authStore.clearAESKey()
      uni.reLaunch({ url: '/pages/Unlock/Unlock' })
      return
    }
    else if (timeInBackground > 0 && authStore.isBiometricEnabled) {
      authStore.showBiometricMask = true
    }
  }
  */
  // 👆 --- 注释结束 --- 👆

  // 清除计时器印记
  removeStorage('LAST_HIDE_TIME')

  // 4. 放行路由 (这段必须留着，不然页面白屏)
  if (options?.path) {
    navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query })
  }
  else {
    navigateToInterceptor.invoke({ url: '/' })
  }
})

onHide(() => {
  console.log('App Hide')
  setStorage('LAST_HIDE_TIME', Date.now())
})
</script>

<style lang="scss"></style>

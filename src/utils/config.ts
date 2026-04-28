// src/utils/config.ts
export const CATEGORY_ROUTE_MAP: Record<string, string> = {
  1: '/pages/accountPasswordAdd/accountPasswordAdd', // 基础登录
  2: '/pages/IdentityAdd/IdentityAdd', // 身份信息
  3: '/pages/BankAdd/BankAdd', // 银行支付
  4: '/pages/SocialAdd/SocialAdd', // 社交通讯
  5: '/pages/VehicleAdd/VehicleAdd', // 车辆信息
  6: '/pages/BusinessAdd/BusinessAdd', // 企业开票
  7: '/pages/HealthcareAdd/HealthcareAdd', // 医疗社保
  8: '/pages/WifiAdd/WifiAdd', // Wi-Fi网络
  9: '/pages/SoftwareAdd/SoftwareAdd', // 软件授权
}

// src/utils/config.ts

export interface CategoryConfig {
  name: any
  id: string
  title: string
  icon: string
  color: string
}

export const CATEGORY_MAP: Record<string, CategoryConfig> = {
  1: { id: '1', title: '基础登录', icon: 'i-carbon-password', color: 'bg-blue-600' },
  2: { id: '2', title: '身份信息', icon: 'i-carbon-user', color: 'bg-indigo-500' },
  3: { id: '3', title: '银行支付', icon: 'i-carbon-wallet', color: 'bg-emerald-500' },
  4: { id: '4', title: '社交通讯', icon: 'i-carbon-chat', color: 'bg-sky-400' },
  5: { id: '5', title: '车辆信息', icon: 'i-carbon-car', color: 'bg-orange-500' },
  6: { id: '6', title: '企业开票', icon: 'i-carbon-receipt', color: 'bg-pink-400' },
  7: { id: '7', title: '医疗社保', icon: 'i-carbon-stethoscope', color: 'bg-red-500' },
  8: { id: '8', title: 'Wi-Fi 网络', icon: 'i-carbon-wifi', color: 'bg-violet-500' },
  9: { id: '9', title: '软件授权', icon: 'i-carbon-code', color: 'bg-slate-500' },
}

// 方便给“选择分类”页面渲染列表使用
export const CATEGORY_LIST = Object.values(CATEGORY_MAP)

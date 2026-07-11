// 项目中所有 storage key 的唯一来源。新增 key 必须在此声明,
// 业务代码用 import { STORAGE_KEYS } from '@/utils/storageKeys' 引用,
// 禁止再硬编码字符串。

export const STORAGE_KEYS = {
  /** 主保险箱:加密存储所有记录 */
  VAULT: 'ENCRYPTED_VAULT',
  /** 用户档案:昵称等基础信息(非敏感) */
  PROFILE: 'USER_PROFILE',
  /** 偏好:生物识别开关(布尔,非敏感) */
  BIOMETRIC: 'SETTING_BIOMETRIC',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

/**
 * 密码强度检测结果接口
 */
export interface PasswordStrengthResult {
  score: number // 强度得分 (0 - 32)
  color: string // 建议使用的 UI 颜色 (Hex)
  label: '弱' | '中' | '强' | '极强' // 文本标签
}

/**
 * 公共密码强度检测方法
 * @param pwd 待检测的密码字符串
 */
export function checkPasswordStrength(pwd: string): PasswordStrengthResult {
  if (!pwd) {
    return { score: 0, color: '#222', label: '弱' }
  }

  let score = 0
  // 1. 基础长度分（最高 20 分）
  score += Math.min(pwd.length, 20)

  // 2. 复杂度加分（检测不同字符类型）
  const hasNumber = /\d/.test(pwd)
  const hasUpper = /[A-Z]/.test(pwd)
  const hasLower = /[a-z]/.test(pwd)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)

  if (hasNumber)
    score += 3 // 包含数字
  if (hasUpper)
    score += 3 // 包含大写字母
  if (hasLower)
    score += 2 // 包含小写字母
  if (hasSpecial)
    score += 4 // 包含特殊符号

  const finalScore = Math.min(score, 32)

  // 3. 映射颜色与标签
  let color = '#ef4444' // 默认红色
  let label: PasswordStrengthResult['label'] = '弱'

  if (finalScore >= 22) {
    color = '#10b981' // 绿色
    label = '强'
    if (finalScore >= 30)
      label = '极强'
  }
  else if (finalScore >= 12) {
    color = '#f59e0b' // 橙色
    label = '中'
  }

  return {
    score: finalScore,
    color,
    label,
  }
}

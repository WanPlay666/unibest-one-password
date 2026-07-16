import CryptoJS from 'crypto-js'

// 计算验证哈希 (保持不变)
export function hashMasterPassword(password: string, salt: string): string {
  if (!password || !salt)
    return ''
  return CryptoJS.SHA256(password + salt).toString()
}

// 派生 AES 工作密钥 (保持不变)
export function deriveAESKey(password: string, salt: string): string {
  if (!password || !salt)
    return ''
  return CryptoJS.SHA256(`${password + salt}_AES_SECRET_KEY_`).toString()
}

// 生成随机盐
export function generateSalt(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let salt = ''
  for (let i = 0; i < length; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return salt
}
/**
 * 加密数据
 */
export function encryptData(data: any, key: string): string {
  if (data === undefined || data === null || !key)
    return ''
  try {
    const stringData = JSON.stringify(data)
    // 注意：这里必须和解密完全一致。如果 key 是 hex 字符串，用 Hex.parse；如果是普通字符，用 Utf8.parse
    const parsedKey = CryptoJS.enc.Utf8.parse(key.substring(0, 32))
    const ivString = generateSalt(16)
    const parsedIv = CryptoJS.enc.Utf8.parse(ivString)

    const encrypted = CryptoJS.AES.encrypt(stringData, parsedKey, {
      iv: parsedIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return `${ivString}:${encrypted.toString()}`
  }
  catch (e) { return '' }
}

/**
 * 解密数据
 */
export function decryptData(ciphertextWithIv: string, key: string): any {
  if (!ciphertextWithIv || !key)
    return null
  try {
    const parts = ciphertextWithIv.split(':')
    if (parts.length !== 2)
      return null

    const ivString = parts[0]
    const ciphertext = parts[1]

    // 关键：确保这里解析 key 的方式与上面 encryptData 100% 相同
    const parsedKey = CryptoJS.enc.Utf8.parse(key.substring(0, 32))
    const parsedIv = CryptoJS.enc.Utf8.parse(ivString)

    const bytes = CryptoJS.AES.decrypt(ciphertext, parsedKey, {
      iv: parsedIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
    if (!decryptedString)
      throw new Error('Malformed UTF-8')
    return JSON.parse(decryptedString)
  }
  catch (error) {
    console.error('AES 解密失败:', error) // 这里就是你截图报错的地方
    return null
  }
}

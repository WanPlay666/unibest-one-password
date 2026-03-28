import CryptoJS from 'crypto-js'

// 生成随机盐 (保持不变)
export function generateSalt(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let salt = ''
  for (let i = 0; i < length; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return salt
}

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

/**
 * [优雅重构] 加密数据 (显式指定 Key 和 IV，完美绕过小程序随机数报错)
 */
export function encryptData(data: any, key: string): string {
  if (data === undefined || data === null || !key)
    return ''

  try {
    const stringData = JSON.stringify(data)

    // 1. 因为你的 deriveAESKey 返回的是 SHA256 的 Hex 字符串，把它转成原生字节流
    const parsedKey = CryptoJS.enc.Hex.parse(key)

    // 2. 核心：复用你自己的 generateSalt 生成 16 字节的 IV (初始向量)
    const ivString = generateSalt(16)
    const parsedIv = CryptoJS.enc.Utf8.parse(ivString)

    // 3. 明确传入 key 和 iv 进行加密，CryptoJS 就不会再自己去生成随机数了！
    const encrypted = CryptoJS.AES.encrypt(stringData, parsedKey, {
      iv: parsedIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    // 4. 注意：IV 每次加密都是随机的，必须把 IV 和密文用冒号拼接存起来，解密时才认识
    return `${ivString}:${encrypted.toString()}`
  }
  catch (error) {
    console.error('AES 加密失败:', error)
    return ''
  }
}

/**
 * [优雅重构] 解密数据
 */
export function decryptData(ciphertextWithIv: string, key: string): any {
  if (!ciphertextWithIv || !key)
    return null

  try {
    // 1. 把刚才拼接的 IV 和真实密文拆分开
    const parts = ciphertextWithIv.split(':')
    if (parts.length !== 2)
      throw new Error('密文格式不正确，缺少 IV')

    const ivString = parts[0]
    const ciphertext = parts[1]

    // 2. 还原 Key 和 IV 的字节流
    const parsedKey = CryptoJS.enc.Hex.parse(key)
    const parsedIv = CryptoJS.enc.Utf8.parse(ivString)

    // 3. 明确传入 key 和 iv 进行解密
    const bytes = CryptoJS.AES.decrypt(ciphertext, parsedKey, {
      iv: parsedIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)

    if (!decryptedString) {
      throw new Error('解密失败：密钥不匹配或数据已损坏')
    }

    return JSON.parse(decryptedString)
  }
  catch (error) {
    console.error('AES 解密失败:', error)
    return null
  }
}

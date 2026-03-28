// src/utils/PasswordGenerator.ts

interface GenerateOptions {
  symbols?: boolean
  numbers?: boolean
  uppercase?: boolean
  lowercase?: boolean
}

export function generateRandomString(length: number, options: GenerateOptions) {
  const {
    symbols = false,
    numbers = true,
    uppercase = false,
    lowercase = true,
  } = options

  const charsets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
  }

  // 构建可用字符集
  let availableChars = ''
  if (lowercase)
    availableChars += charsets.lowercase
  if (uppercase)
    availableChars += charsets.uppercase
  if (numbers)
    availableChars += charsets.numbers
  if (symbols)
    availableChars += charsets.symbols

  // 兜底逻辑：如果什么都没选，默认返回纯数字
  if (!availableChars)
    availableChars = charsets.numbers

  let result = ''
  // 使用 Math.random 保证在小程序环境绝对可用
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * availableChars.length)
    result += availableChars.charAt(randomIndex)
  }

  return result
}

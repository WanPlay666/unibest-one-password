import { getTypeByName, TYPE_LIST, type TypeSchema } from '@/utils/importSchema'

export function getTypeMeta(typeName: string): TypeSchema {
  return getTypeByName(typeName) || TYPE_LIST[0]
}

export function formatSize(b: number): string {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}

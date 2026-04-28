import { ref } from 'vue'

export interface RelatedItem {
  id: string
  value: string
}

export function useRelatedItems() {
  const items = ref<RelatedItem[]>([])

  const setItems = (data: any) => {
    // 使用深拷贝断开外部引用干扰
    items.value = Array.isArray(data) ? JSON.parse(JSON.stringify(data)) : []
  }
  const addItem = (value: string) => {
    const id = `ID_${Math.random().toString(36).slice(2, 9)}`
    items.value.push({ id, value })
  }

  const removeItem = (id: string) => {
    items.value = items.value.filter(item => item.id !== id)
  }

  return { items, setItems, addItem, removeItem }
}

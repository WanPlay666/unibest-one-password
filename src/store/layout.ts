import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 布局全局状态:集中存储"会跨组件复用的布局尺寸",
 * 让 SearchBar / 浮层 / 浮动按钮等元素能"自动知道"Header / Tabbar 高度,
 * 不用每个页面手动传 offsetTop。
 *
 * 当前只有一个字段:headerHeight(由 <Header> 组件 mount 时写入)。
 */
export const useLayoutStore = defineStore('layout', () => {
  /** 当前页面 <Header> 组件的实际高度 (px)。SearchBar 等浮动元素用作 fixed offsetTop */
  const headerHeight = ref(0)

  function setHeaderHeight(h: number) {
    headerHeight.value = h
  }

  return { headerHeight, setHeaderHeight }
})

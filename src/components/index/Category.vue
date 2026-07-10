<script lang="ts" setup>
defineOptions({
  name: 'CategoryGrid',
})

// 接收父组件传递的分类列表
defineProps<{
  categories: CategoryItem[]
}>()

// 定义点击事件
const emit = defineEmits<{
  click: [item: CategoryItem]
}>()

// 定义数据接口
interface CategoryItem {
  id: string | number
  title: string
  count: number
  icon: string
  color: string
}
</script>

<template>
  <view class="mt-8">
    <!-- 栏目标题：对应图片中的“分类”字样 -->
    <view class="mb-5 flex items-center px-1">
      <text class="text-sm text-[#555555] font-bold">分类</text>
    </view>

    <!-- 网格布局：3列，间距根据图片比例微调 -->
    <view class="grid grid-cols-3 gap-x-4 gap-y-5">
      <view v-for="item in categories" :key="item.id"
        class="aspect-square flex flex-col items-center justify-center b-1 border-white/10 rounded-[28px] b-solid bg-[#1A1A1A] transition-all duration-200 active:bg-[#1a1a1a]"
        @tap="emit('click', item)">
        <!-- 彩色图标容器：高度还原图片的圆角和色彩感 -->
        <view class="mb-3 h-10 w-10 flex items-center justify-center rounded-full shadow-black/40 shadow-md" :class="[
          item.color,
        ]">
          <!-- UnoCSS 图标 -->
          <view class="text-lg text-white" :class="[item.icon]" />
        </view>

        <!-- 分类名称：纯白文字 -->
        <text class="mb-1 text-sm text-white font-semibold tracking-wide">{{ item.title }}</text>

        <!-- 子条目数量：暗灰色 -->
        <text class="mt-2 text-sm text-[#555555] font-bold">{{ item.count }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* 微信小程序 grid 环境兼容 */
.grid {
  display: grid;
}

/**
 * 确保锁定 1:1 正方形比例
 */
.aspect-square {
  aspect-ratio: 1 / 1;
}

/* 针对不同机型微调字体渲染 */
text {
  line-height: 1;
}
</style>

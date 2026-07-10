<script lang="ts" setup>
import { computed, ref } from 'vue'
import Header from '@/components/Header.vue'
import BottomActionBar from '@/components/DataImport/BottomActionBar.vue'
import DuplicateHandler from '@/components/DataImport/DuplicateHandler.vue'
import ImportComplete from '@/components/DataImport/ImportComplete.vue'
import ParsePreview from '@/components/DataImport/ParsePreview.vue'
import PasteSheet from '@/components/DataImport/PasteSheet.vue'
import Step1Intro from '@/components/DataImport/Step1Intro.vue'
import StepIndicator from '@/components/DataImport/StepIndicator.vue'
import TemplateSheet from '@/components/DataImport/TemplateSheet.vue'
import { useDataImport } from '@/composables/useDataImport'
import { buildImportTemplate } from '@/utils/importSchema'

definePage({
  style: { navigationStyle: 'custom' },
})

const {
  fileName,
  fileSize,
  parseResult,
  entries,
  step,
  loadFromText,
  setEntryAction,
  bulkSetAction,
  commit,
  reset,
} = useDataImport()

const showPaste = ref(false)
const showTemplate = ref(false)
const templateJson = computed(() => buildImportTemplate())

const commitResult = ref<{ added: number, overwritten: number, skipped: number, total: number } | null>(null)

const validCount = computed(() => parseResult.value?.items.length || 0)
const invalidCount = computed(() => parseResult.value?.invalid.length || 0)
const dupCount = computed(() => entries.value.filter(e => e.matchedLocalId).length)
const newCount = computed(() => entries.value.filter(e => !e.matchedLocalId).length)

const typeStats = computed(() => {
  const map: Record<string, number> = {}
  for (const e of entries.value) {
    map[e.item.type] = (map[e.item.type] || 0) + 1
  }
  return map
})

// ─── 浮层 ──────────────────────────────────────────────

function openPaste() {
  showPaste.value = true
}

function handlePasteConfirm(text: string) {
  loadFromText(text, '手动粘贴.json')
  showPaste.value = false
}

function openTemplate() {
  showTemplate.value = true
}

function handleTemplateCopy() {
  uni.setClipboardData({
    data: templateJson.value,
    success: () => uni.showToast({ title: '已复制到剪贴板', icon: 'success' }),
    fail: () => uni.showToast({ title: '复制失败', icon: 'none' }),
  })
}

function handleTemplateUse() {
  loadFromText(templateJson.value, '导入模版.json')
  showTemplate.value = false
}

// ─── 流程推进 ──────────────────────────────────────────

function handleNext() {
  if (step.value === 2) {
    if (validCount.value === 0) {
      step.value = 4
      commitResult.value = { added: 0, overwritten: 0, skipped: 0, total: 0 }
      return
    }
    step.value = 3
  }
}

function handleCommit() {
  const r = commit()
  if (r) {
    commitResult.value = r
    uni.showToast({ title: '导入完成', icon: 'success' })
  }
}

function handleReset() {
  commitResult.value = null
  reset()
}

function handleFinish() {
  uni.reLaunch({ url: '/pages/index/index' })
}

function handlePrev() {
  if (step.value === 3)
    step.value = 2
}

function handleBack() {
  if (step.value === 4) {
    handleReset()
    return
  }
  if (step.value === 3) {
    step.value = 2
    return
  }
  if (step.value === 2) {
    handleReset()
    return
  }
  uni.navigateBack()
}
</script>

<template>
  <view class="min-h-screen bg-[#050508] text-white pt-safe pb-safe">
    <Header title="导入数据" fixed @back="handleBack" />

    <view class="px-6 py-16">
      <StepIndicator :step="step" />

      <Step1Intro v-if="step === 1" @open-paste="openPaste" @open-template="openTemplate" />

      <ParsePreview v-else-if="step === 2" :file-name="fileName" :file-size="fileSize" :type-stats="typeStats"
        :entries="entries" :parse-result="parseResult" :new-count="newCount" :dup-count="dupCount"
        :invalid-count="invalidCount" />

      <DuplicateHandler v-else-if="step === 3" :entries="entries" :dup-count="dupCount" @set-all="bulkSetAction"
        @set-entry-action="setEntryAction" />

      <ImportComplete v-else-if="step === 4" :result="commitResult" @reset="handleReset" @finish="handleFinish" />
    </view>

    <BottomActionBar :step="step" :valid-count="validCount" @reset="handleReset" @prev="handlePrev" @next="handleNext"
      @commit="handleCommit" />

    <PasteSheet :show="showPaste" @close="showPaste = false" @confirm="handlePasteConfirm" />

    <TemplateSheet :show="showTemplate" :template="templateJson" @close="showTemplate = false"
      @copy="handleTemplateCopy" @use="handleTemplateUse" />
  </view>
</template>

# Claude Code 行为规则

## 语言
- 所有回复必须使用中文(代码、注释、commit message 除外,跟随项目本身语言习惯)。

## 需求澄清
- 需求不明确、有歧义、存在多种合理解释时,必须先和用户讨论清楚再开发。
- 禁止"先猜一个方向写出来再说"。涉及 UI 偏好、业务规则、命名约定等容易反复的点时,务必先对齐。
- 接到上一轮的反馈后,确认理解一致再动手,避免方向走偏。

## Loading 约定
按操作延迟分三档,使用对应 UI:

- **重操作 (>500ms,全屏)**:`uni.showLoading({ title })` + `uni.hideLoading()`,成对调用,放 `finally`。
  - 适用:解锁、修改主密码、导入数据 commit、导出。
- **中操作 (200-500ms,按钮态)**:复用 `BottomButton` 的 `loading` prop,接入 `useRecordForm` 暴露的 `isSaving` ref,不要用 `uni.showLoading` 代替。
  - 适用:9 个 Add 页表单提交。
- **轻操作 (<200ms)**:只 `uni.showToast` 收尾,不显示 loading。
  - 适用:收藏切换、删除单条、清除数据、开关类设置。

约束:
- 失败必须 toast 报错,loading 不能吞异常。
- 禁止用 `setTimeout` 模拟 loading 延迟(Unlock.vue 旧的 500ms 已移除)。
- 进度文案统一:解锁 → "正在解锁...";改密 → "正在重新加密...";导入 → "正在导入 N 条...";导出 → "正在导出..."。

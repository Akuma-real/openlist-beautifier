<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 应用根组件
</script>

<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
  overflow: hidden;
}

/* Element Plus 样式定制 */
:root {
  --el-color-primary: #409eff;
  --el-color-success: #67c23a;
  --el-color-warning: #e6a23c;
  --el-color-danger: #f56c6c;
  --el-color-error: #f56c6c;
  --el-color-info: #909399;
  --el-border-radius-base: 6px;
  --el-border-radius-small: 4px;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 代码块样式 */
pre, code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
}

/* 工具提示样式优化 */
.el-tooltip__popper {
  font-size: 12px;
}

/* 卡片间距优化 */
.el-card + .el-card {
  margin-top: 16px;
}

/* 表单项间距优化 */
.el-form-item {
  margin-bottom: 18px;
}

/* 按钮组间距 */
.el-button-group .el-button {
  margin: 0;
}

.el-button + .el-button {
  margin-left: 8px;
}

/* 标签页内容区域 */
.el-tabs__content {
  padding-top: 16px;
}

/* 折叠面板样式 */
.el-collapse {
  border: none;
}

.el-collapse-item__header {
  background: #f8f9fa;
  padding: 0 16px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

.el-collapse-item__content {
  background: #fff;
  border: 1px solid #e9ecef;
  border-top: none;
  border-radius: 0 0 6px 6px;
}

/* 加载状态样式 */
.el-loading-mask {
  background-color: rgba(255, 255, 255, 0.9);
}

/* 对话框样式优化 */
.el-dialog {
  border-radius: 8px;
  overflow: hidden;
}

.el-dialog__header {
  padding: 20px 20px 10px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.el-dialog__body {
  padding: 20px;
}

/* 响应式工具类 */
@media (max-width: 768px) {
  .el-dialog {
    width: 90% !important;
    margin: 5vh auto !important;
  }
  
  .el-card__body {
    padding: 16px;
  }
  
  .el-form--label-left .el-form-item__label {
    width: 80px !important;
  }
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
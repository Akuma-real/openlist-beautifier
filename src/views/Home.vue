<template>
  <div class="app-container">
    <!-- 头部导航 -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <el-icon class="header-icon"><Picture /></el-icon>
          <h1 class="header-title">OpenList 美化配置生成器</h1>
          <el-tag type="info" size="small">v1.0</el-tag>
        </div>
        
        <div class="header-right">
          <el-tooltip content="重置配置" placement="bottom">
            <el-button
              @click="handleReset"
              size="small"
              :icon="RefreshLeft"
              circle
            />
          </el-tooltip>
          
          <el-tooltip content="关于项目" placement="bottom">
            <el-button
              @click="showAboutDialog = true"
              size="small"
              :icon="InfoFilled"
              circle
            />
          </el-tooltip>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="app-main">
      <div class="main-container">
        <!-- 左侧模块选择面板 -->
        <aside class="config-sidebar">
          <ModuleSelector />
        </aside>

        <!-- 中间配置面板 -->
        <main class="config-main">
          <ModuleConfigPanel />
        </main>

        <!-- 右侧输出面板 -->
        <aside class="output-sidebar">
          <OutputPanel />
        </aside>
      </div>
    </main>

    <!-- 关于对话框 -->
    <el-dialog
      v-model="showAboutDialog"
      title="关于 OpenList 美化配置生成器"
      width="500px"
    >
      <div class="about-content">
        <div class="about-header">
          <el-icon class="about-icon"><Picture /></el-icon>
          <div>
            <h3>OpenList 美化配置生成器</h3>
            <p class="version">版本 v1.0</p>
          </div>
        </div>

        <div class="about-info">
          <h4>✨ 项目特性</h4>
          <ul>
            <li>🎨 可视化配置界面，无需编写代码</li>
            <li>📋 一键复制/下载生成的文件</li>
            <li>🔧 支持配置导入/导出</li>
            <li>📱 响应式设计，支持移动端</li>
            <li>🚀 基于Vue3+TypeScript开发</li>
          </ul>

          <h4>🛠️ 技术栈</h4>
          <ul>
            <li>Vue 3 + TypeScript + Vite</li>
            <li>Element Plus UI框架</li>
            <li>Pinia 状态管理</li>
          </ul>

          <h4>📄 开源协议</h4>
          <p>MIT License</p>
        </div>
      </div>
    </el-dialog>

    <!-- 全局加载器 -->
    <div v-if="moduleStore.isGenerating" class="global-loading">
      <div class="loading-content">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <span>正在生成配置文件...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Picture, 
  RefreshLeft, 
  InfoFilled,
  Loading
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useModuleStore } from '@/stores/modules'
import ModuleSelector from '@/components/ModuleSelector.vue'
import ModuleConfigPanel from '@/components/ModuleConfigPanel.vue'
import OutputPanel from '@/components/OutputPanel.vue'

const moduleStore = useModuleStore()

// 对话框状态
const showAboutDialog = ref(false)

// 初始化时加载本地配置
moduleStore.loadFromLocalStorage()

// 重置配置
const handleReset = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置所有配置到默认状态吗？此操作不可恢复。',
      '重置配置',
      {
        confirmButtonText: '确定重置',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    moduleStore.resetToDefault()
    ElMessage.success('配置已重置到默认状态')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 24px;
  color: #409eff;
}

.header-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  gap: 8px;
}

.app-main {
  flex: 1;
  overflow: hidden;
  padding: 24px;
}

.main-container {
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 400px 1fr 350px;
  gap: 24px;
  min-height: 0; /* 确保子元素可以收缩 */
}

.config-sidebar {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-width: 0; /* 防止flex收缩问题 */
}

.config-main {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-width: 0; /* 防止flex收缩问题 */
}

.output-sidebar {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-width: 0; /* 防止flex收缩问题 */
  max-width: 350px; /* 确保最大宽度约束 */
}

.about-content {
  padding: 8px 0;
}

.about-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.about-icon {
  font-size: 48px;
  color: #409eff;
}

.about-header h3 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.version {
  margin: 4px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.about-info h4 {
  color: #409eff;
  margin: 16px 0 8px 0;
  font-size: 16px;
}

.about-info ul {
  margin: 8px 0 16px 16px;
  font-size: 14px;
  line-height: 1.6;
}

.about-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #606266;
}

.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #606266;
}

.loading-icon {
  font-size: 32px;
  color: #409eff;
  animation: loading-rotate 2s linear infinite;
}

@keyframes loading-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .main-container {
    grid-template-columns: 350px 1fr 300px;
  }
}

@media (max-width: 1200px) {
  .main-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    gap: 16px;
  }
  
  .config-sidebar {
    order: 1;
    max-width: none; /* 移除小屏时的宽度限制 */
  }
  
  .output-sidebar {
    order: 2;
    max-width: none; /* 移除小屏时的宽度限制 */
  }
  
  .config-main {
    order: 3;
    max-width: none; /* 移除小屏时的宽度限制 */
  }
}

@media (max-width: 768px) {
  .app-main {
    padding: 16px;
  }
  
  .header-content {
    padding: 0 16px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .main-container {
    gap: 12px;
  }
  
  /* 移动端输出面板特殊处理 */
  .output-sidebar {
    min-height: 400px; /* 确保移动端有足够高度 */
  }
}
</style>
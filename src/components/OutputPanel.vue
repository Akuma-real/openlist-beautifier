<template>
  <div class="output-panel">
    <el-card class="output-card">
      <template #header>
        <div class="card-header">
          <el-icon><DocumentCopy /></el-icon>
          <span>生成文件</span>
          <div class="header-actions">
            <el-button
              @click="generateFiles"
              :loading="isGenerating"
              type="primary"
              size="small"
              :icon="Refresh"
            >
              {{ isGenerating ? '生成中...' : '重新生成' }}
            </el-button>
          </div>
        </div>
      </template>

      <!-- 文件标签页 -->
      <el-tabs v-model="activeTab" class="file-tabs">
        <!-- head.html 标签页 -->
        <el-tab-pane label="head.html" name="head">
          <div class="file-content">
            <div class="file-header">
              <div class="file-info">
                <el-tag type="info" size="small">头部文件</el-tag>
                <span class="file-size">{{ headFileStats.size }}</span>
                <span class="file-lines">{{ headFileStats.lines }}行</span>
              </div>
              <div class="file-actions">
                <el-button
                  @click="copyHeadContent"
                  :loading="copyingHead"
                  size="small"
                  :icon="DocumentCopy"
                >
                  复制
                </el-button>
              </div>
            </div>
            
            <div class="code-container">
              <pre class="code-content">{{ headContent }}</pre>
            </div>
          </div>
        </el-tab-pane>

        <!-- body.html 标签页 -->
        <el-tab-pane label="body.html" name="body">
          <div class="file-content">
            <div class="file-header">
              <div class="file-info">
                <el-tag type="warning" size="small">内容文件</el-tag>
                <span class="file-size">{{ bodyFileStats.size }}</span>
                <span class="file-lines">{{ bodyFileStats.lines }}行</span>
              </div>
              <div class="file-actions">
                <el-button
                  @click="copyBodyContent"
                  :loading="copyingBody"
                  size="small"
                  :icon="DocumentCopy"
                >
                  复制
                </el-button>
              </div>
            </div>
            
            <div class="code-container">
              <pre class="code-content">{{ bodyContent }}</pre>
            </div>
          </div>
        </el-tab-pane>

        <!-- 配置预览标签页 -->
        <el-tab-pane label="配置预览" name="config">
          <div class="config-preview">
            <div class="file-header">
              <div class="file-info">
                <el-tag type="success" size="small">配置信息</el-tag>
              </div>
              <div class="file-actions">
                <el-button
                  @click="copyConfigJSON"
                  :loading="copyingConfig"
                  size="small"
                  :icon="DocumentCopy"
                >
                  复制配置
                </el-button>
              </div>
            </div>
            
            <div class="config-content">
              <pre class="config-text">{{ configPreview }}</pre>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- 批量操作区域 -->
      <div class="batch-actions">
        <div class="batch-info">
          <el-icon><InfoFilled /></el-icon>
          <span>总计 {{ fileStats.fileCount }} 个文件，大小 {{ fileStats.totalSize }}</span>
          <el-divider direction="vertical" />
          <span>启用 {{ generatedFiles.enabledModules.length }} 个模块</span>
        </div>
        
        <div class="batch-buttons">
          <el-button
            @click="copyAllFiles"
            :loading="copyingAll"
            type="primary"
            :icon="DocumentCopy"
          >
            复制全部
          </el-button>
        </div>
      </div>

      <!-- 使用说明 -->
      <el-collapse v-model="expandedPanels" class="usage-guide">
        <el-collapse-item title="使用说明" name="usage">
          <div class="usage-content">
            <h4>📋 部署步骤</h4>
            <ol>
              <li>登录 OpenList 管理后台</li>
              <li>进入 "设置" → "全局" 页面</li>
              <li>将 <strong>head.html</strong> 内容复制到 "自定义头部" 中</li>
              <li>将 <strong>body.html</strong> 内容复制到 "自定义内容" 中</li>
              <li>保存设置并刷新页面查看效果</li>
            </ol>

            <h4>🔧 调试提示</h4>
            <ul>
              <li>打开浏览器开发者工具（F12）查看调试信息</li>
              <li>在控制台输入 <code>window.openlistBeautifier</code> 查看美化器实例</li>
              <li>如遇问题，可尝试 <code>window.openlistBeautifier.undo()</code> 撤销美化</li>
            </ul>

            <h4>⚠️ 注意事项</h4>
            <ul>
              <li>请确保 OpenList 版本支持自定义 HTML</li>
              <li>建议先在测试环境部署验证效果</li>
              <li>如需修改配置，请使用本生成器重新生成</li>
            </ul>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { 
  DocumentCopy, 
  Refresh, 
  InfoFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useModuleStore } from '@/stores/modules'
import { ModularFileGenerator } from '@/utils/modularFileGenerator'
import { ClipboardManager } from '@/utils/clipboard'

const moduleStore = useModuleStore()

// 响应式数据
const activeTab = ref('head')
const expandedPanels = ref<string[]>([])
const isGenerating = ref(false)
const copyingHead = ref(false)
const copyingBody = ref(false)
const copyingConfig = ref(false)
const copyingAll = ref(false)

// 计算属性：生成的文件内容
const generatedFiles = computed(() => {
  return ModularFileGenerator.generateFiles(moduleStore.config)
})

const headContent = computed(() => generatedFiles.value.headContent)
const bodyContent = computed(() => generatedFiles.value.bodyContent)

// 计算属性：配置预览
const configPreview = computed(() => {
  return ModularFileGenerator.generateConfigPreview(moduleStore.config)
})

// 计算属性：文件统计信息
const fileStats = computed(() => ({
  fileCount: generatedFiles.value.fileCount,
  totalSize: generatedFiles.value.totalSize
}))

const headFileStats = computed(() => ({
  size: generatedFiles.value.headSize,
  lines: generatedFiles.value.headLines
}))

const bodyFileStats = computed(() => ({
  size: generatedFiles.value.bodySize,
  lines: generatedFiles.value.bodyLines
}))

// 监听配置变化，自动更新生成的文件
watch(
  () => moduleStore.config,
  () => {
    // 配置变化时自动重新生成
  },
  { deep: true, immediate: true }
)

// 生成文件
const generateFiles = async () => {
  isGenerating.value = true
  
  try {
    // 验证配置
    const validation = ModularFileGenerator.validateConfig(moduleStore.config)
    if (!validation.valid) {
      ElMessage.error(`配置验证失败: ${validation.errors.join(', ')}`)
      return
    }

    moduleStore.setGenerating(true)
    
    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success('文件生成完成！')
  } catch (error) {
    console.error('生成文件失败:', error)
    ElMessage.error('文件生成失败，请检查配置')
  } finally {
    isGenerating.value = false
    moduleStore.setGenerating(false)
  }
}

// 复制功能
const copyHeadContent = async () => {
  copyingHead.value = true
  try {
    const success = await ClipboardManager.copyFileContent(headContent.value, 'head.html')
    if (success) {
      ElMessage.success('head.html 内容已复制到剪贴板')
    } else {
      ElMessage.error('复制失败，请手动选择复制')
    }
  } finally {
    copyingHead.value = false
  }
}

const copyBodyContent = async () => {
  copyingBody.value = true
  try {
    const success = await ClipboardManager.copyFileContent(bodyContent.value, 'body.html')
    if (success) {
      ElMessage.success('body.html 内容已复制到剪贴板')
    } else {
      ElMessage.error('复制失败，请手动选择复制')
    }
  } finally {
    copyingBody.value = false
  }
}

const copyConfigJSON = async () => {
  copyingConfig.value = true
  try {
    const success = await ClipboardManager.copyConfigJSON(moduleStore.config)
    if (success) {
      ElMessage.success('配置JSON已复制到剪贴板')
    } else {
      ElMessage.error('复制失败，请手动选择复制')
    }
  } finally {
    copyingConfig.value = false
  }
}

const copyAllFiles = async () => {
  copyingAll.value = true
  try {
    const success = await ClipboardManager.copyBothFiles(
      headContent.value,
      bodyContent.value
    )
    if (success) {
      ElMessage.success('所有文件内容已复制到剪贴板')
    } else {
      ElMessage.error('批量复制失败，请分别复制')
    }
  } finally {
    copyingAll.value = false
  }
}

// 初始化时生成文件
generateFiles()
</script>

<style scoped>
.output-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止整体溢出 */
}

.output-card {
  height: 100%;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止卡片溢出 */
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 16px;
}

.card-header .el-icon {
  margin-right: 8px;
}

.file-tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.file-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 确保内容不会溢出父容器 */
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 16px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #606266;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.code-container {
  flex: 1;
  overflow: auto;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  min-height: 0; /* 允许shrink */
  max-width: 100%; /* 确保不超出父容器 */
}

.code-content {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #2c3e50;
  padding: 16px;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word; /* 更好的换行策略 */
  overflow-wrap: break-word; /* 确保长单词换行 */
  max-width: 100%;
}

.config-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 确保配置预览不溢出 */
}

.config-content {
  flex: 1;
  overflow: auto;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  min-height: 0; /* 允许shrink */
  max-width: 100%; /* 确保不超出父容器 */
}

.config-text {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #2c3e50;
  padding: 16px;
  margin: 0;
  white-space: pre-wrap;
}

.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-top: 16px;
}

.batch-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.batch-buttons {
  display: flex;
  gap: 12px;
}

.usage-guide {
  margin-top: 16px;
}

.usage-content h4 {
  color: #409eff;
  margin: 16px 0 8px 0;
  font-size: 14px;
}

.usage-content ol,
.usage-content ul {
  margin: 8px 0 16px 16px;
  font-size: 14px;
  line-height: 1.6;
}

.usage-content code {
  background: #f1f3f4;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

:deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

:deep(.el-tab-pane) {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 16px;
}

/* 自定义滚动条样式 */
.code-container::-webkit-scrollbar,
.config-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-container::-webkit-scrollbar-track,
.config-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.code-container::-webkit-scrollbar-thumb,
.config-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.code-container::-webkit-scrollbar-thumb:hover,
.config-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 确保内容区域正确处理溢出 */
:deep(.el-card__body) {
  height: calc(100% - 60px); /* 减去header高度 */
  overflow: hidden;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
</style>
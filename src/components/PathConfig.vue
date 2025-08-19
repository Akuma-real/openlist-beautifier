<template>
  <div class="path-config">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <el-icon><FolderOpened /></el-icon>
          <span>路径配置</span>
        </div>
      </template>

      <el-form :model="paths" label-width="120px" label-position="left">
        <!-- 排除路径列表 -->
        <el-form-item label="排除路径">
          <div class="excluded-paths">
            <div
              v-for="(path, index) in paths.excluded"
              :key="index"
              class="path-item"
            >
              <el-input
                v-model="paths.excluded[index]"
                @change="handlePathChange"
                placeholder="/路径前缀"
                class="path-item-input"
              />
              <el-button
                @click="removePath(index)"
                type="danger"
                size="small"
                circle
                :icon="Delete"
              />
            </div>
            
            <el-button
              @click="addPath"
              type="primary"
              size="small"
              :icon="Plus"
              class="add-path-btn"
            >
              添加排除路径
            </el-button>
          </div>
          <div class="field-help">
            匹配这些路径前缀的页面将不会启用美化功能
          </div>
        </el-form-item>

        <!-- 常用路径快速添加 -->
        <el-form-item label="常用路径">
          <div class="common-paths">
            <el-tag
              v-for="commonPath in commonPaths"
              :key="commonPath.value"
              @click="addCommonPath(commonPath.value)"
              :title="commonPath.description"
              class="common-path-tag"
              effect="plain"
              size="small"
            >
              {{ commonPath.label }}
            </el-tag>
          </div>
          <div class="field-help">
            点击快速添加常用的排除路径
          </div>
        </el-form-item>

        <!-- 路径规则说明 */
        <el-form-item label="路径规则">
          <div class="path-rules">
            <div class="rule-item">
              <el-tag type="info" size="small">前缀匹配</el-tag>
              <span>所有以指定前缀开头的路径都会被排除</span>
            </div>
            <div class="rule-item">
              <el-tag type="warning" size="small">示例</el-tag>
              <span><code>/@manage</code> 会排除 <code>/@manage/files</code>, <code>/@manage/settings</code> 等</span>
            </div>
            <div class="rule-item">
              <el-tag type="success" size="small">建议</el-tag>
              <span>管理页面和登录页面通常需要排除美化</span>
            </div>
          </div>
        </el-form-item>

        <!-- 预设配置 -->
        <el-form-item label="预设配置">
          <div class="preset-buttons">
            <el-button
              v-for="preset in pathPresets"
              :key="preset.name"
              @click="applyPreset(preset)"
              size="small"
              type="primary"
              plain
            >
              {{ preset.name }}
            </el-button>
          </div>
        </el-form-item>

        <!-- 当前路径测试 -->
        <el-form-item label="路径测试">
          <div class="path-test">
            <el-input
              v-model="testPath"
              placeholder="输入路径进行测试，如：/@manage/files"
              class="test-input"
            />
            <div class="test-result">
              <span v-if="testPath">
                路径 <code>{{ testPath }}</code> 
                <el-tag
                  :type="isPathExcluded(testPath) ? 'danger' : 'success'"
                  size="small"
                >
                  {{ isPathExcluded(testPath) ? '会被排除' : '不会被排除' }}
                </el-tag>
              </span>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FolderOpened, Delete, Plus } from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

// 测试路径
const testPath = ref('')

// 计算属性：路径配置
const paths = computed({
  get: () => configStore.currentConfig.paths,
  set: (newPaths) => configStore.updatePaths(newPaths)
})

// 常用排除路径
const commonPaths = [
  { label: '管理页面', value: '/@manage', description: '后台管理界面' },
  { label: '登录页面', value: '/@login', description: '用户登录界面' },
  { label: 'API接口', value: '/api', description: 'API接口路径' },
  { label: '静态资源', value: '/static', description: '静态文件路径' },
  { label: '系统设置', value: '/@settings', description: '系统设置页面' },
  { label: '用户资料', value: '/@profile', description: '用户资料页面' },
  { label: '帮助页面', value: '/help', description: '帮助和文档页面' },
  { label: '关于页面', value: '/about', description: '关于页面' }
]

// 路径预设
const pathPresets = [
  {
    name: '基础配置',
    paths: {
      excluded: ['/@manage', '/@login']
    }
  },
  {
    name: '完整配置',
    paths: {
      excluded: [
        '/@manage',
        '/@login', 
        '/@settings',
        '/@profile',
        '/api',
        '/static'
      ]
    }
  },
  {
    name: '最小配置',
    paths: {
      excluded: ['/@manage']
    }
  },
  {
    name: '清空配置',
    paths: {
      excluded: []
    }
  }
]

// 处理路径变化
const handlePathChange = () => {
  // 路径变化会自动通过computed属性更新store
}

// 添加新路径
const addPath = () => {
  const currentExcluded = [...paths.value.excluded]
  currentExcluded.push('')
  configStore.updatePaths({ excluded: currentExcluded })
}

// 删除路径
const removePath = (index: number) => {
  const currentExcluded = [...paths.value.excluded]
  currentExcluded.splice(index, 1)
  configStore.updatePaths({ excluded: currentExcluded })
}

// 添加常用路径
const addCommonPath = (path: string) => {
  const currentExcluded = [...paths.value.excluded]
  if (!currentExcluded.includes(path)) {
    currentExcluded.push(path)
    configStore.updatePaths({ excluded: currentExcluded })
  }
}

// 应用预设
const applyPreset = (preset: typeof pathPresets[0]) => {
  configStore.updatePaths(preset.paths)
}

// 测试路径是否被排除
const isPathExcluded = (path: string) => {
  if (!path) return false
  return paths.value.excluded.some(excluded => path.startsWith(excluded))
}
</script>

<style scoped>
.path-config {
  height: 100%;
}

.config-card {
  height: 100%;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.field-help {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.excluded-paths {
  width: 100%;
}

.path-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.path-item-input {
  flex: 1;
}

.add-path-btn {
  margin-top: 8px;
}

.common-paths {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.common-path-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.common-path-tag:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.path-rules {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 16px;
  border: 1px solid #e9ecef;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
}

.rule-item:last-child {
  margin-bottom: 0;
}

.rule-item code {
  background: #f1f3f4;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
}

.preset-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.path-test {
  width: 100%;
}

.test-input {
  width: 100%;
  max-width: 400px;
  margin-bottom: 12px;
}

.test-result {
  font-size: 14px;
  color: #606266;
}

.test-result code {
  background: #f1f3f4;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}
</style>
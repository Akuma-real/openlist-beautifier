<template>
  <div class="module-selector">
    <el-card class="selector-card">
      <template #header>
        <div class="card-header">
          <el-icon><Grid /></el-icon>
          <span>美化模块选择</span>
        </div>
      </template>

      <div class="modules-grid">
        <div
          v-for="module in modules"
          :key="module.id"
          class="module-item"
          :class="{ 'module-enabled': module.enabled, 'module-selected': selectedModule === module.id }"
          @click="selectModule(module.id)"
        >
          <div class="module-header">
            <el-checkbox
              v-model="module.enabled"
              @change="toggleModule(module.id, $event)"
              @click.stop
              size="large"
            />
            
            <div class="module-info">
              <div class="module-name">{{ module.name }}</div>
              <div class="module-category">{{ module.category }}</div>
            </div>

            <el-icon 
              class="module-icon" 
              :class="{ 'icon-enabled': module.enabled }"
            >
              <component :is="getIconComponent(module.icon)" />
            </el-icon>
          </div>
          
          <div class="module-description">
            {{ module.description }}
          </div>

          <div v-if="module.enabled" class="module-status">
            <el-tag type="success" size="small">
              <el-icon><Check /></el-icon>
              已启用
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="modules-summary">
        <div class="summary-info">
          <span>{{ enabledCount }} 个模块已启用</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { 
  Grid, 
  Check,
  Picture
} from '@element-plus/icons-vue'
import { BeautificationModule } from '@/types/modules'
import { useModuleStore } from '@/stores/modules'

const moduleStore = useModuleStore()
const { modules, selectedModule } = toRefs(moduleStore)

// 计算属性
const enabledCount = computed(() => 
  modules.value.filter(module => module.enabled).length
)

// 图标组件映射
const iconComponents = {
  Picture
}

// 获取图标组件
const getIconComponent = (iconName: string) => {
  return iconComponents[iconName as keyof typeof iconComponents] || Picture
}

// 选择模块
const selectModule = (moduleId: string) => {
  moduleStore.selectModule(moduleId as BeautificationModule)
}

// 切换模块启用状态
const toggleModule = (moduleId: string, enabled: boolean) => {
  moduleStore.toggleModule(moduleId as BeautificationModule, enabled)
}
</script>

<style scoped>
.module-selector {
  height: 100%;
}

.selector-card {
  height: 100%;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.card-header .el-icon {
  margin-right: 8px;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.module-item {
  padding: 16px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
}

.module-item:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.module-item.module-enabled {
  border-color: #67c23a;
  background: #f0fff4;
}

.module-item.module-selected {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.25);
}

.module-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.module-info {
  flex: 1;
}

.module-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.module-category {
  font-size: 12px;
  color: #909399;
}

.module-icon {
  font-size: 24px;
  color: #c0c4cc;
  transition: color 0.3s ease;
}

.module-icon.icon-enabled {
  color: #67c23a;
}

.module-description {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
  margin: 8px 0;
}

.module-status {
  margin-top: 12px;
}

.modules-summary {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #e4e7ed;
}

.summary-info {
  font-size: 14px;
  color: #606266;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .module-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
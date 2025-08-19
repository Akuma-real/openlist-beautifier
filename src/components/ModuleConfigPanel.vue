<template>
  <div class="module-config" v-if="currentModule">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <el-icon><component :is="getIconComponent(currentModule.icon)" /></el-icon>
          <span>{{ currentModule.name }} 配置</span>
          <div class="header-actions">
            <el-switch
              :model-value="currentModule.enabled"
              @change="toggleModule"
              active-text="启用"
              inactive-text="禁用"
            />
          </div>
        </div>
      </template>

      <div class="config-content" v-if="currentModule.enabled">
        <!-- 背景图片配置 -->
        <BackgroundImageModuleConfig
          v-if="currentModule.id === 'backgroundImage'"
          :config="currentModuleConfig"
          @update="updateConfig"
        />
      </div>

      <div v-else class="disabled-notice">
        <el-empty
          :image-size="80"
          description="模块已禁用，开启后可进行配置"
        >
          <el-button @click="enableModule" type="primary">
            启用 {{ currentModule.name }}
          </el-button>
        </el-empty>
      </div>
    </el-card>
  </div>

  <div v-else class="no-selection">
    <el-empty
      :image-size="100"
      description="请在左侧选择一个模块进行配置"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import { useModuleStore } from '@/stores/modules'

// 导入背景图片配置组件
import BackgroundImageModuleConfig from './modules/BackgroundImageModuleConfig.vue'

const moduleStore = useModuleStore()

// 计算属性
const currentModule = computed(() => moduleStore.currentModule)
const currentModuleConfig = computed(() => moduleStore.currentModuleConfig)

// 图标组件映射
const iconComponents = {
  Picture
}

// 获取图标组件
const getIconComponent = (iconName: string) => {
  return iconComponents[iconName as keyof typeof iconComponents] || Picture
}

// 切换模块启用状态
const toggleModule = (enabled: boolean) => {
  if (currentModule.value) {
    moduleStore.toggleModule(currentModule.value.id, enabled)
  }
}

// 启用模块
const enableModule = () => {
  toggleModule(true)
}

// 更新配置
const updateConfig = (newConfig: any) => {
  if (currentModule.value) {
    moduleStore.updateModuleConfig(currentModule.value.id, newConfig)
  }
}
</script>

<style scoped>
.module-config {
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
  justify-content: space-between;
  font-weight: 600;
  font-size: 16px;
}

.card-header .el-icon {
  margin-right: 8px;
}

.config-content {
  height: calc(100% - 60px);
  overflow-y: auto;
}

.disabled-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.no-selection {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-empty) {
  padding: 40px 20px;
}
</style>
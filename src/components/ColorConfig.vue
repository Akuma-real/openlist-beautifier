<template>
  <div class="color-config">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <el-icon><Picture /></el-icon>
          <span>主题颜色配置</span>
        </div>
      </template>

      <el-form :model="colors" label-width="120px" label-position="left">
        <!-- 浅色主题颜色 -->
        <el-form-item label="浅色主题">
          <div class="color-item">
            <el-color-picker
              v-model="colors.light"
              @change="handleColorChange"
              size="large"
              show-alpha
              :predefine="lightPresets"
            />
            <el-input
              v-model="colors.light"
              @change="handleColorChange"
              placeholder="rgba(255, 255, 255, 0.8)"
              class="color-input"
            />
          </div>
          <div class="color-preview light" :style="{ backgroundColor: colors.light }">
            <span>预览效果</span>
          </div>
        </el-form-item>

        <!-- 深色主题颜色 -->
        <el-form-item label="深色主题">
          <div class="color-item">
            <el-color-picker
              v-model="colors.dark"
              @change="handleColorChange"
              size="large"
              show-alpha
              :predefine="darkPresets"
            />
            <el-input
              v-model="colors.dark"
              @change="handleColorChange"
              placeholder="rgb(32, 36, 37)"
              class="color-input"
            />
          </div>
          <div class="color-preview dark" :style="{ backgroundColor: colors.dark }">
            <span>预览效果</span>
          </div>
        </el-form-item>

        <!-- 特定前缀 -->
        <el-form-item label="忽略前缀">
          <el-input
            v-model="colors.specificPrefix"
            @change="handleColorChange"
            placeholder="rgba(132, 133, 141"
            class="prefix-input"
          />
          <div class="field-help">
            包含此前缀的颜色将不会被替换
          </div>
        </el-form-item>

        <!-- 快速预设 -->
        <el-form-item label="快速预设">
          <div class="preset-buttons">
            <el-button
              v-for="preset in colorPresets"
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
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

// 计算属性：颜色配置
const colors = computed({
  get: () => configStore.currentConfig.colors,
  set: (newColors) => configStore.updateColors(newColors)
})

// 浅色主题预设颜色
const lightPresets = [
  'rgba(255, 255, 255, 0.8)',
  'rgba(255, 255, 255, 0.9)',
  'rgba(255, 255, 255, 0.6)',
  'rgba(248, 250, 252, 0.8)',
  'rgba(241, 245, 249, 0.8)'
]

// 深色主题预设颜色
const darkPresets = [
  'rgb(32, 36, 37)',
  'rgb(20, 24, 25)',
  'rgb(24, 28, 30)',
  'rgba(32, 36, 37, 0.9)',
  'rgba(15, 15, 15, 0.95)'
]

// 颜色主题预设
const colorPresets = [
  {
    name: '默认',
    colors: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgb(32, 36, 37)',
      specificPrefix: 'rgba(132, 133, 141'
    }
  },
  {
    name: '高对比',
    colors: {
      light: 'rgba(255, 255, 255, 0.95)',
      dark: 'rgb(20, 24, 25)',
      specificPrefix: 'rgba(132, 133, 141'
    }
  },
  {
    name: '透明',
    colors: {
      light: 'rgba(255, 255, 255, 0.6)',
      dark: 'rgba(32, 36, 37, 0.8)',
      specificPrefix: 'rgba(132, 133, 141'
    }
  }
]

// 处理颜色变化
const handleColorChange = () => {
  // 颜色变化会自动通过computed属性更新store
}

// 应用预设
const applyPreset = (preset: typeof colorPresets[0]) => {
  configStore.updateColors(preset.colors)
}
</script>

<style scoped>
.color-config {
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

.color-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.color-input {
  flex: 1;
  max-width: 200px;
}

.color-preview {
  width: 100%;
  height: 40px;
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #606266;
  margin-top: 8px;
  transition: all 0.3s ease;
}

.color-preview.light {
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.color-preview.dark span {
  color: #fff;
}

.prefix-input {
  width: 100%;
  max-width: 300px;
}

.field-help {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.preset-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}
</style>
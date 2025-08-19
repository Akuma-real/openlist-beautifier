<template>
  <div class="background-image-module-config">
    <el-form :model="config" label-width="120px" label-position="left">
      <!-- 浅色主题图片 -->
      <el-form-item label="浅色主题图片">
        <el-input
          :model-value="config.lightImage"
          @input="updateConfig('lightImage', $event)"
          placeholder="https://example.com/light-bg.jpg"
        />
        <div class="field-help">
          浅色主题使用的背景图片URL
        </div>
      </el-form-item>

      <!-- 深色主题图片 -->
      <el-form-item label="深色主题图片">
        <el-input
          :model-value="config.darkImage"
          @input="updateConfig('darkImage', $event)"
          placeholder="https://example.com/dark-bg.jpg"
        />
        <div class="field-help">
          深色主题使用的背景图片URL
        </div>
      </el-form-item>

      <!-- 预览区域 -->
      <el-form-item label="预览">
        <div class="preview-container">
          <div class="image-preview light" v-if="config.lightImage">
            <img :src="config.lightImage" alt="浅色主题背景预览" @error="handleImageError" />
            <div class="preview-overlay">
              <span>浅色主题</span>
            </div>
          </div>
          
          <div class="image-preview dark" v-if="config.darkImage">
            <img :src="config.darkImage" alt="深色主题背景预览" @error="handleImageError" />
            <div class="preview-overlay">
              <span>深色主题</span>
            </div>
          </div>
          
          <div v-if="!config.lightImage && !config.darkImage" class="no-preview">
            <el-empty :image-size="80" description="暂无预览图片" />
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { BackgroundImageConfig } from '@/types/modules'

interface Props {
  config: BackgroundImageConfig
}

interface Emits {
  (e: 'update', config: Partial<BackgroundImageConfig>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 更新配置
const updateConfig = (key: keyof BackgroundImageConfig, value: any) => {
  emit('update', { [key]: value })
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.opacity = '0.5'
  img.style.border = '2px solid #f56c6c'
}
</script>

<style scoped>
.background-image-module-config {
  padding: 16px 0;
}

.field-help {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.preview-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.image-preview {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 2px dashed #dcdfe6;
  background: #f5f7fa;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.image-preview.dark {
  background: #2d2d2d;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .preview-overlay {
  opacity: 1;
}

.no-preview {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  background: #f5f7fa;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .preview-container {
    grid-template-columns: 1fr;
  }
}
</style>
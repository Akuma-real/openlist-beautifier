<template>
  <div class="performance-config">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <el-icon><Setting /></el-icon>
          <span>性能配置</span>
        </div>
      </template>

      <el-form :model="observer" label-width="120px" label-position="left">
        <!-- 观察器配置 -->
        <el-form-item label="子元素监听">
          <el-switch
            v-model="observer.childList"
            @change="handleObserverChange"
            active-text="开启"
            inactive-text="关闭"
          />
          <div class="field-help">
            监听DOM子元素的添加和删除
          </div>
        </el-form-item>

        <el-form-item label="子树监听">
          <el-switch
            v-model="observer.subtree"
            @change="handleObserverChange"
            active-text="开启"
            inactive-text="关闭"
          />
          <div class="field-help">
            监听整个DOM子树的变化（推荐开启）
          </div>
        </el-form-item>

        <!-- 节流延迟配置 -->
        <el-form-item label="节流延迟">
          <div class="throttle-config">
            <el-slider
              v-model="observer.throttleDelay"
              @change="handleObserverChange"
              :min="0"
              :max="1000"
              :step="1"
              :marks="throttleMarks"
              class="throttle-slider"
            />
            <div class="throttle-value">
              <el-input-number
                v-model="observer.throttleDelay"
                @change="handleObserverChange"
                :min="0"
                :max="1000"
                :step="1"
                size="small"
                controls-position="right"
              />
              <span class="unit">毫秒</span>
            </div>
          </div>
          <div class="field-help">
            美化操作的节流延迟时间，值越小响应越快但性能消耗越大
          </div>
        </el-form-item>

        <!-- 性能等级快速设置 -->
        <el-form-item label="性能等级">
          <div class="performance-levels">
            <el-radio-group
              v-model="currentPerformanceLevel"
              @change="applyPerformanceLevel"
              class="performance-radio-group"
            >
              <el-radio-button
                v-for="level in performanceLevels"
                :key="level.name"
                :label="level.name"
                class="performance-radio"
              >
                <div class="level-content">
                  <div class="level-name">{{ level.name }}</div>
                  <div class="level-desc">{{ level.description }}</div>
                </div>
              </el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>

        <!-- 调试模式 -->
        <el-form-item label="调试模式">
          <el-switch
            v-model="debug"
            @change="handleDebugChange"
            active-text="开启"
            inactive-text="关闭"
          />
          <div class="field-help">
            开启后会在浏览器控制台输出详细的调试信息
          </div>
        </el-form-item>

        <!-- 性能指标说明 -->
        <el-form-item label="性能说明">
          <div class="performance-info">
            <div class="info-item">
              <el-tag type="success" size="small">高性能</el-tag>
              <span>节流延迟 0-50ms，适合高性能设备</span>
            </div>
            <div class="info-item">
              <el-tag type="warning" size="small">平衡</el-tag>
              <span>节流延迟 50-200ms，适合大多数设备</span>
            </div>
            <div class="info-item">
              <el-tag type="danger" size="small">节能</el-tag>
              <span>节流延迟 200ms+，适合低性能设备</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

// 当前性能等级
const currentPerformanceLevel = ref('平衡')

// 计算属性：观察器配置
const observer = computed({
  get: () => configStore.currentConfig.observer,
  set: (newObserver) => configStore.updateObserver(newObserver)
})

// 计算属性：调试模式
const debug = computed({
  get: () => configStore.currentConfig.debug,
  set: (newDebug) => configStore.updateConfig({ debug: newDebug })
})

// 节流延迟标记
const throttleMarks = {
  0: '0ms',
  16: '60fps',
  33: '30fps',
  100: '10fps',
  500: '2fps',
  1000: '1fps'
}

// 性能等级配置
const performanceLevels = [
  {
    name: '极速',
    description: '最快响应，高性能设备',
    config: {
      childList: true,
      subtree: true,
      throttleDelay: 0
    }
  },
  {
    name: '高性能',
    description: '快速响应，现代设备',
    config: {
      childList: true,
      subtree: true,
      throttleDelay: 16
    }
  },
  {
    name: '平衡',
    description: '平衡性能，推荐设置',
    config: {
      childList: true,
      subtree: true,
      throttleDelay: 50
    }
  },
  {
    name: '节能',
    description: '降低消耗，低性能设备',
    config: {
      childList: true,
      subtree: true,
      throttleDelay: 200
    }
  },
  {
    name: '最低',
    description: '最低消耗，旧设备',
    config: {
      childList: true,
      subtree: false,
      throttleDelay: 500
    }
  }
]

// 处理观察器配置变化
const handleObserverChange = () => {
  updateCurrentPerformanceLevel()
}

// 处理调试模式变化
const handleDebugChange = () => {
  // 调试模式变化会自动通过computed属性更新store
}

// 应用性能等级
const applyPerformanceLevel = (levelName: string) => {
  const level = performanceLevels.find(l => l.name === levelName)
  if (level) {
    configStore.updateObserver(level.config)
    currentPerformanceLevel.value = levelName
  }
}

// 更新当前性能等级显示
const updateCurrentPerformanceLevel = () => {
  const current = observer.value
  const matchedLevel = performanceLevels.find(level => 
    level.config.childList === current.childList &&
    level.config.subtree === current.subtree &&
    level.config.throttleDelay === current.throttleDelay
  )
  
  if (matchedLevel) {
    currentPerformanceLevel.value = matchedLevel.name
  } else {
    currentPerformanceLevel.value = '自定义'
  }
}

// 初始化时更新性能等级显示
updateCurrentPerformanceLevel()
</script>

<style scoped>
.performance-config {
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

.throttle-config {
  width: 100%;
  margin-bottom: 8px;
}

.throttle-slider {
  margin-bottom: 16px;
}

.throttle-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unit {
  font-size: 14px;
  color: #606266;
}

.performance-levels {
  width: 100%;
}

.performance-radio-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.performance-radio {
  width: 100% !important;
  height: auto !important;
  padding: 0 !important;
}

:deep(.performance-radio .el-radio-button__inner) {
  width: 100%;
  height: auto;
  padding: 12px 16px;
  text-align: left;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  background: #fff;
  transition: all 0.3s ease;
}

:deep(.performance-radio.is-active .el-radio-button__inner) {
  background: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.level-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.level-name {
  font-weight: 600;
  font-size: 14px;
}

.level-desc {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
}

.performance-info {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 16px;
  border: 1px solid #e9ecef;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-item:last-child {
  margin-bottom: 0;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}

:deep(.el-slider__marks-text) {
  font-size: 12px;
}
</style>
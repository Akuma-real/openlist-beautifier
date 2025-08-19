<template>
  <div class="selector-config">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <el-icon><Tools /></el-icon>
          <span>选择器配置</span>
        </div>
      </template>

      <el-form :model="selectors" label-width="120px" label-position="left">
        <!-- 主题选择器 -->
        <el-form-item label="浅色主题">
          <el-input
            v-model="selectors.lightTheme"
            @change="handleSelectorChange"
            placeholder=".hope-ui-light"
            class="selector-input"
          />
          <div class="field-help">
            浅色主题的根CSS选择器
          </div>
        </el-form-item>

        <el-form-item label="深色主题">
          <el-input
            v-model="selectors.darkTheme"
            @change="handleSelectorChange"
            placeholder=".hope-ui-dark"
            class="selector-input"
          />
          <div class="field-help">
            深色主题的根CSS选择器
          </div>
        </el-form-item>

        <el-form-item label="根元素">
          <el-input
            v-model="selectors.rootElement"
            @change="handleSelectorChange"
            placeholder="#root"
            class="selector-input"
          />
          <div class="field-help">
            MutationObserver观察的根元素选择器
          </div>
        </el-form-item>

        <!-- 忽略选择器列表 -->
        <el-form-item label="忽略列表">
          <div class="ignored-selectors">
            <div
              v-for="(selector, index) in selectors.ignored"
              :key="index"
              class="selector-item"
            >
              <el-input
                v-model="selectors.ignored[index]"
                @change="handleSelectorChange"
                placeholder="CSS选择器"
                class="selector-item-input"
              />
              <el-button
                @click="removeSelector(index)"
                type="danger"
                size="small"
                circle
                :icon="Delete"
              />
            </div>
            
            <el-button
              @click="addSelector"
              type="primary"
              size="small"
              :icon="Plus"
              class="add-selector-btn"
            >
              添加选择器
            </el-button>
          </div>
          <div class="field-help">
            这些CSS选择器匹配的元素将不会被美化
          </div>
        </el-form-item>

        <!-- 常用选择器快速添加 -->
        <el-form-item label="常用选择器">
          <div class="common-selectors">
            <el-tag
              v-for="commonSelector in commonSelectors"
              :key="commonSelector.value"
              @click="addCommonSelector(commonSelector.value)"
              :title="commonSelector.description"
              class="common-selector-tag"
              effect="plain"
              size="small"
            >
              {{ commonSelector.label }}
            </el-tag>
          </div>
          <div class="field-help">
            点击快速添加常用的忽略选择器
          </div>
        </el-form-item>

        <!-- 预设配置 -->
        <el-form-item label="预设配置">
          <div class="preset-buttons">
            <el-button
              v-for="preset in selectorPresets"
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
import { Tools, Delete, Plus } from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

// 计算属性：选择器配置
const selectors = computed({
  get: () => configStore.currentConfig.selectors,
  set: (newSelectors) => configStore.updateSelectors(newSelectors)
})

// 常用选择器列表
const commonSelectors = [
  { label: '按钮', value: 'button', description: '所有按钮元素' },
  { label: '工具提示', value: '.hope-tooltip', description: '工具提示框' },
  { label: '模态框', value: '.hope-modal__overlay', description: '模态框遮罩层' },
  { label: '复选框', value: '.hope-checkbox__control', description: '复选框控件' },
  { label: 'SVG图标', value: 'svg', description: 'SVG图标元素' },
  { label: '下拉菜单', value: '.hope-dropdown', description: '下拉菜单' },
  { label: '表单控件', value: 'input, textarea, select', description: '表单输入控件' },
  { label: '导航栏', value: 'nav, .navbar', description: '导航栏元素' }
]

// 选择器预设
const selectorPresets = [
  {
    name: '默认Hope UI',
    selectors: {
      lightTheme: '.hope-ui-light',
      darkTheme: '.hope-ui-dark',
      rootElement: '#root',
      ignored: [
        '.hope-tooltip',
        '.hope-tooltip__arrow',
        '.hope-checkbox__control',
        '.hope-modal__overlay',
        'button:not(.hope-menu__trigger)',
        'svg'
      ]
    }
  },
  {
    name: '兼容模式',
    selectors: {
      lightTheme: '.light-theme, .hope-ui-light',
      darkTheme: '.dark-theme, .hope-ui-dark',
      rootElement: '#root, #app',
      ignored: [
        'button',
        'input',
        'textarea',
        'select',
        'svg',
        '.tooltip',
        '.modal',
        '.dropdown'
      ]
    }
  },
  {
    name: '简化配置',
    selectors: {
      lightTheme: '.hope-ui-light',
      darkTheme: '.hope-ui-dark',
      rootElement: '#root',
      ignored: ['button', 'svg']
    }
  }
]

// 处理选择器变化
const handleSelectorChange = () => {
  // 选择器变化会自动通过computed属性更新store
}

// 添加新选择器
const addSelector = () => {
  const currentIgnored = [...selectors.value.ignored]
  currentIgnored.push('')
  configStore.updateSelectors({ ignored: currentIgnored })
}

// 删除选择器
const removeSelector = (index: number) => {
  const currentIgnored = [...selectors.value.ignored]
  currentIgnored.splice(index, 1)
  configStore.updateSelectors({ ignored: currentIgnored })
}

// 添加常用选择器
const addCommonSelector = (selector: string) => {
  const currentIgnored = [...selectors.value.ignored]
  if (!currentIgnored.includes(selector)) {
    currentIgnored.push(selector)
    configStore.updateSelectors({ ignored: currentIgnored })
  }
}

// 应用预设
const applyPreset = (preset: typeof selectorPresets[0]) => {
  configStore.updateSelectors(preset.selectors)
}
</script>

<style scoped>
.selector-config {
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

.selector-input {
  width: 100%;
  max-width: 300px;
}

.field-help {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.ignored-selectors {
  width: 100%;
}

.selector-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.selector-item-input {
  flex: 1;
}

.add-selector-btn {
  margin-top: 8px;
}

.common-selectors {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.common-selector-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.common-selector-tag:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
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
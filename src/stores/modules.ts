import { defineStore } from 'pinia'
import { BeautificationModule } from '@/types/modules'
import type { 
  ModuleInfo, 
  BeautificationConfig 
} from '@/types/modules'
import { MODULE_DEFINITIONS, DEFAULT_MODULE_CONFIG } from '@/utils/moduleDefaults'

/**
 * 模块管理状态存储
 */
export const useModuleStore = defineStore('modules', {
  state: () => ({
    // 模块列表
    modules: [...MODULE_DEFINITIONS] as ModuleInfo[],
    
    // 当前选中的模块
    selectedModule: BeautificationModule.BACKGROUND_IMAGE as BeautificationModule | null,
    
    // 完整配置
    config: { ...DEFAULT_MODULE_CONFIG } as BeautificationConfig,
    
    // 生成状态
    isGenerating: false,
    
    // 配置历史（用于撤销/重做）
    configHistory: [{ ...DEFAULT_MODULE_CONFIG }] as BeautificationConfig[],
    historyIndex: 0
  }),

  getters: {
    /**
     * 获取启用的模块列表
     */
    enabledModules(): ModuleInfo[] {
      return this.modules.filter(module => module.enabled)
    },

    /**
     * 获取启用的模块数量
     */
    enabledCount(): number {
      return this.enabledModules.length
    },

    /**
     * 获取当前选中模块的信息
     */
    currentModule(): ModuleInfo | null {
      if (!this.selectedModule) return null
      return this.modules.find(module => module.id === this.selectedModule) || null
    },

    /**
     * 获取当前选中模块的配置
     */
    currentModuleConfig(): any {
      if (!this.selectedModule) return null
      return this.config.modules[this.selectedModule]
    },

    /**
     * 检查配置是否有效
     */
    isConfigValid(): boolean {
      // 至少需要启用一个模块
      if (this.enabledCount === 0) return false
      
      // 检查每个启用模块的配置是否有效
      return this.enabledModules.every(module => {
        const config = this.config.modules[module.id]
        return config && config.enabled
      })
    },

    /**
     * 获取配置JSON
     */
    configJSON(): string {
      return JSON.stringify(this.config, null, 2)
    },

    /**
     * 检查是否可以撤销
     */
    canUndo(): boolean {
      return this.historyIndex > 0
    },

    /**
     * 检查是否可以重做
     */
    canRedo(): boolean {
      return this.historyIndex < this.configHistory.length - 1
    }
  },

  actions: {
    /**
     * 选择模块
     */
    selectModule(moduleId: BeautificationModule) {
      this.selectedModule = moduleId
    },

    /**
     * 切换模块启用状态
     */
    toggleModule(moduleId: BeautificationModule, enabled: boolean) {
      // 更新模块列表中的状态
      const module = this.modules.find(m => m.id === moduleId)
      if (module) {
        module.enabled = enabled
      }

      // 更新配置中的状态
      if (this.config.modules[moduleId]) {
        this.config.modules[moduleId].enabled = enabled
      }

      // 如果禁用了当前选中的模块，自动选择下一个启用的模块
      if (!enabled && this.selectedModule === moduleId) {
        const nextEnabled = this.modules.find(m => m.enabled && m.id !== moduleId)
        this.selectedModule = nextEnabled?.id || null
      }

      this.addToHistory()
      this.saveToLocalStorage()
    },

    /**
     * 启用所有模块
     */
    enableAllModules() {
      this.modules.forEach(module => {
        module.enabled = true
        if (this.config.modules[module.id]) {
          this.config.modules[module.id].enabled = true
        }
      })
      this.addToHistory()
      this.saveToLocalStorage()
    },

    /**
     * 禁用所有模块
     */
    disableAllModules() {
      this.modules.forEach(module => {
        module.enabled = false
        if (this.config.modules[module.id]) {
          this.config.modules[module.id].enabled = false
        }
      })
      this.selectedModule = null
      this.addToHistory()
      this.saveToLocalStorage()
    },

    /**
     * 更新模块配置
     */
    updateModuleConfig(moduleId: BeautificationModule, newConfig: any) {
      if (this.config.modules[moduleId]) {
        this.config.modules[moduleId] = { 
          ...this.config.modules[moduleId], 
          ...newConfig 
        }
        this.addToHistory()
        this.saveToLocalStorage()
      }
    },


    /**
     * 重置为默认配置
     */
    resetToDefault() {
      this.config = { ...DEFAULT_MODULE_CONFIG }
      this.modules = [...MODULE_DEFINITIONS]
      this.selectedModule = BeautificationModule.BACKGROUND_IMAGE
      this.addToHistory()
      this.saveToLocalStorage()
    },

    /**
     * 导入配置
     */
    importConfig(configJSON: string): boolean {
      try {
        const importedConfig = JSON.parse(configJSON) as BeautificationConfig
        
        // 验证配置格式
        if (this.validateConfig(importedConfig)) {
          this.config = importedConfig
          
          // 同步模块启用状态
          this.modules.forEach(module => {
            const moduleConfig = this.config.modules[module.id]
            if (moduleConfig) {
              module.enabled = moduleConfig.enabled
            }
          })

          // 选择第一个启用的模块
          const firstEnabled = this.modules.find(m => m.enabled)
          this.selectedModule = firstEnabled?.id || null

          this.addToHistory()
          this.saveToLocalStorage()
          return true
        }
        return false
      } catch {
        return false
      }
    },

    /**
     * 导出配置
     */
    exportConfig(): string {
      return this.configJSON
    },

    /**
     * 撤销操作
     */
    undo() {
      if (this.canUndo) {
        this.historyIndex--
        this.config = { ...this.configHistory[this.historyIndex] }
        this.syncModulesFromConfig()
        this.saveToLocalStorage()
      }
    },

    /**
     * 重做操作
     */
    redo() {
      if (this.canRedo) {
        this.historyIndex++
        this.config = { ...this.configHistory[this.historyIndex] }
        this.syncModulesFromConfig()
        this.saveToLocalStorage()
      }
    },

    /**
     * 设置生成状态
     */
    setGenerating(isGenerating: boolean) {
      this.isGenerating = isGenerating
    },

    /**
     * 从本地存储加载配置
     */
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('openlist-beautifier-modules-config')
        if (saved) {
          const config = JSON.parse(saved) as BeautificationConfig
          if (this.validateConfig(config)) {
            this.config = config
            this.syncModulesFromConfig()
          }
        }
      } catch {
        // 加载失败时使用默认配置
        this.resetToDefault()
      }
    },

    /**
     * 保存配置到本地存储
     */
    saveToLocalStorage() {
      try {
        localStorage.setItem('openlist-beautifier-modules-config', JSON.stringify(this.config))
      } catch {
        // 忽略存储失败
      }
    },

    /**
     * 添加到历史记录
     */
    addToHistory() {
      // 移除当前位置之后的历史记录
      this.configHistory = this.configHistory.slice(0, this.historyIndex + 1)
      
      // 添加新配置
      this.configHistory.push({ ...this.config })
      this.historyIndex = this.configHistory.length - 1
      
      // 限制历史记录数量
      if (this.configHistory.length > 50) {
        this.configHistory = this.configHistory.slice(-50)
        this.historyIndex = this.configHistory.length - 1
      }
    },

    /**
     * 从配置同步模块状态
     */
    syncModulesFromConfig() {
      this.modules.forEach(module => {
        const moduleConfig = this.config.modules[module.id]
        if (moduleConfig) {
          module.enabled = moduleConfig.enabled
        }
      })

      // 确保选中的模块仍然有效
      if (this.selectedModule) {
        const selectedModuleInfo = this.modules.find(m => m.id === this.selectedModule)
        if (!selectedModuleInfo?.enabled) {
          const firstEnabled = this.modules.find(m => m.enabled)
          this.selectedModule = firstEnabled?.id || null
        }
      }
    },

    /**
     * 验证配置格式
     */
    validateConfig(config: any): config is BeautificationConfig {
      return !!(
        config &&
        config.modules &&
        config.global &&
        typeof config.modules === 'object' &&
        typeof config.global === 'object'
      )
    }
  }
})
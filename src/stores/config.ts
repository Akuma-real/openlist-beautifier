import { defineStore } from 'pinia'
import type { BeautifierConfig, GeneratedFiles, ConfigPreset } from '@/types/config'
import { DEFAULT_CONFIG, CONFIG_PRESETS } from '@/utils/defaults'

/**
 * 配置管理状态存储
 */
export const useConfigStore = defineStore('config', {
  state: () => ({
    // 当前配置
    currentConfig: { ...DEFAULT_CONFIG } as BeautifierConfig,
    
    // 生成的文件内容
    generatedFiles: {
      headContent: '',
      bodyContent: ''
    } as GeneratedFiles,
    
    // 配置预设列表
    presets: [...CONFIG_PRESETS] as ConfigPreset[],
    
    // 是否正在生成文件
    isGenerating: false,
    
    // 配置历史记录（用于撤销/重做）
    configHistory: [{ ...DEFAULT_CONFIG }] as BeautifierConfig[],
    historyIndex: 0
  }),

  getters: {
    /**
     * 检查配置是否有效
     */
    isConfigValid(): boolean {
      const { colors, selectors } = this.currentConfig
      return !!(
        colors.light &&
        colors.dark &&
        selectors.lightTheme &&
        selectors.darkTheme &&
        selectors.rootElement
      )
    },

    /**
     * 获取当前配置的JSON字符串
     */
    configJSON(): string {
      return JSON.stringify(this.currentConfig, null, 2)
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
     * 更新配置
     */
    updateConfig(newConfig: Partial<BeautifierConfig>) {
      // 深度合并配置
      this.currentConfig = this.mergeConfig(this.currentConfig, newConfig)
      
      // 添加到历史记录
      this.addToHistory()
      
      // 保存到本地存储
      this.saveToLocalStorage()
    },

    /**
     * 更新颜色配置
     */
    updateColors(colors: Partial<typeof this.currentConfig.colors>) {
      this.currentConfig.colors = { ...this.currentConfig.colors, ...colors }
      this.addToHistory()
      this.saveToLocalStorage()
    },

    /**
     * 更新选择器配置
     */
    updateSelectors(selectors: Partial<typeof this.currentConfig.selectors>) {
      this.currentConfig.selectors = { ...this.currentConfig.selectors, ...selectors }
      this.addToHistory()
      this.saveToLocalStorage()
    },

    /**
     * 更新路径配置
     */
    updatePaths(paths: Partial<typeof this.currentConfig.paths>) {
      this.currentConfig.paths = { ...this.currentConfig.paths, ...paths }
      this.addToHistory()
      this.saveToLocalStorage()
    },

    /**
     * 更新观察器配置
     */
    updateObserver(observer: Partial<typeof this.currentConfig.observer>) {
      this.currentConfig.observer = { ...this.currentConfig.observer, ...observer }
      this.addToHistory()
      this.saveToLocalStorage()
    },

    /**
     * 重置为默认配置
     */
    resetToDefault() {
      this.currentConfig = { ...DEFAULT_CONFIG }
      this.addToHistory()
      this.saveToLocalStorage()
    },

    /**
     * 应用预设配置
     */
    applyPreset(presetName: string) {
      const preset = this.presets.find(p => p.name === presetName)
      if (preset) {
        this.currentConfig = { ...preset.config }
        this.addToHistory()
        this.saveToLocalStorage()
      }
    },

    /**
     * 导入配置
     */
    importConfig(configJSON: string): boolean {
      try {
        const config = JSON.parse(configJSON) as BeautifierConfig
        
        // 验证配置格式
        if (this.validateConfig(config)) {
          this.currentConfig = config
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
        this.currentConfig = { ...this.configHistory[this.historyIndex] }
        this.saveToLocalStorage()
      }
    },

    /**
     * 重做操作
     */
    redo() {
      if (this.canRedo) {
        this.historyIndex++
        this.currentConfig = { ...this.configHistory[this.historyIndex] }
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
     * 更新生成的文件内容
     */
    updateGeneratedFiles(files: GeneratedFiles) {
      this.generatedFiles = files
    },

    /**
     * 从本地存储加载配置
     */
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('openlist-beautifier-config')
        if (saved) {
          const config = JSON.parse(saved) as BeautifierConfig
          if (this.validateConfig(config)) {
            this.currentConfig = config
          }
        }
      } catch {
        // 加载失败时使用默认配置
        this.currentConfig = { ...DEFAULT_CONFIG }
      }
    },

    /**
     * 保存配置到本地存储
     */
    saveToLocalStorage() {
      try {
        localStorage.setItem('openlist-beautifier-config', JSON.stringify(this.currentConfig))
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
      this.configHistory.push({ ...this.currentConfig })
      this.historyIndex = this.configHistory.length - 1
      
      // 限制历史记录数量
      if (this.configHistory.length > 50) {
        this.configHistory = this.configHistory.slice(-50)
        this.historyIndex = this.configHistory.length - 1
      }
    },

    /**
     * 深度合并配置对象
     */
    mergeConfig(target: BeautifierConfig, source: Partial<BeautifierConfig>): BeautifierConfig {
      const result = { ...target }
      
      for (const key in source) {
        const sourceValue = source[key as keyof BeautifierConfig]
        if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
          // 递归合并对象
          result[key as keyof BeautifierConfig] = { 
            ...(result[key as keyof BeautifierConfig] as Record<string, any>), 
            ...(sourceValue as Record<string, any>)
          } as any
        } else if (sourceValue !== undefined) {
          // 直接覆盖基本类型和数组
          result[key as keyof BeautifierConfig] = sourceValue as any
        }
      }
      
      return result
    },

    /**
     * 验证配置格式
     */
    validateConfig(config: any): config is BeautifierConfig {
      return !!(
        config &&
        config.colors &&
        config.selectors &&
        config.paths &&
        config.observer &&
        typeof config.colors.light === 'string' &&
        typeof config.colors.dark === 'string' &&
        typeof config.selectors.lightTheme === 'string' &&
        typeof config.selectors.darkTheme === 'string' &&
        Array.isArray(config.selectors.ignored) &&
        Array.isArray(config.paths.excluded) &&
        typeof config.observer.throttleDelay === 'number'
      )
    }
  }
})
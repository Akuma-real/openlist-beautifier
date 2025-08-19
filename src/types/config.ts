/**
 * OpenList美化器配置类型定义
 * 基于现有beautifier.js和config.js的配置结构
 */

// 主题颜色配置
export interface ThemeColors {
  /** 浅色主题背景色 */
  light: string
  /** 深色主题背景色 */
  dark: string
  /** 特定颜色前缀，用于识别不需要替换的颜色 */
  specificPrefix: string
}

// 选择器配置
export interface SelectorConfig {
  /** 浅色主题根选择器 */
  lightTheme: string
  /** 深色主题根选择器 */
  darkTheme: string
  /** 忽略的选择器列表 */
  ignored: string[]
  /** 观察的根元素选择器 */
  rootElement: string
}

// 路径配置
export interface PathConfig {
  /** 排除美化的路径前缀列表 */
  excluded: string[]
}

// 观察器配置
export interface ObserverConfig {
  /** 是否观察子元素变化 */
  childList: boolean
  /** 是否观察整个子树 */
  subtree: boolean
  /** 节流延迟时间（毫秒） */
  throttleDelay: number
}

// 完整的美化器配置
export interface BeautifierConfig {
  /** 主题颜色配置 */
  colors: ThemeColors
  /** 选择器配置 */
  selectors: SelectorConfig
  /** 路径配置 */
  paths: PathConfig
  /** 观察器配置 */
  observer: ObserverConfig
  /** 是否启用调试模式 */
  debug: boolean
}

// 生成文件的配置
export interface GeneratedFiles {
  /** head.html文件内容 */
  headContent: string
  /** body.html文件内容 */
  bodyContent: string
}

// 配置预设
export interface ConfigPreset {
  /** 预设名称 */
  name: string
  /** 预设描述 */
  description: string
  /** 预设配置 */
  config: BeautifierConfig
}

// 应用状态
export interface AppState {
  /** 当前配置 */
  currentConfig: BeautifierConfig
  /** 生成的文件内容 */
  generatedFiles: GeneratedFiles
  /** 配置预设列表 */
  presets: ConfigPreset[]
  /** 是否正在生成文件 */
  isGenerating: boolean
}
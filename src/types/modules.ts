/**
 * 美化模块类型定义
 */

// 美化模块枚举 - 只保留背景图片
export enum BeautificationModule {
  BACKGROUND_IMAGE = 'backgroundImage'
}

// 美化模块信息
export interface ModuleInfo {
  id: BeautificationModule
  name: string
  description: string
  icon: string
  category: string
  enabled: boolean
}

// 背景图片配置 - 简化为只包含图片URL
export interface BackgroundImageConfig {
  enabled: boolean
  lightImage: string
  darkImage: string
}

// 全局配置
export interface GlobalConfig {
  generateComments: boolean
  minifyOutput: boolean
}

// 完整的美化配置
export interface BeautificationConfig {
  modules: {
    backgroundImage: BackgroundImageConfig
  }
  global: GlobalConfig
}

// 生成的文件结构
export interface GeneratedFiles {
  headContent: string
  bodyContent: string
  enabledModules: BeautificationModule[]
  moduleCount: number
}

// 模块生成器接口
export interface ModuleGenerator {
  generateHeadContent(config: any): string
  generateBodyContent(config: any): string
  validate(config: any): { valid: boolean; errors: string[] }
}
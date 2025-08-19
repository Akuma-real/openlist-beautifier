/**
 * 模块化文件生成服务
 * 负责将模块化配置转换为HTML文件内容
 */

import { BeautificationModule } from '@/types/modules'
import type { BeautificationConfig, BackgroundImageConfig } from '@/types/modules'

export interface ModularGeneratedFiles {
  headContent: string
  bodyContent: string
  headSize: string
  bodySize: string
  totalSize: string
  headLines: number
  bodyLines: number
  totalLines: number
  fileCount: number
  enabledModules: string[]
}

/**
 * 模块化文件生成器类
 */
export class ModularFileGenerator {
  /**
   * 生成所有文件内容
   * @param config 模块化配置
   * @returns 生成的文件内容对象
   */
  static generateFiles(config: BeautificationConfig): ModularGeneratedFiles {
    const headContent = this.generateHead(config)
    const bodyContent = this.generateBody(config)
    const stats = this.generateFileStats({ headContent, bodyContent })
    
    const enabledModules = Object.entries(config.modules)
      .filter(([_, moduleConfig]) => moduleConfig.enabled)
      .map(([moduleId, _]) => moduleId)

    return {
      headContent,
      bodyContent,
      ...stats,
      enabledModules
    }
  }

  /**
   * 生成head.html文件内容
   * @param config 模块化配置
   * @returns head.html文件内容
   */
  static generateHead(config: BeautificationConfig): string {
    let content = ''

    // 背景图片模块
    if (config.modules.backgroundImage.enabled) {
      content += this.generateBackgroundImageSection(config.modules.backgroundImage, false)
    }

    return content
  }

  /**
   * 生成body.html文件内容
   * @param config 模块化配置
   * @returns body.html文件内容
   */
  static generateBody(config: BeautificationConfig): string {
    // 暂无body内容 - 背景图片模块只在head中生成CSS
    // 如需添加JavaScript功能，可在此处扩展
    return ''
  }

  /**
   * 生成文件头部注释
   */
  private static generateFileHeader(fileName: string, config: BeautificationConfig): string {
    const enabledModules = Object.entries(config.modules)
      .filter(([_, moduleConfig]) => moduleConfig.enabled)
      .map(([moduleId, _]) => moduleId)

    return `<!--
═══════════════════════════════════════════════════════════════
OpenList 美化配置生成器 - ${fileName}
生成时间: ${new Date().toLocaleString('zh-CN')}
═══════════════════════════════════════════════════════════════

启用的模块:
${enabledModules.map(id => `  ✓ ${this.getModuleName(id)}`).join('\n')}

配置信息:
  - 压缩输出: ${config.global.minifyOutput ? '是' : '否'}
  - 生成注释: ${config.global.generateComments ? '是' : '否'}

警告: 此文件由程序自动生成，请勿手动修改！
═══════════════════════════════════════════════════════════════
-->

`
  }

  /**
   * 生成文件尾部注释
   */
  private static generateFileFooter(): string {
    return `
<!-- 
═══════════════════════════════════════════════════════════════
文件结束 - OpenList 美化配置生成器
项目地址: https://github.com/your-repo/openlist-beautifier
═══════════════════════════════════════════════════════════════
-->`
  }

  /**
   * 生成背景图片模块代码
   */
  private static generateBackgroundImageSection(bgImageConfig: BackgroundImageConfig, comments: boolean): string {
    let section = ''

    section += `<style>\n`
    section += `  body {\n`
    
    // 浅色主题背景
    if (bgImageConfig.lightImage) {
      section += `    --light-bg-image: url('${bgImageConfig.lightImage}');\n`
    }
    
    // 深色主题背景
    if (bgImageConfig.darkImage) {
      section += `    --dark-bg-image: url('${bgImageConfig.darkImage}');\n`
    }
    
    section += `  }\n\n`
    
    // 浅色主题样式
    section += `  .hope-ui-light {\n`
    if (bgImageConfig.lightImage) {
      section += `    background-image: var(--light-bg-image);\n`
      section += `    background-repeat: no-repeat;\n`
      section += `    background-size: cover;\n`
      section += `    background-attachment: fixed;\n`
      section += `    background-position: center;\n`
    }
    section += `  }\n\n`
    
    // 深色主题样式
    section += `  .hope-ui-dark {\n`
    if (bgImageConfig.darkImage) {
      section += `    background-image: var(--dark-bg-image);\n`
      section += `    background-repeat: no-repeat;\n`
      section += `    background-size: cover;\n`
      section += `    background-attachment: fixed;\n`
      section += `    background-position: center;\n`
    }
    section += `  }\n`
    section += `</style>`

    return section
  }

  /**
   * 获取模块名称
   */
  private static getModuleName(moduleId: string): string {
    const names = {
      'backgroundImage': '背景图片'
    }
    return names[moduleId as keyof typeof names] || moduleId
  }

  /**
   * 生成文件统计信息
   */
  private static generateFileStats(files: { headContent: string; bodyContent: string }) {
    const headSize = this.getFileSize(files.headContent)
    const bodySize = this.getFileSize(files.bodyContent)
    const totalSize = headSize + bodySize

    const headLines = files.headContent.split('\n').length
    const bodyLines = files.bodyContent.split('\n').length
    const totalLines = headLines + bodyLines

    return {
      headSize: this.formatFileSize(headSize),
      bodySize: this.formatFileSize(bodySize),
      totalSize: this.formatFileSize(totalSize),
      headLines,
      bodyLines,
      totalLines,
      fileCount: 2
    }
  }

  /**
   * 获取文件大小
   */
  private static getFileSize(content: string): number {
    return new Blob([content]).size
  }

  /**
   * 格式化文件大小
   */
  private static formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }
  }

  /**
   * 生成配置预览信息
   */
  static generateConfigPreview(config: BeautificationConfig): string {
    const enabledModules = Object.entries(config.modules)
      .filter(([_, moduleConfig]) => moduleConfig.enabled)
      .map(([moduleId, _]) => this.getModuleName(moduleId))

    return `
配置预览：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 启用模块 (${enabledModules.length}个)：
   ${enabledModules.map(name => `✓ ${name}`).join('\n   ')}

⚙️ 全局配置：
   生成注释: ${config.global.generateComments ? '开启' : '关闭'}
   压缩输出: ${config.global.minifyOutput ? '开启' : '关闭'}

🖼️ 背景图片：
   ${config.modules.backgroundImage.enabled ? '✓ 已启用' : '✗ 已禁用'}
   ${config.modules.backgroundImage.enabled && config.modules.backgroundImage.lightImage ? `浅色主题: ${config.modules.backgroundImage.lightImage}` : ''}
   ${config.modules.backgroundImage.enabled && config.modules.backgroundImage.darkImage ? `深色主题: ${config.modules.backgroundImage.darkImage}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim()
  }

  /**
   * 验证模块化配置有效性
   */
  static validateConfig(config: BeautificationConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // 检查是否至少启用了一个模块
    const enabledModules = Object.values(config.modules).filter(module => module.enabled)
    if (enabledModules.length === 0) {
      errors.push('至少需要启用一个美化模块')
    }

    // 验证背景图片模块配置
    if (config.modules.backgroundImage.enabled) {
      if (!config.modules.backgroundImage.lightImage && !config.modules.backgroundImage.darkImage) {
        errors.push('背景图片模块：至少需要设置一张背景图片')
      }
      
      // 验证URL格式
      if (config.modules.backgroundImage.lightImage && !this.isValidUrl(config.modules.backgroundImage.lightImage)) {
        errors.push('背景图片模块：浅色主题图片URL格式不正确')
      }
      
      if (config.modules.backgroundImage.darkImage && !this.isValidUrl(config.modules.backgroundImage.darkImage)) {
        errors.push('背景图片模块：深色主题图片URL格式不正确')
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * 验证URL格式
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}
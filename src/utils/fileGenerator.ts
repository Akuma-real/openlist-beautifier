/**
 * 文件生成服务
 * 负责将配置转换为HTML文件内容
 */

import type { BeautifierConfig, GeneratedFiles } from '@/types/config'
import { generateHeadContent, getConfigComment as getHeadConfigComment } from '../templates/head'
import { generateBodyContent } from '../templates/body'

/**
 * 文件生成器类
 */
export class FileGenerator {
  /**
   * 生成所有文件内容
   * @param config 美化器配置
   * @returns 生成的文件内容对象
   */
  static generateFiles(config: BeautifierConfig): GeneratedFiles {
    const headContent = this.generateHead(config)
    const bodyContent = this.generateBody(config)

    return {
      headContent,
      bodyContent
    }
  }

  /**
   * 生成head.html文件内容
   * @param config 美化器配置
   * @returns head.html文件内容
   */
  static generateHead(config: BeautifierConfig): string {
    const content = generateHeadContent(config)
    const comment = getHeadConfigComment(config)
    
    return content + comment
  }

  /**
   * 生成body.html文件内容
   * @param config 美化器配置
   * @returns body.html文件内容
   */
  static generateBody(config: BeautifierConfig): string {
    return generateBodyContent(config)
  }

  /**
   * 生成配置预览信息
   * @param config 美化器配置
   * @returns 配置预览文本
   */
  static generateConfigPreview(config: BeautifierConfig): string {
    return `
配置预览：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 主题颜色：
   浅色主题: ${config.colors.light}
   深色主题: ${config.colors.dark}
   特定前缀: ${config.colors.specificPrefix}

🎯 选择器：
   浅色主题: ${config.selectors.lightTheme}
   深色主题: ${config.selectors.darkTheme}
   根元素: ${config.selectors.rootElement}
   忽略元素: ${config.selectors.ignored.length}个

🚫 排除路径：
   ${config.paths.excluded.length > 0 ? config.paths.excluded.join(', ') : '无'}

⚙️ 性能配置：
   节流延迟: ${config.observer.throttleDelay}ms
   子元素监听: ${config.observer.childList ? '开启' : '关闭'}
   子树监听: ${config.observer.subtree ? '开启' : '关闭'}

🐛 调试模式：
   ${config.debug ? '开启' : '关闭'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim()
  }

  /**
   * 验证配置有效性
   * @param config 美化器配置
   * @returns 验证结果和错误信息
   */
  static validateConfig(config: BeautifierConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // 验证颜色配置
    if (!config.colors.light) {
      errors.push('浅色主题颜色不能为空')
    }
    if (!config.colors.dark) {
      errors.push('深色主题颜色不能为空')
    }

    // 验证选择器配置
    if (!config.selectors.lightTheme) {
      errors.push('浅色主题选择器不能为空')
    }
    if (!config.selectors.darkTheme) {
      errors.push('深色主题选择器不能为空')
    }
    if (!config.selectors.rootElement) {
      errors.push('根元素选择器不能为空')
    }

    // 验证观察器配置
    if (typeof config.observer.throttleDelay !== 'number' || config.observer.throttleDelay < 0) {
      errors.push('节流延迟必须是非负数')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * 获取文件大小估算
   * @param content 文件内容
   * @returns 文件大小（字节）
   */
  static getFileSize(content: string): number {
    return new Blob([content]).size
  }

  /**
   * 格式化文件大小
   * @param bytes 字节数
   * @returns 格式化的大小字符串
   */
  static formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }
  }

  /**
   * 生成文件统计信息
   * @param files 生成的文件内容
   * @returns 统计信息
   */
  static generateFileStats(files: GeneratedFiles): {
    headSize: string
    bodySize: string
    totalSize: string
    headLines: number
    bodyLines: number
    totalLines: number
    fileCount: number
  } {
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
}
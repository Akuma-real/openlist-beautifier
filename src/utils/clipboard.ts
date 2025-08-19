/**
 * 剪贴板操作工具
 * 提供复制文本到剪贴板的功能
 */

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本内容
 * @returns Promise<boolean> 复制是否成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级到传统方法
      return fallbackCopyToClipboard(text)
    }
  } catch (error) {
    console.error('复制到剪贴板失败:', error)
    // 尝试降级方法
    return fallbackCopyToClipboard(text)
  }
}

/**
 * 降级的剪贴板复制方法
 * @param text 要复制的文本内容
 * @returns boolean 复制是否成功
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    // 创建临时文本区域
    const textArea = document.createElement('textarea')
    textArea.value = text
    
    // 设置样式使其不可见
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    textArea.setAttribute('readonly', '')
    
    document.body.appendChild(textArea)
    
    // 选择并复制文本
    textArea.select()
    textArea.setSelectionRange(0, 99999) // 移动设备兼容
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    return successful
  } catch (error) {
    console.error('降级复制方法失败:', error)
    return false
  }
}

/**
 * 检查剪贴板API是否可用
 * @returns boolean 是否支持剪贴板API
 */
export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard || document.queryCommandSupported?.('copy'))
}

/**
 * 复制文件内容组合器
 */
export class ClipboardManager {
  /**
   * 复制单个文件内容
   * @param content 文件内容
   * @param fileName 文件名（用于提示）
   * @returns Promise<boolean> 复制是否成功
   */
  static async copyFileContent(content: string, fileName: string): Promise<boolean> {
    const header = `/* ${fileName} - 由 OpenList 美化配置生成器生成 */\n\n`
    const fullContent = header + content
    
    const success = await copyToClipboard(fullContent)
    
    if (success) {
      console.log(`✅ ${fileName} 内容已复制到剪贴板`)
    } else {
      console.error(`❌ ${fileName} 复制失败`)
    }
    
    return success
  }

  /**
   * 复制双文件内容（用分隔符分开）
   * @param headContent head.html内容
   * @param bodyContent body.html内容
   * @returns Promise<boolean> 复制是否成功
   */
  static async copyBothFiles(headContent: string, bodyContent: string): Promise<boolean> {
    const separator = '\n\n' + '='.repeat(80) + '\n'
    const headerText = '/* OpenList 美化器文件 - 由配置生成器生成 */\n'
    
    const combinedContent = [
      headerText,
      '/* head.html 文件内容 */',
      headContent,
      separator,
      '/* body.html 文件内容 */',
      bodyContent,
      separator,
      '/* 使用说明 */',
      '1. 将 head.html 内容复制到 OpenList "自定义头部" 设置中',
      '2. 将 body.html 内容复制到 OpenList "自定义内容" 设置中',
      '3. 保存设置并刷新页面查看效果'
    ].join('\n')
    
    const success = await copyToClipboard(combinedContent)
    
    if (success) {
      console.log('✅ 双文件内容已复制到剪贴板')
    } else {
      console.error('❌ 双文件复制失败')
    }
    
    return success
  }

  /**
   * 复制配置JSON
   * @param config 配置对象
   * @returns Promise<boolean> 复制是否成功
   */
  static async copyConfigJSON(config: any): Promise<boolean> {
    try {
      const configText = JSON.stringify(config, null, 2)
      const header = '/* OpenList 美化器配置 - 由配置生成器导出 */\n\n'
      const fullContent = header + configText
      
      const success = await copyToClipboard(fullContent)
      
      if (success) {
        console.log('✅ 配置JSON已复制到剪贴板')
      } else {
        console.error('❌ 配置JSON复制失败')
      }
      
      return success
    } catch (error) {
      console.error('复制配置JSON失败:', error)
      return false
    }
  }

  /**
   * 显示复制成功提示
   * @param fileName 文件名或描述
   */
  static showCopySuccess(fileName: string): void {
    // 这里可以集成 Element Plus 的消息提示
    // ElMessage.success(`${fileName} 已复制到剪贴板`)
  }

  /**
   * 显示复制失败提示
   * @param fileName 文件名或描述
   * @param error 错误信息
   */
  static showCopyError(fileName: string, error?: any): void {
    // 这里可以集成 Element Plus 的错误提示
    // ElMessage.error(`${fileName} 复制失败`)
    console.error(`复制 ${fileName} 失败:`, error)
  }
}
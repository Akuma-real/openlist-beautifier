/**
 * 文件下载工具
 * 提供将内容保存为文件下载的功能
 */

/**
 * 下载文本文件
 * @param content 文件内容
 * @param fileName 文件名
 * @param mimeType MIME类型，默认为text/html
 */
export function downloadTextFile(
  content: string, 
  fileName: string, 
  mimeType: string = 'text/html'
): void {
  try {
    // 创建 Blob 对象
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
    
    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.href = url
    link.download = fileName
    link.style.display = 'none'
    
    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 清理 URL 对象
    setTimeout(() => URL.revokeObjectURL(url), 100)
    
    console.log(`✅ ${fileName} 下载开始`)
  } catch (error) {
    console.error(`下载 ${fileName} 失败:`, error)
    throw new Error(`下载失败: ${error}`)
  }
}

/**
 * 下载JSON文件
 * @param data 要下载的数据对象
 * @param fileName 文件名（不含扩展名）
 */
export function downloadJSON(data: any, fileName: string): void {
  try {
    const content = JSON.stringify(data, null, 2)
    downloadTextFile(content, `${fileName}.json`, 'application/json')
  } catch (error) {
    console.error(`下载JSON文件 ${fileName} 失败:`, error)
    throw new Error(`JSON下载失败: ${error}`)
  }
}

/**
 * 创建ZIP文件并下载（使用JSZip）
 * @param files 文件列表，格式为 {filename: content}
 * @param zipFileName ZIP文件名
 */
export async function downloadZip(
  files: Record<string, string>, 
  zipFileName: string
): Promise<void> {
  try {
    // 动态导入 JSZip（如果需要ZIP功能，需要安装jszip依赖）
    const JSZip = (await import('jszip')).default
    
    const zip = new JSZip()
    
    // 添加文件到ZIP
    Object.entries(files).forEach(([filename, content]) => {
      zip.file(filename, content)
    })
    
    // 生成ZIP文件
    const blob = await zip.generateAsync({ type: 'blob' })
    
    // 下载ZIP文件
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.href = url
    link.download = zipFileName.endsWith('.zip') ? zipFileName : `${zipFileName}.zip`
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 清理 URL 对象
    setTimeout(() => URL.revokeObjectURL(url), 100)
    
    console.log(`✅ ZIP文件 ${zipFileName} 下载开始`)
  } catch (error) {
    console.error(`创建ZIP文件失败:`, error)
    
    // 降级方案：分别下载文件
    console.log('降级到单独下载文件...')
    Object.entries(files).forEach(([filename, content]) => {
      setTimeout(() => {
        downloadTextFile(content, filename)
      }, 100) // 添加延迟避免下载冲突
    })
  }
}

/**
 * 文件下载管理器
 */
export class DownloadManager {
  /**
   * 下载head.html文件
   * @param content head.html内容
   */
  static downloadHeadFile(content: string): void {
    downloadTextFile(content, 'head.html', 'text/html')
  }

  /**
   * 下载body.html文件
   * @param content body.html内容
   */
  static downloadBodyFile(content: string): void {
    downloadTextFile(content, 'body.html', 'text/html')
  }

  /**
   * 下载配置JSON文件
   * @param config 配置对象
   */
  static downloadConfigFile(config: any): void {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:\-T]/g, '')
    const fileName = `openlist-beautifier-config-${timestamp}`
    downloadJSON(config, fileName)
  }

  /**
   * 批量下载所有文件
   * @param headContent head.html内容
   * @param bodyContent body.html内容
   * @param config 配置对象
   * @param useZip 是否使用ZIP压缩，默认为true
   */
  static async downloadAllFiles(
    headContent: string,
    bodyContent: string,
    config: any,
    useZip: boolean = true
  ): Promise<void> {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:\-T]/g, '')
    
    if (useZip) {
      try {
        const files = {
          'head.html': headContent,
          'body.html': bodyContent,
          'config.json': JSON.stringify(config, null, 2),
          'README.txt': this.generateReadmeContent()
        }
        
        await downloadZip(files, `openlist-beautifier-${timestamp}`)
        return
      } catch (error) {
        console.warn('ZIP下载失败，降级到单独下载:', error)
      }
    }
    
    // 降级方案：单独下载文件
    this.downloadHeadFile(headContent)
    
    setTimeout(() => {
      this.downloadBodyFile(bodyContent)
    }, 200)
    
    setTimeout(() => {
      this.downloadConfigFile(config)
    }, 400)
    
    setTimeout(() => {
      downloadTextFile(this.generateReadmeContent(), 'README.txt', 'text/plain')
    }, 600)
  }

  /**
   * 生成README文件内容
   * @returns README内容
   */
  private static generateReadmeContent(): string {
    return `OpenList 美化器配置文件
================================

文件说明：
- head.html: 头部文件，包含CSS样式和字体配置
- body.html: 内容文件，包含美化器核心代码
- config.json: 配置文件，可用于导入到其他配置生成器

使用方法：
1. 登录 OpenList 管理后台
2. 进入 "设置" -> "全局" 页面
3. 将 head.html 的内容复制到 "自定义头部" 中
4. 将 body.html 的内容复制到 "自定义内容" 中
5. 保存设置并刷新页面查看效果

注意事项：
- 请确保 OpenList 版本支持自定义HTML
- 如遇到问题，可以在浏览器控制台查看调试信息
- 配置文件可以导入到配置生成器中重新编辑

生成时间: ${new Date().toLocaleString()}
生成器版本: v1.0
项目地址: https://github.com/openlist-project/beautifier-generator`
  }

  /**
   * 获取文件下载统计
   * @param headContent head内容
   * @param bodyContent body内容
   * @param config 配置
   * @returns 下载统计信息
   */
  static getDownloadStats(headContent: string, bodyContent: string, config: any): {
    fileCount: number
    totalSize: string
    estimatedDownloadTime: string
  } {
    const headSize = new Blob([headContent]).size
    const bodySize = new Blob([bodyContent]).size
    const configSize = new Blob([JSON.stringify(config)]).size
    const readmeSize = new Blob([this.generateReadmeContent()]).size
    
    const totalSize = headSize + bodySize + configSize + readmeSize
    
    // 估算下载时间（基于1MB/s的网络速度）
    const estimatedSeconds = Math.ceil(totalSize / (1024 * 1024))
    
    return {
      fileCount: 4,
      totalSize: this.formatFileSize(totalSize),
      estimatedDownloadTime: estimatedSeconds < 1 ? '< 1秒' : `约 ${estimatedSeconds}秒`
    }
  }

  /**
   * 格式化文件大小
   * @param bytes 字节数
   * @returns 格式化的大小字符串
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
}
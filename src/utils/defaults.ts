import type { BeautifierConfig } from '@/types/config'

/**
 * 默认配置 - 基于现有OpenList美化器的配置
 */
export const DEFAULT_CONFIG: BeautifierConfig = {
  // 主题颜色配置
  colors: {
    // 浅色主题背景色 - 半透明白色，与背景图片融合
    light: 'rgba(255, 255, 255, 0.8)',
    
    // 深色主题背景色 - OpenList 默认深色背景
    dark: 'rgb(32, 36, 37)',
    
    // 特定颜色前缀 - 用于识别某些不应被替换的系统颜色
    // 主要是 Hope UI 框架的特定灰色系
    specificPrefix: 'rgba(132, 133, 141'
  },

  // 选择器配置
  selectors: {
    // Hope UI 浅色主题根选择器
    lightTheme: '.hope-ui-light',
    
    // Hope UI 深色主题根选择器  
    darkTheme: '.hope-ui-dark',
    
    // 被忽略的选择器列表 - 这些元素不会被美化
    ignored: [
      '.hope-tooltip',           // 工具提示框
      '.hope-tooltip__arrow',    // 工具提示箭头
      '.hope-checkbox__control', // 复选框控件
      '.hope-modal__overlay',    // 模态框遮罩层
      'button:not(.hope-menu__trigger)', // 按钮（除菜单触发器外）
      'svg'                      // SVG 图标
    ],
    
    // MutationObserver 观察的根元素
    rootElement: '#root'
  },

  // 路径配置
  paths: {
    // 排除美化的路径前缀
    // 这些页面通常有特殊布局，不适合背景美化
    excluded: [
      '/@manage',  // 管理页面
      '/@login'    // 登录页面
    ]
  },

  // 观察器配置
  observer: {
    // 观察直接子元素的添加和删除
    childList: true,
    
    // 观察整个 DOM 子树的变化
    subtree: true,
    
    // 美化操作节流延迟（毫秒）
    // 防止频繁的 DOM 操作影响性能
    throttleDelay: 16 // 约 60fps
  },

  // 调试模式开关
  debug: false
}

/**
 * 配置预设列表
 */
export const CONFIG_PRESETS = [
  {
    name: '默认配置',
    description: '适用于大多数OpenList部署的标准美化配置',
    config: DEFAULT_CONFIG
  },
  {
    name: '高对比度',
    description: '提供更高对比度的美化效果，适合阅读',
    config: {
      ...DEFAULT_CONFIG,
      colors: {
        ...DEFAULT_CONFIG.colors,
        light: 'rgba(255, 255, 255, 0.95)',
        dark: 'rgb(20, 24, 25)'
      }
    }
  },
  {
    name: '透明效果',
    description: '更透明的背景效果，突出背景图片',
    config: {
      ...DEFAULT_CONFIG,
      colors: {
        ...DEFAULT_CONFIG.colors,
        light: 'rgba(255, 255, 255, 0.6)',
        dark: 'rgba(32, 36, 37, 0.8)'
      }
    }
  },
  {
    name: '性能优化',
    description: '降低观察频率，适合低性能设备',
    config: {
      ...DEFAULT_CONFIG,
      observer: {
        ...DEFAULT_CONFIG.observer,
        throttleDelay: 100 // 减少更新频率
      }
    }
  }
]
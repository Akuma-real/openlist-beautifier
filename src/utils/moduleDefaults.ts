import { BeautificationModule } from '@/types/modules'
import type { 
  ModuleInfo, 
  BeautificationConfig,
  BackgroundImageConfig
} from '@/types/modules'

/**
 * 美化模块定义 - 只保留背景图片模块
 */
export const MODULE_DEFINITIONS: ModuleInfo[] = [
  {
    id: BeautificationModule.BACKGROUND_IMAGE,
    name: '背景图片',
    description: '设置页面背景图片，支持主题切换',
    icon: 'Picture',
    category: '视觉效果',
    enabled: true
  }
]

/**
 * 默认配置 - 只包含背景图片模块
 */
export const DEFAULT_MODULE_CONFIG: BeautificationConfig = {
  modules: {
    // 背景图片配置
    backgroundImage: {
      enabled: true,
      lightImage: 'https://source.unsplash.com/1920x1080/?nature',
      darkImage: 'https://source.unsplash.com/1920x1080/?night'
    }
  },

  global: {
    generateComments: true,
    minifyOutput: false
  }
}
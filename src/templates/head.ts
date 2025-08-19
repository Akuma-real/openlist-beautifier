/**
 * head.html 文件模板生成器
 * 基于现有的head.html文件结构生成动态内容
 */

import type { BeautifierConfig } from '@/types/config'

/**
 * 生成head.html内容
 */
export function generateHeadContent(config: BeautifierConfig): string {
  const { colors, debug } = config
  
  return `<!-- OpenList美化器配置生成器 v1.0 - 头部文件 -->
<!-- 由 OpenList 美化配置生成器自动生成 -->

<!-- 引入自定义字体 -->
<link rel="stylesheet" href="https://s4.zstatic.net/ajax/libs/lxgw-wenkai-webfont/1.7.0/lxgwwenkai-regular.min.css">

<style>
    /* 移除原生视频控件 */
    video::-webkit-media-controls {
        display: none;
    }

    /* 设置背景图片样式 */
    body {
        background-repeat: no-repeat;
        background-size: cover;
        background-attachment: fixed;
        background-position: center;
    }

    /* 深色主题背景配置 */
    /* 加了个深色遮罩，保护你的眼睛 */
    body.hope-ui-dark {
        background-color: ${colors.dark};
        background-image: linear-gradient(rgba(32, 36, 37, 0.7), rgba(32, 36, 37, 0.7)), url('https://t.alcy.cc/moez');
    }

    /* 浅色主题背景配置 */
    body.hope-ui-light {
        background-image: url('https://t.alcy.cc/moez');
    }

    /* 统一站点公告的样式 */
    .hope-ui-light .hope-c-PJLV-ikJQsXT-css {
        background: ${colors.light} !important;
        backdrop-filter: blur(0) !important;
    }

    .hope-ui-dark .hope-c-PJLV-ikJQsXT-css {
        background: ${colors.dark} !important;
        backdrop-filter: blur(0) !important;
    }

    /* 自定义字体 */
    * {
        font-family: "LXGW WenKai", sans-serif;
    }

    /* 生成器标识 */
    body::before {
        content: "由 OpenList 美化配置生成器生成";
        position: fixed;
        bottom: 10px;
        right: 10px;
        font-size: 10px;
        color: rgba(128, 128, 128, 0.3);
        pointer-events: none;
        z-index: 9999;
        font-family: "LXGW WenKai", sans-serif;
    }
</style>

<!-- 看板娘配置 -->
<script>
if (localStorage.getItem('modelId') === null) {
    localStorage.setItem('modelId', '3'); // 设置默认模型ID
    localStorage.setItem('modelTexturesId', '0'); // 设置默认皮肤ID
}
</script>
<script src="https://l2d.mmoe.work/dist/autoload.js"></script>

<!-- 兼容性补丁 -->
<script src="https://s4.zstatic.net/ajax/libs/js-polyfills/0.1.43/polyfill.min.js?features=String.prototype.replaceAll"></script>

${debug ? `
<!-- 调试模式样式 -->
<style>
    [data-beautified] {
        position: relative;
    }
    
    [data-beautified]::after {
        content: "已美化";
        position: absolute;
        top: 2px;
        left: 2px;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        font-size: 10px;
        padding: 1px 3px;
        border-radius: 2px;
        pointer-events: none;
        z-index: 10000;
    }
</style>
` : ''}`
}

/**
 * 获取配置注释
 */
export function getConfigComment(config: BeautifierConfig): string {
  return `
<!--
  OpenList美化配置信息：
  - 浅色主题颜色: ${config.colors.light}
  - 深色主题颜色: ${config.colors.dark}
  - 特定前缀: ${config.colors.specificPrefix}
  - 调试模式: ${config.debug ? '开启' : '关闭'}
  - 生成时间: ${new Date().toLocaleString()}
-->`
}
import { defineConfig } from 'vitepress';

const base = process.env.VITEPRESS_BASE || '/';

export default defineConfig({
  title: '哲学原书批注',
  description: '围绕公版与开放授权哲学原文的阅读批注站',
  base,
  cleanUrls: true,
  appearance: true,
  lastUpdated: false,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }]],
  themeConfig: {
    outline: false,
    nav: [
      { text: '书架', link: '/' },
      { text: '搜索', link: '/search' }
    ],
    sidebar: [],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],
    footer: {
      message: '仅发布公版、开放授权或已获授权文本。',
      copyright: 'Built with VitePress and GitHub Pages.'
    }
  },
  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    }
  }
});

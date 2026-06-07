# 哲学原书批注站

这是一个基于 VitePress 和 GitHub Pages 的静态哲学原书批注站。核心内容不是传统博客文章，而是围绕公版、开放授权或已获授权原文建立的书籍总览、阅读工作区、批注、概念索引和搜索。

## 本地开发

```bash
pnpm install
pnpm docs:dev
```

## 构建

```bash
pnpm docs:build
```

## 内容流程

第一版的目标流程：

1. 在 Zotero 中阅读 PDF 或 EPUB，并使用固定颜色划线和写批注。
2. 运行 `pnpm export:zotero`，把本地批注导出为站点数据。
3. 本地预览站点。
4. 推送到 GitHub，由 GitHub Pages 发布。

当前仓库已经包含站点骨架和示例数据；Zotero 导出脚本仍是接口占位。

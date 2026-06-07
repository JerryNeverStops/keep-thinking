# 本地写作与 GitHub 发布工作流

这份文档说明第一版站点如何添加 PDF / EPUB 原书、如何批注，以及如何把本地数据更新到 GitHub Pages。

## 当前状态

当前仓库已经有 VitePress 站点骨架、示例书籍、阅读页组件、公众号草稿目录和 Zotero 导出脚本。

还没有完成的部分：

- 真正渲染完整 PDF.js / EPUB.js 阅读器
- 对 Zotero 数据库加锁时的自动处理

所以第一阶段有两种工作流：

- **Zotero 导出**：现在可用，适合把本地阅读批注同步到网站。
- **手动维护数据**：仍然可用，适合临时修正展示数据。

## 1. 上传 PDF 或 EPUB 书

第一版不是网页上传，而是把文件放进仓库。

### 1.1 确认公开资格

只放这些文件：

- 公版书
- 开放授权文本
- 你已经拥有公开展示授权的文本

不要把普通商业电子书直接放到公开仓库。

本项目默认维护者只会放入可公开文本，所以导出脚本会记录为 `maintainer-confirmed`。

### 1.2 新建书籍文件夹

每本书一个文件夹：

```text
books/
  your-book-slug/
    source.pdf
    book.yaml
    notes.generated.md
```

如果是 EPUB：

```text
books/
  your-book-slug/
    source.epub
    book.yaml
    notes.generated.md
```

`your-book-slug` 用英文、小写、短横线，例如：

```text
kant-critique-pure-reason
plato-apology
heidegger-being-and-time
```

### 1.3 编辑 `book.yaml`

示例：

```yaml
zoteroKey: ABCD1234
slug: kant-critique-pure-reason
title: 纯粹理性批判
author: 伊曼努尔·康德
translator: ""
language: zh
sourceFile: source.pdf
format: pdf
publicationEligibility:
  type: public-domain
  note: ""
topicTags: [康德, 认识论]
readingStatus: reading
summary: ""
```

字段说明：

- `zoteroKey`：Zotero 条目的稳定 ID，导出脚本会用它匹配。
- `slug`：公开 URL 使用的书籍标识。
- `sourceFile`：PDF 或 EPUB 文件名。
- `format`：`pdf` 或 `epub`。
- `publicationEligibility`：公开展示依据。
- `readingStatus`：`reading`、`paused`、`finished`。

### 1.4 新建站点页面

每本书需要两个 VitePress 页面：

```text
site/books/your-book-slug/index.md
site/books/your-book-slug/read.md
```

`index.md`：

```md
---
layout: page
title: 书名
---

<BookOverview slug="your-book-slug" />
```

`read.md`：

```md
---
layout: page
title: 阅读书名
---

<ReadingWorkspace slug="your-book-slug" />
```

### 1.5 运行 Zotero 同步

确认 Zotero 已经保存批注后，关闭 Zotero，然后运行：

```bash
pnpm export:zotero -- --zotero-key=ZOTERO_KEY --slug=your-book-slug
```

如果当前只有一本 PDF / EPUB，也可以省略 `--zotero-key`。

脚本会生成或更新：

```text
books/your-book-slug/source.pdf 或 source.epub
books/your-book-slug/book.yaml
books/your-book-slug/notes.generated.md
site/books/your-book-slug/index.md
site/books/your-book-slug/read.md
site/.vitepress/theme/data/zotero-books.generated.ts
```

`site/.vitepress/theme/data/books.ts` 会自动读取 `zotero-books.generated.ts`。

## 2. 如何评论和批注

推荐工作流是在 Zotero 本地阅读器里完成批注，不是在网页上评论。

### 2.1 在 Zotero 中阅读

把 PDF / EPUB 添加到 Zotero，然后在 Zotero 中：

- 选中原文
- 划线或高亮
- 添加 Note

### 2.2 使用固定颜色表示笔记类型

颜色规则：

- 黄色：解释
- 蓝色：问题
- 紫色：概念
- 绿色：论证
- 粉色：联想
- 灰色或无正文高亮：独立划线 / 待整理

### 2.3 批注正文怎么写

正文直接写自然语言，不需要写 `type: concept` 之类的结构化字段。

可以在正文末尾加 hashtag：

```text
这里的关键不是谦逊姿态，而是一种认识论边界。

#康德 #认识论
```

导出时 hashtag 会变成网站标签。

### 2.4 概念笔记怎么写

紫色批注的第一行会作为概念名。

例如：

```text
先验综合判断

这里的问题不只是“知识从哪里来”，而是康德想解释一种特殊判断：
它既扩展知识，又不依赖经验。

#康德 #认识论
```

网站会把“先验综合判断”放进这本书的概念索引。

### 2.5 独立划线

如果只有高亮，没有 Note 正文：

- 会显示在原文里
- 不进入右侧批注流

这样读者不会看到很多空笔记。

## 3. 如何更新数据

### 3.1 当前手动更新流程

现在可以这样更新：

```bash
pnpm docs:dev
```

打开本地站点预览。

修改内容后构建：

```bash
pnpm docs:build
```

确认没问题后提交：

```bash
git status
git add .
git commit -m "Add reading annotations"
git push
```

GitHub Pages 会根据 `.github/workflows/deploy.yml` 自动构建发布。

### 3.2 目标 Zotero 导出流程

目标流程是：

```bash
pnpm export:zotero
pnpm docs:dev
pnpm docs:build
git add .
git commit -m "Update reading annotations"
git push
```

`pnpm export:zotero` 会做这些事：

- 读取 `books/*/book.yaml` 中的 `zoteroKey`
- 找到对应 Zotero 条目
- 读取 PDF / EPUB 批注
- 按颜色生成笔记类型
- 抽取 hashtag 为标签
- 生成概念索引
- 生成搜索索引
- 更新站点数据

当前脚本已经能读取 Zotero SQLite 数据库并生成站点数据；完整 PDF.js / EPUB.js 阅读器仍待接入。

## 4. 本地和 GitHub 怎么管理

### 4.1 本地是真正的工作区

本地负责：

- 存放 PDF / EPUB
- 存放书籍配置
- 存放生成后的笔记数据
- 存放公众号文章草稿
- 本地预览站点

### 4.2 GitHub 是发布和备份

GitHub 负责：

- 保存仓库历史
- 触发 GitHub Pages 构建
- 托管公开网站

当前远端仓库：

```text
https://github.com/JerryNeverStops/keep-thinking
```

### 4.3 推荐日常节奏

阅读时：

```text
Zotero 里读书、划线、写批注
```

整理时：

```bash
pnpm export:zotero
pnpm docs:dev
```

发布时：

```bash
pnpm docs:build
git status
git add .
git commit -m "Update notes for book title"
git push
```

### 4.4 不要手改生成文件

带有 `.generated.` 的文件原则上不要手动编辑。

如果要改批注内容，回到 Zotero 改；如果要改书籍信息，改 `book.yaml`；如果要改站点组件，改 `site/.vitepress/theme/`。

## 5. 公众号文章草稿

公众号文章不是主站内容，而是从一段原文和一组笔记派生出来的草稿。

创建草稿：

```bash
pnpm article:new kant-critique-pure-reason --notes=n1,n2,n3
```

草稿会进入：

```text
articles/
```

然后人工润色，再复制到公众号后台发布。

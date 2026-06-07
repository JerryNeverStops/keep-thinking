#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const [, , sourceBook, ...rest] = process.argv;

if (!sourceBook) {
  console.error('Usage: pnpm article:new <source-book-slug> --notes n1,n2,n3');
  process.exit(1);
}

const notesArg = rest.find((arg) => arg.startsWith('--notes=') || arg.startsWith('--notes'));
const notes = notesArg?.includes('=') ? notesArg.split('=')[1].split(',').filter(Boolean) : [];
const today = new Date().toISOString().slice(0, 10);
const filename = `${today}-${sourceBook}.md`;
const articleDir = path.join(process.cwd(), 'articles');
const target = path.join(articleDir, filename);

await mkdir(articleDir, { recursive: true });

if (existsSync(target)) {
  console.error(`Article already exists: ${target}`);
  process.exit(1);
}

const body = `---
sourceBook: ${sourceBook}
sourcePassage: ""
noteIds: [${notes.map((note) => `"${note}"`).join(', ')}]
channel: wechat
status: draft
style: academic
---

# 待定标题

## 问题

## 原文依据

## 概念界定

## 论证重构

## 结论

## 依据文本
`;

await writeFile(target, body, 'utf8');
console.log(`Created ${target}`);

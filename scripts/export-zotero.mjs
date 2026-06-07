#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const home = process.env.HOME;
const zoteroDb = path.join(home, 'Zotero', 'zotero.sqlite');
const tmpDir = path.join(root, 'tmp');
const backupDb = path.join(tmpDir, 'zotero-sync.sqlite');
const generatedDataPath = path.join(root, 'site', '.vitepress', 'theme', 'data', 'zotero-books.generated.ts');

const args = new Map(
  process.argv.slice(2).flatMap((arg) => {
    if (!arg.startsWith('--')) return [];
    const [key, value = 'true'] = arg.slice(2).split('=');
    return [[key, value]];
  })
);

const onlyKey = args.get('zotero-key')?.toUpperCase();
const requestedSlug = args.get('slug');
const requestedStatus = args.get('status') || 'reading';

function runSqlite(db, sql) {
  const output = execFileSync('sqlite3', ['-json', db, sql], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20
  }).trim();
  return output ? JSON.parse(output) : [];
}

function backupDatabase() {
  if (!existsSync(zoteroDb)) {
    throw new Error(`Zotero database not found at ${zoteroDb}`);
  }

  mkdirSync(tmpDir, { recursive: true });

  try {
    execFileSync('sqlite3', [zoteroDb, `.backup '${backupDb}'`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } catch (error) {
    throw new Error(
      [
        'Could not back up Zotero database. Zotero may still be running or writing.',
        'Close Zotero and run this command again.',
        error.stderr?.toString().trim()
      ]
        .filter(Boolean)
        .join('\n')
    );
  }
}

function toSlug(value, fallback) {
  const ascii = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);

  return ascii || fallback.toLowerCase();
}

function cleanCreatorName(name) {
  return name
    .replace(/^\s*[［\[]?德[］\]]?\s*/u, '')
    .replace(/^\s*[［\[]?英[］\]]?\s*/u, '')
    .replace(/^\s*[［\[]?法[］\]]?\s*/u, '')
    .trim();
}

function yamlScalar(value) {
  return JSON.stringify(value ?? '');
}

function yamlInlineList(values) {
  return `[${values.map((value) => yamlScalar(value)).join(', ')}]`;
}

function extractStorageFile(attachment) {
  if (!attachment.path?.startsWith('storage:')) return attachment.path;
  const filename = attachment.path.slice('storage:'.length);
  return path.join(home, 'Zotero', 'storage', attachment.attachmentKey, filename);
}

function sourceFormat(contentType, sourcePath) {
  if (contentType === 'application/pdf' || sourcePath.toLowerCase().endsWith('.pdf')) return 'pdf';
  return 'epub';
}

function noteTypeFromColor(color) {
  const normalized = color?.toLowerCase();
  const map = {
    '#ffd400': 'explanation',
    '#2ea8e5': 'question',
    '#a28ae5': 'concept',
    '#5fb236': 'argument',
    '#ff6666': 'connection',
    '#e56eee': 'connection'
  };
  return map[normalized] || 'explanation';
}

function typeLabel(type) {
  return {
    explanation: '解释',
    question: '问题',
    concept: '概念',
    argument: '论证',
    connection: '联想'
  }[type];
}

function hashtagsFromText(text) {
  const matches = [...(text || '').matchAll(/#([\p{Letter}\p{Number}_-]+)/gu)];
  return [...new Set(matches.map((match) => match[1]))];
}

function removeHashtags(text) {
  return (text || '').replace(/(^|\s)#[\p{Letter}\p{Number}_-]+/gu, '').trim();
}

function firstLine(text) {
  return (text || '').split(/\r?\n/).map((line) => line.trim()).find(Boolean) || '';
}

function excerptTitle(text) {
  const compact = (text || '').replace(/\s+/g, '');
  return compact.length > 22 ? `${compact.slice(0, 22)}...` : compact || '未命名批注';
}

function anchorLabel(annotation, format) {
  if (format === 'pdf' && annotation.pageLabel) return `第 ${annotation.pageLabel} 页`;
  const location = String(annotation.sortIndex || '')
    .split('|')[0]
    .replace(/^0+/, '');
  return location ? `位置 ${location}` : '原文位置';
}

function anchorCfi(annotation) {
  if (!annotation.position) return undefined;
  try {
    const position = JSON.parse(annotation.position);
    return position.value;
  } catch {
    return undefined;
  }
}

function buildMarkdown(book, notes, highlights) {
  const chunks = [`<!-- Generated from Zotero annotations. Do not edit by hand. -->\n`, `# ${book.title}\n`];

  for (const note of notes) {
    chunks.push(`## ${note.title}\n`);
    chunks.push('```note');
    chunks.push(`id: ${note.id}`);
    chunks.push(`type: ${note.type}`);
    chunks.push(`anchorLabel: ${note.anchorLabel}`);
    chunks.push(`quote: ${JSON.stringify(note.sourceExcerpt)}`);
    chunks.push(`tags: ${yamlInlineList(note.tags)}`);
    chunks.push('```\n');
    chunks.push(`${note.body}\n`);
  }

  if (highlights.length) {
    chunks.push('## 独立划线\n');
    for (const highlight of highlights) {
      chunks.push(`- ${highlight.label}：${highlight.sourceExcerpt}`);
    }
    chunks.push('');
  }

  return chunks.join('\n');
}

function jsString(value) {
  return JSON.stringify(value ?? '');
}

function writeGeneratedData(books) {
  const lines = [
    "import type { BookRecord } from './books';",
    '',
    'export const zoteroBooks: BookRecord[] = ['
  ];

  for (const book of books) {
    lines.push('  {');
    lines.push(`    slug: ${jsString(book.slug)},`);
    lines.push(`    zoteroKey: ${jsString(book.zoteroKey)},`);
    lines.push(`    title: ${jsString(book.title)},`);
    lines.push(`    author: ${jsString(book.author)},`);
    lines.push(`    translator: ${jsString(book.translator || '')},`);
    lines.push(`    language: ${jsString(book.language || 'zh')},`);
    lines.push(`    format: ${jsString(book.format)},`);
    lines.push(`    readingStatus: ${jsString(book.readingStatus)},`);
    lines.push(`    updatedAt: ${jsString(book.updatedAt)},`);
    lines.push(`    publicationEligibility: ${jsString(book.publicationEligibility)},`);
    lines.push(`    topicTags: ${JSON.stringify(book.topicTags)},`);
    lines.push(`    sourceKindLabel: ${jsString(book.sourceKindLabel)},`);
    lines.push(`    sourceFile: ${jsString(book.sourceFile)},`);
    lines.push(`    summary: ${jsString(book.summary)},`);
    lines.push(`    notes: ${JSON.stringify(book.notes, null, 6).replace(/^/gm, '    ').trim()},`);
    lines.push(`    standaloneHighlights: ${JSON.stringify(book.standaloneHighlights, null, 6).replace(/^/gm, '    ').trim()}`);
    lines.push('  },');
  }

  lines.push('];');
  lines.push('');
  writeFileSync(generatedDataPath, lines.join('\n'), 'utf8');
}

function writeBookPages(book) {
  const pageDir = path.join(root, 'site', 'books', book.slug);
  mkdirSync(pageDir, { recursive: true });

  writeFileSync(
    path.join(pageDir, 'index.md'),
    `---\nlayout: page\ntitle: ${book.title}\n---\n\n<BookOverview slug="${book.slug}" />\n`,
    'utf8'
  );

  writeFileSync(
    path.join(pageDir, 'read.md'),
    `---\nlayout: page\ntitle: 阅读${book.title}\n---\n\n<ReadingWorkspace slug="${book.slug}" />\n`,
    'utf8'
  );
}

backupDatabase();

const attachments = runSqlite(
  backupDb,
  `
  select
    a.itemID as attachmentItemID,
    ai.key as attachmentKey,
    a.parentItemID as parentItemID,
    pi.key as parentKey,
    a.path as path,
    a.contentType as contentType
  from itemAttachments a
  join items ai on ai.itemID = a.itemID
  left join items pi on pi.itemID = a.parentItemID
  where a.contentType in ('application/pdf', 'application/epub+zip')
  order by a.itemID;
  `
);

const metadataRows = runSqlite(
  backupDb,
  `
  select d.itemID, f.fieldName, v.value
  from itemData d
  join fields f on f.fieldID = d.fieldID
  join itemDataValues v on v.valueID = d.valueID;
  `
);

const creatorRows = runSqlite(
  backupDb,
  `
  select ic.itemID, c.firstName, c.lastName, ct.creatorType
  from itemCreators ic
  join creators c on c.creatorID = ic.creatorID
  join creatorTypes ct on ct.creatorTypeID = ic.creatorTypeID
  order by ic.itemID, ic.orderIndex;
  `
);

const annotationRows = runSqlite(
  backupDb,
  `
  select
    ia.itemID,
    i.key as annotationKey,
    ia.parentItemID as attachmentItemID,
    ia.type,
    ia.text,
    ia.comment,
    ia.color,
    ia.pageLabel,
    ia.sortIndex,
    ia.position
  from itemAnnotations ia
  join items i on i.itemID = ia.itemID
  order by ia.parentItemID, ia.sortIndex;
  `
);

const metadataByItem = new Map();
for (const row of metadataRows) {
  const entry = metadataByItem.get(row.itemID) || {};
  entry[row.fieldName] = row.value;
  metadataByItem.set(row.itemID, entry);
}

const creatorsByItem = new Map();
for (const row of creatorRows) {
  const creators = creatorsByItem.get(row.itemID) || [];
  creators.push(cleanCreatorName([row.firstName, row.lastName].filter(Boolean).join('')));
  creatorsByItem.set(row.itemID, creators);
}

const exportedBooks = [];

for (const attachment of attachments) {
  if (onlyKey && ![attachment.attachmentKey, attachment.parentKey].includes(onlyKey)) continue;

  const itemMetadata = metadataByItem.get(attachment.parentItemID) || metadataByItem.get(attachment.attachmentItemID) || {};
  const title = itemMetadata.title || path.basename(attachment.path || '', path.extname(attachment.path || '')) || attachment.attachmentKey;
  const authors = creatorsByItem.get(attachment.parentItemID) || [];
  const author = authors.join('、') || '未知作者';
  const sourcePath = extractStorageFile(attachment);
  const format = sourceFormat(attachment.contentType, sourcePath);
  const extension = format === 'pdf' ? '.pdf' : '.epub';
  const slug = requestedSlug || toSlug(title, `zotero-${attachment.parentKey || attachment.attachmentKey}`);
  const bookDir = path.join(root, 'books', slug);
  const publicSourceDir = path.join(root, 'site', 'public', 'sources', slug);
  const sourceFile = `source${extension}`;
  const copiedSourcePath = path.join(bookDir, sourceFile);
  const publicSourcePath = path.join(publicSourceDir, sourceFile);
  const annotations = annotationRows.filter((row) => row.attachmentItemID === attachment.attachmentItemID);
  const notes = [];
  const standaloneHighlights = [];

  mkdirSync(bookDir, { recursive: true });
  mkdirSync(publicSourceDir, { recursive: true });

  if (sourcePath && existsSync(sourcePath)) {
    copyFileSync(sourcePath, copiedSourcePath);
    copyFileSync(sourcePath, publicSourcePath);
  }

  for (const annotation of annotations) {
    const type = noteTypeFromColor(annotation.color);
    const body = removeHashtags(annotation.comment);
    const tags = hashtagsFromText(annotation.comment);
    const label = anchorLabel(annotation, format);
    const sourceExcerpt = annotation.text || '';
    const cfi = anchorCfi(annotation);

    if (!body) {
      standaloneHighlights.push({
        id: annotation.annotationKey,
        label,
        sourceExcerpt,
        anchorCfi: cfi
      });
      continue;
    }

    const titleLine = type === 'concept' ? firstLine(body) || excerptTitle(sourceExcerpt) : firstLine(body) || excerptTitle(sourceExcerpt);
    const note = {
      id: annotation.annotationKey,
      type,
      title: titleLine,
      body,
      sourceExcerpt,
      tags,
      anchorLabel: label,
      anchorCfi: cfi
    };

    if (type === 'concept') {
      note.conceptName = titleLine;
    }

    notes.push(note);
  }

  const publicationEligibility = '维护者确认该来源可公开展示。';
  const book = {
    slug,
    zoteroKey: attachment.parentKey || attachment.attachmentKey,
    title,
    author,
    translator: '',
    language: itemMetadata.language || 'zh',
    format,
    readingStatus: requestedStatus,
    updatedAt: new Date().toISOString().slice(0, 10),
    publicationEligibility,
    topicTags: [],
    sourceKindLabel: format.toUpperCase(),
    sourceFile,
    summary: `${author}《${title}》的阅读批注。`,
    notes,
    standaloneHighlights
  };

  writeFileSync(
    path.join(bookDir, 'book.yaml'),
    [
      `zoteroKey: ${book.zoteroKey}`,
      `slug: ${book.slug}`,
      `title: ${yamlScalar(book.title)}`,
      `author: ${yamlScalar(book.author)}`,
      'translator: ""',
      `language: ${yamlScalar(book.language)}`,
      `sourceFile: ${sourceFile}`,
      `format: ${format}`,
      'publicationEligibility:',
      '  type: maintainer-confirmed',
      `  note: ${yamlScalar(publicationEligibility)}`,
      'topicTags: []',
      `readingStatus: ${book.readingStatus}`,
      `summary: ${yamlScalar(book.summary)}`,
      ''
    ].join('\n'),
    'utf8'
  );

  writeFileSync(path.join(bookDir, 'notes.generated.md'), buildMarkdown(book, notes, standaloneHighlights), 'utf8');
  writeBookPages(book);
  exportedBooks.push(book);

  console.log(`Exported ${book.title} (${book.zoteroKey}) -> books/${book.slug}`);
  console.log(`  notes: ${notes.length}, standalone highlights: ${standaloneHighlights.length}`);
}

writeGeneratedData(exportedBooks);

if (!exportedBooks.length) {
  console.log('No Zotero PDF/EPUB attachments matched the current filters.');
}

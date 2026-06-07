import { zoteroBooks } from './zotero-books.generated';

export type SourceFormat = 'pdf' | 'epub';
export type ReadingStatus = 'reading' | 'paused' | 'finished';
export type NoteType = 'explanation' | 'question' | 'concept' | 'argument' | 'connection';

export interface ReadingNote {
  id: string;
  type: NoteType;
  title: string;
  body: string;
  sourceExcerpt: string;
  tags: string[];
  anchorLabel: string;
  conceptName?: string;
}

export interface StandaloneHighlight {
  id: string;
  label: string;
  sourceExcerpt: string;
}

export interface BookRecord {
  slug: string;
  zoteroKey: string;
  title: string;
  author: string;
  translator?: string;
  language: string;
  format: SourceFormat;
  readingStatus: ReadingStatus;
  updatedAt: string;
  publicationEligibility: string;
  topicTags: string[];
  summary: string;
  sourceKindLabel: string;
  sourceFile?: string;
  notes: ReadingNote[];
  standaloneHighlights: StandaloneHighlight[];
}

export const statusMeta: Record<ReadingStatus, { label: string; order: number }> = {
  reading: { label: '正在读', order: 1 },
  paused: { label: '暂停 / 搁置', order: 2 },
  finished: { label: '已读完', order: 3 }
};

export const noteTypeMeta: Record<NoteType, { label: string; color: string; tone: string }> = {
  explanation: { label: '解释', color: '#ffd84d', tone: 'explanation' },
  question: { label: '问题', color: '#89aefc', tone: 'question' },
  concept: { label: '概念', color: '#b99af5', tone: 'concept' },
  argument: { label: '论证', color: '#8ed47e', tone: 'argument' },
  connection: { label: '联想', color: '#ff99b7', tone: 'connection' }
};

const demoBooks: BookRecord[] = [
  {
    slug: 'plato-apology',
    zoteroKey: 'DEMOAPLG',
    title: '申辩篇',
    author: '柏拉图',
    language: 'zh',
    format: 'pdf',
    readingStatus: 'reading',
    updatedAt: '2026-06-07',
    publicationEligibility: '公版原典；示例数据不包含完整译文。',
    topicTags: ['古希腊哲学', '伦理学', '苏格拉底'],
    sourceKindLabel: 'PDF',
    summary: '围绕苏格拉底在审判中的自我辩护，整理哲学生活、无知之知与城邦责任之间的关系。',
    notes: [
      {
        id: 'apology-n1',
        type: 'concept',
        title: '无知之知',
        conceptName: '无知之知',
        anchorLabel: '第 18 页',
        sourceExcerpt: '苏格拉底把自己的智慧限定为知道自身并不拥有通常意义上的智慧。',
        body: '这里的关键不是谦逊姿态，而是一种认识论边界。苏格拉底把知识的名义从城邦声望中撤回，迫使听者区分“被承认为懂”和“真的知道”。',
        tags: ['苏格拉底', '认识论']
      },
      {
        id: 'apology-n2',
        type: 'argument',
        title: '审判如何变成哲学检验',
        anchorLabel: '第 24 页',
        sourceExcerpt: '答辩并没有停留在自我保护，而是转向对控诉者和城邦习俗的反问。',
        body: '论证推进有三步：先指出指控中的含混，再把含混还给控诉者，最后将个人罪责问题提升为城邦是否容许哲学追问的问题。',
        tags: ['论证结构']
      },
      {
        id: 'apology-n3',
        type: 'question',
        title: '哲学生活是否必然冲突于城邦秩序',
        anchorLabel: '第 31 页',
        sourceExcerpt: '哲学性的追问使日常确信显得不稳，也因此被理解为对秩序的威胁。',
        body: '这里的问题是：苏格拉底面对的冲突是偶然的政治误解，还是哲学活动本身必然会触及共同体的自我保护机制？',
        tags: ['政治哲学']
      }
    ],
    standaloneHighlights: [
      {
        id: 'apology-h1',
        label: '第 12 页',
        sourceExcerpt: '声望、技艺与智慧在城邦生活中被不断混同。'
      }
    ]
  },
  {
    slug: 'kant-enlightenment',
    zoteroKey: 'DEMOKANT',
    title: '什么是启蒙',
    author: '伊曼努尔·康德',
    language: 'zh',
    format: 'epub',
    readingStatus: 'paused',
    updatedAt: '2026-05-29',
    publicationEligibility: '公版原典；示例数据不包含完整译文。',
    topicTags: ['启蒙', '康德', '公共理性'],
    sourceKindLabel: 'EPUB',
    summary: '围绕启蒙、未成年状态、公共运用理性与服从之间的张力，整理康德短文中的规范结构。',
    notes: [
      {
        id: 'kant-n1',
        type: 'concept',
        title: '未成年状态',
        conceptName: '未成年状态',
        anchorLabel: '第一节',
        sourceExcerpt: '未成年状态不是年龄事实，而是放弃亲自运用理解力的状态。',
        body: '这个概念把启蒙问题从知识数量转向主体姿态。问题不是人是否拥有信息，而是他是否愿意承担判断的责任。',
        tags: ['启蒙', '主体性']
      },
      {
        id: 'kant-n2',
        type: 'explanation',
        title: '公共运用理性',
        anchorLabel: '第三节',
        sourceExcerpt: '公共运用理性指向作为学者面对公众说话的场景，而不是任意表达私人意见。',
        body: '这里容易误读。公共并不等于情绪化地对所有事务发表意见，而是把理由提交给一个可被普遍检验的读者共同体。',
        tags: ['公共理性']
      },
      {
        id: 'kant-n3',
        type: 'connection',
        title: '服从与批判的并置',
        anchorLabel: '第四节',
        sourceExcerpt: '文本同时保留制度服从和公开批判，这构成一种很紧的政治平衡。',
        body: '这可以和苏格拉底形成对照：苏格拉底以生命承担哲学追问的公共后果；康德则试图在制度秩序中划出公共批判的合法空间。',
        tags: ['政治哲学', '苏格拉底']
      }
    ],
    standaloneHighlights: [
      {
        id: 'kant-h1',
        label: '第二节',
        sourceExcerpt: '懒惰和怯懦使他人代替自己判断变得舒适。'
      }
    ]
  }
];

export const books: BookRecord[] = [...zoteroBooks, ...demoBooks];

export function getBook(slug: string): BookRecord | undefined {
  return books.find((book) => book.slug === slug);
}

export function getConceptNotes(book: BookRecord): ReadingNote[] {
  return book.notes.filter((note) => note.type === 'concept' && note.conceptName);
}

export function getNotesByType(book: BookRecord): Record<NoteType, ReadingNote[]> {
  return book.notes.reduce(
    (groups, note) => {
      groups[note.type].push(note);
      return groups;
    },
    {
      explanation: [],
      question: [],
      concept: [],
      argument: [],
      connection: []
    } as Record<NoteType, ReadingNote[]>
  );
}

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import { withBase } from 'vitepress';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Minus,
  Moon,
  PanelRightOpen,
  Plus,
  Sun
} from '@lucide/vue';
import { getBook, noteTypeMeta, type ReadingNote } from '../data/books';

const props = defineProps<{
  slug: string;
}>();

interface TocItem {
  label: string;
  href: string;
}

const annotationCss = `
  .public-annotation {
    border-radius: 3px;
    cursor: pointer;
    transition: filter 160ms ease;
  }
  .public-annotation:hover {
    filter: saturate(1.18);
  }
  .public-annotation-explanation {
    background: rgb(255 216 77 / 48%);
  }
  .public-annotation-question {
    background: rgb(137 174 252 / 42%);
  }
  .public-annotation-concept {
    background: rgb(185 154 245 / 42%);
  }
  .public-annotation-argument {
    background: rgb(142 212 126 / 42%);
  }
  .public-annotation-connection {
    background: rgb(255 153 183 / 42%);
  }
  .public-standalone-annotation {
    text-decoration-line: underline;
    text-decoration-color: rgb(174 184 173 / 92%);
    text-decoration-thickness: 2px;
    text-underline-offset: 0.18em;
  }
`;

const book = computed(() => getBook(props.slug));
const sourceUrl = computed(() => {
  if (!book.value?.sourceFile) return '';
  return withBase(`/sources/${book.value.slug}/${book.value.sourceFile}`);
});

const activeNoteId = ref<string | null>(null);
const overlayOpen = ref(false);
const fontScale = ref(1);
const darkReader = ref(false);
const toc = ref<TocItem[]>([]);
const selectedTocHref = ref('');
const locationLabel = ref('正在加载');
const readerError = ref('');
const readerReady = ref(false);
const epubContainer = ref<HTMLElement | null>(null);
const epubBook = shallowRef<any>(null);
const epubRendition = shallowRef<any>(null);

function activateNote(note: ReadingNote) {
  activeNoteId.value = note.id;
  overlayOpen.value = true;

  if (book.value?.format === 'epub' && note.anchorCfi && epubRendition.value) {
    void epubRendition.value.display(note.anchorCfi);
  }
}

function closeOverlay() {
  overlayOpen.value = false;
}

function adjustFont(delta: number) {
  fontScale.value = Math.min(1.25, Math.max(0.85, Number((fontScale.value + delta).toFixed(2))));
}

function flattenToc(items: any[] = [], depth = 0): TocItem[] {
  return items.flatMap((item) => {
    const label = `${'　'.repeat(depth)}${item.label || item.href || '未命名章节'}`;
    const current = item.href ? [{ label, href: item.href }] : [];
    return [...current, ...flattenToc(item.subitems || [], depth + 1)];
  });
}

function normalizeExcerpt(value: string) {
  return value.replace(/\s+/g, '');
}

function findExcerptElement(doc: Document, excerpt: string): HTMLElement | null {
  const needle = normalizeExcerpt(excerpt);
  if (!needle) return null;

  const probe = needle.slice(0, Math.min(needle.length, 80));
  const candidates = Array.from(doc.querySelectorAll<HTMLElement>('p, li, blockquote, div'));

  return (
    candidates
      .filter((element) => normalizeExcerpt(element.textContent || '').includes(probe))
      .sort((a, b) => (a.textContent || '').length - (b.textContent || '').length)[0] || null
  );
}

function applyEpubTheme() {
  const rendition = epubRendition.value;
  if (!rendition) return;

  rendition.themes.fontSize(`${Math.round(fontScale.value * 100)}%`);
  rendition.themes.override('font-family', '"Songti SC", "Noto Serif CJK SC", "Source Han Serif SC", STSong, serif');
  rendition.themes.override('line-height', '1.9');
  rendition.themes.override('color', darkReader.value ? '#edf3ee' : '#1d2524');
  rendition.themes.override('background', darkReader.value ? '#151a18' : '#fbfbf6');
}

function addEpubAnnotations() {
  const rendition = epubRendition.value;
  const currentBook = book.value;
  if (!rendition || !currentBook) return;

  for (const note of currentBook.notes) {
    if (!note.anchorCfi) continue;
    try {
      rendition.annotations.highlight(
        note.anchorCfi,
        { id: note.id },
        () => activateNote(note),
        `epub-annotation epub-annotation-${note.type}`,
        {
          fill: noteTypeMeta[note.type].color,
          'fill-opacity': '0.58',
          'mix-blend-mode': 'multiply'
        }
      );
    } catch {
      // Some malformed or edition-mismatched CFIs may not be renderable.
    }
  }

  for (const highlight of currentBook.standaloneHighlights) {
    if (!highlight.anchorCfi) continue;
    try {
      rendition.annotations.underline(
        highlight.anchorCfi,
        { id: highlight.id },
        undefined,
        'epub-standalone-annotation',
        {
          stroke: '#aeb8ad',
          'stroke-opacity': '0.9',
          'stroke-width': '2',
          'mix-blend-mode': 'multiply'
        }
      );
    } catch {
      // Keep the reader usable even when one exported range cannot be drawn.
    }
  }
}

function applyTextFallbackAnnotations() {
  const rendition = epubRendition.value;
  const currentBook = book.value;
  if (!rendition || !currentBook) return;

  const contents = (rendition.getContents?.() || []) as any[];

  for (const content of contents) {
    const doc = content.document as Document | undefined;
    if (!doc) continue;

    content.addStylesheetCss?.(annotationCss, 'public-reading-annotations');

    for (const note of currentBook.notes) {
      const target = findExcerptElement(doc, note.sourceExcerpt);
      if (!target) continue;
      target.classList.add('public-annotation', `public-annotation-${note.type}`);
      target.addEventListener('click', () => activateNote(note));
    }

    for (const highlight of currentBook.standaloneHighlights) {
      const target = findExcerptElement(doc, highlight.sourceExcerpt);
      if (!target) continue;
      target.classList.add('public-standalone-annotation');
    }
  }
}

async function loadEpubReader() {
  const currentBook = book.value;
  if (!currentBook || currentBook.format !== 'epub' || !sourceUrl.value || !epubContainer.value) return;

  destroyEpubReader();
  readerReady.value = false;
  readerError.value = '';
  locationLabel.value = '正在加载';

  try {
    const module = await import('epubjs');
    const ePub = module.default || module;
    const loadedBook = ePub(sourceUrl.value);
    epubBook.value = loadedBook;

    const rendition = loadedBook.renderTo(epubContainer.value, {
      width: '100%',
      height: '100%',
      flow: 'paginated',
      manager: 'default',
      spread: 'none',
      allowScriptedContent: false
    });

    epubRendition.value = rendition;
    applyEpubTheme();
    addEpubAnnotations();

    const navigation = await loadedBook.loaded.navigation;
    toc.value = flattenToc(navigation?.toc || []);
    selectedTocHref.value = toc.value[0]?.href || '';

    rendition.on('rendered', (section: any) => {
      selectedTocHref.value = section?.href || selectedTocHref.value;
      locationLabel.value = section?.label || section?.href || '当前位置';
      applyTextFallbackAnnotations();
    });

    rendition.on('relocated', (location: any) => {
      const href = location?.start?.href;
      if (href) selectedTocHref.value = href;
    });

    await rendition.display();
    applyTextFallbackAnnotations();
    readerReady.value = true;
  } catch (error) {
    readerError.value = error instanceof Error ? error.message : 'EPUB 加载失败';
  }
}

function destroyEpubReader() {
  if (epubRendition.value) {
    try {
      epubRendition.value.destroy();
    } catch {
      // No-op.
    }
  }
  if (epubBook.value) {
    try {
      epubBook.value.destroy();
    } catch {
      // No-op.
    }
  }
  epubRendition.value = null;
  epubBook.value = null;
}

async function previousPage() {
  if (book.value?.format === 'epub' && epubRendition.value) {
    await epubRendition.value.prev();
  }
}

async function nextPage() {
  if (book.value?.format === 'epub' && epubRendition.value) {
    await epubRendition.value.next();
  }
}

async function displayChapter() {
  if (!selectedTocHref.value || !epubRendition.value) return;
  await epubRendition.value.display(selectedTocHref.value);
}

watch(
  () => [book.value?.slug, sourceUrl.value],
  async () => {
    await nextTick();
    await loadEpubReader();
  },
  { immediate: true }
);

watch([fontScale, darkReader], () => {
  applyEpubTheme();
});

onBeforeUnmount(() => {
  destroyEpubReader();
});
</script>

<template>
  <main v-if="book" class="reader-shell" :class="{ 'reader-dark': darkReader }">
    <header class="reader-header">
      <a class="back-link" :href="withBase(`/books/${book.slug}/`)">
        <ArrowLeft :size="17" aria-hidden="true" />
        总览
      </a>
      <div>
        <p class="eyebrow">{{ book.sourceKindLabel }} Reading Workspace</p>
        <h1>{{ book.title }}</h1>
      </div>
      <div class="reader-actions" aria-label="阅读设置">
        <button v-if="book.format === 'epub'" type="button" class="icon-button" title="上一页" @click="previousPage">
          <ChevronLeft :size="17" aria-hidden="true" />
        </button>
        <button v-if="book.format === 'epub'" type="button" class="icon-button" title="下一页" @click="nextPage">
          <ChevronRight :size="17" aria-hidden="true" />
        </button>
        <button v-if="book.format === 'epub'" type="button" class="icon-button" title="减小字号" @click="adjustFont(-0.05)">
          <Minus :size="17" aria-hidden="true" />
        </button>
        <button v-if="book.format === 'epub'" type="button" class="icon-button" title="增大字号" @click="adjustFont(0.05)">
          <Plus :size="17" aria-hidden="true" />
        </button>
        <button type="button" class="icon-button" title="切换主题" @click="darkReader = !darkReader">
          <Sun v-if="darkReader" :size="17" aria-hidden="true" />
          <Moon v-else :size="17" aria-hidden="true" />
        </button>
      </div>
    </header>

    <section class="reader-grid" aria-label="阅读工作区">
      <div class="source-pane" :class="`source-${book.format}`">
        <div class="source-reader-toolbar">
          <div class="source-page-heading">
            <BookOpen :size="18" aria-hidden="true" />
            <span>{{ book.format === 'pdf' ? '原书页面' : '原书章节' }}</span>
          </div>

          <select
            v-if="book.format === 'epub'"
            v-model="selectedTocHref"
            class="chapter-select"
            aria-label="选择章节"
            @change="displayChapter"
          >
            <option v-if="!toc.length" value="">正在读取目录</option>
            <option v-for="item in toc" :key="item.href" :value="item.href">{{ item.label }}</option>
          </select>

          <span class="reader-location">{{ locationLabel }}</span>
        </div>

        <div v-if="book.format === 'epub' && book.sourceFile" class="epub-reader-shell">
          <div v-if="readerError" class="reader-error">
            <FileText :size="18" aria-hidden="true" />
            {{ readerError }}
          </div>
          <div ref="epubContainer" class="epub-reader-frame" :class="{ ready: readerReady }" />
        </div>

        <iframe
          v-else-if="book.format === 'pdf' && book.sourceFile"
          class="pdf-reader-frame"
          :src="sourceUrl"
          title="PDF 原书阅读器"
        />

        <div v-else class="source-page fallback-source-page" :style="{ fontSize: `${fontScale}rem` }">
          <p class="chapter-marker">{{ book.notes[0]?.anchorLabel || book.standaloneHighlights[0]?.label || '原文位置' }}</p>
          <button
            v-for="note in book.notes"
            :id="`anchor-${note.id}`"
            :key="note.id"
            type="button"
            class="inline-highlight"
            :class="[`highlight-${note.type}`, { active: activeNoteId === note.id }]"
            @click="activateNote(note)"
          >
            {{ note.sourceExcerpt }}
          </button>
          <div class="standalone-layer" aria-label="独立划线">
            <span v-for="highlight in book.standaloneHighlights" :key="highlight.id" class="standalone-mark">
              {{ highlight.sourceExcerpt }}
            </span>
          </div>
        </div>
      </div>

      <aside class="note-pane" aria-label="阅读笔记">
        <div class="note-pane-heading">
          <PanelRightOpen :size="18" aria-hidden="true" />
          <h2>批注</h2>
        </div>

        <article
          v-for="note in book.notes"
          :id="note.id"
          :key="note.id"
          class="reader-note"
          :class="[`note-${note.type}`, { active: activeNoteId === note.id }]"
          @click="activateNote(note)"
        >
          <div class="note-chip-row">
            <span class="type-chip">{{ noteTypeMeta[note.type].label }}</span>
            <span>{{ note.anchorLabel }}</span>
          </div>
          <h3>{{ note.title }}</h3>
          <blockquote>{{ note.sourceExcerpt }}</blockquote>
          <p>{{ note.body }}</p>
          <div class="tag-row">
            <span v-for="tag in note.tags" :key="tag">{{ tag }}</span>
          </div>
        </article>
      </aside>
    </section>

    <div v-if="overlayOpen && activeNoteId" class="mobile-note-overlay" role="dialog" aria-modal="true">
      <button type="button" class="overlay-backdrop" aria-label="关闭笔记" @click="closeOverlay" />
      <article
        v-for="note in book.notes.filter((item) => item.id === activeNoteId)"
        :key="note.id"
        class="overlay-note"
        :class="`note-${note.type}`"
      >
        <div class="note-chip-row">
          <span class="type-chip">{{ noteTypeMeta[note.type].label }}</span>
          <span>{{ note.anchorLabel }}</span>
        </div>
        <h2>{{ note.title }}</h2>
        <blockquote>{{ note.sourceExcerpt }}</blockquote>
        <p>{{ note.body }}</p>
        <button type="button" class="primary-action compact" @click="closeOverlay">回到原文</button>
      </article>
    </div>
  </main>

  <main v-else class="empty-state">
    <h1>没有找到这本书</h1>
  </main>
</template>

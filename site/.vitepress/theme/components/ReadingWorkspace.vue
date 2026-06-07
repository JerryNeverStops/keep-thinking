<script setup lang="ts">
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';
import { ArrowLeft, BookOpen, Minus, Moon, PanelRightOpen, Plus, Sun } from '@lucide/vue';
import { getBook, noteTypeMeta, type ReadingNote } from '../data/books';

const props = defineProps<{
  slug: string;
}>();

const book = computed(() => getBook(props.slug));
const activeNoteId = ref<string | null>(null);
const overlayOpen = ref(false);
const fontScale = ref(1);
const darkReader = ref(false);

function activateNote(note: ReadingNote) {
  activeNoteId.value = note.id;
  overlayOpen.value = true;
}

function closeOverlay() {
  overlayOpen.value = false;
}

function adjustFont(delta: number) {
  fontScale.value = Math.min(1.2, Math.max(0.9, Number((fontScale.value + delta).toFixed(2))));
}
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
        <div class="source-page" :style="{ fontSize: `${fontScale}rem` }">
          <div class="source-page-heading">
            <BookOpen :size="18" aria-hidden="true" />
            <span>{{ book.format === 'pdf' ? '原书页面' : '原书章节' }}</span>
          </div>

          <template v-if="book.format === 'pdf'">
            <p class="page-marker">{{ book.notes[0]?.anchorLabel || book.standaloneHighlights[0]?.label || '原文位置' }}</p>
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
          </template>

          <template v-else>
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
          </template>

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

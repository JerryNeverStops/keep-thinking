<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { ArrowRight, BookMarked, FileText, Hash, Search } from '@lucide/vue';
import { getBook, getConceptNotes, getNotesByType, noteTypeMeta, statusMeta, type NoteType } from '../data/books';

const props = defineProps<{
  slug: string;
}>();

const book = computed(() => getBook(props.slug));
const conceptNotes = computed(() => (book.value ? getConceptNotes(book.value) : []));
const notesByType = computed(() => (book.value ? getNotesByType(book.value) : undefined));
const noteTypes = Object.keys(noteTypeMeta) as NoteType[];
</script>

<template>
  <main v-if="book" class="overview-shell">
    <section class="book-overview-header" aria-labelledby="book-title">
      <div>
        <p class="eyebrow">{{ book.sourceKindLabel }} · {{ statusMeta[book.readingStatus].label }}</p>
        <h1 id="book-title">{{ book.title }}</h1>
        <p class="book-meta-line">
          {{ book.author }}
          <template v-if="book.translator"> · {{ book.translator }} 译</template>
        </p>
        <p class="overview-summary">{{ book.summary }}</p>
      </div>

      <a class="primary-action" :href="withBase(`/books/${book.slug}/read`)">
        <BookMarked :size="18" aria-hidden="true" />
        开始阅读
      </a>
    </section>

    <section class="overview-grid">
      <div class="overview-panel metadata-panel">
        <h2>书籍信息</h2>
        <dl class="metadata-list">
          <div>
            <dt>Zotero</dt>
            <dd>{{ book.zoteroKey }}</dd>
          </div>
          <div>
            <dt>语言</dt>
            <dd>{{ book.language }}</dd>
          </div>
          <div>
            <dt>公开依据</dt>
            <dd>{{ book.publicationEligibility }}</dd>
          </div>
          <div>
            <dt>最近更新</dt>
            <dd>{{ book.updatedAt }}</dd>
          </div>
        </dl>
      </div>

      <div class="overview-panel">
        <h2>笔记分布</h2>
        <div class="type-bars">
          <div v-for="type in noteTypes" :key="type" class="type-bar-row">
            <span>{{ noteTypeMeta[type].label }}</span>
            <div class="type-bar-track">
              <i
                :style="{
                  width: `${Math.max(((notesByType?.[type].length || 0) / Math.max(book.notes.length, 1)) * 100, notesByType?.[type].length ? 12 : 0)}%`,
                  backgroundColor: noteTypeMeta[type].color
                }"
              />
            </div>
            <strong>{{ notesByType?.[type].length || 0 }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="overview-panel concept-panel" aria-labelledby="concept-heading">
      <div class="section-title-row">
        <Hash :size="18" aria-hidden="true" />
        <h2 id="concept-heading">概念索引</h2>
      </div>

      <div class="concept-list">
        <a
          v-for="note in conceptNotes"
          :key="note.id"
          :href="withBase(`/books/${book.slug}/read#${note.id}`)"
          class="concept-chip"
        >
          {{ note.conceptName }}
        </a>
      </div>
    </section>

    <section class="overview-panel note-preview-panel" aria-labelledby="notes-heading">
      <div class="section-title-row">
        <FileText :size="18" aria-hidden="true" />
        <h2 id="notes-heading">近期批注</h2>
      </div>

      <div class="note-preview-list">
        <article v-for="note in book.notes" :key="note.id" class="note-preview" :class="`note-${note.type}`">
          <span>{{ noteTypeMeta[note.type].label }} · {{ note.anchorLabel }}</span>
          <h3>{{ note.title }}</h3>
          <p>{{ note.body }}</p>
        </article>
      </div>
    </section>

    <a class="secondary-action" :href="withBase('/search')">
      <Search :size="17" aria-hidden="true" />
      搜索全站文本
      <ArrowRight :size="17" aria-hidden="true" />
    </a>
  </main>

  <main v-else class="empty-state">
    <h1>没有找到这本书</h1>
  </main>
</template>

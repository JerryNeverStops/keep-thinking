<script setup lang="ts">
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';
import { ArrowRight, BookOpen, Library, Search } from '@lucide/vue';
import { books, statusMeta, type ReadingStatus } from '../data/books';

const query = ref('');

const normalizedQuery = computed(() => query.value.trim().toLowerCase());

const visibleBooks = computed(() => {
  if (!normalizedQuery.value) return books;
  return books.filter((book) => {
    const haystack = [
      book.title,
      book.author,
      book.summary,
      book.format,
      book.readingStatus,
      ...book.topicTags,
      ...book.notes.flatMap((note) => [note.title, note.body, note.sourceExcerpt, ...note.tags])
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery.value);
  });
});

const groupedBooks = computed(() => {
  const statuses = Object.keys(statusMeta) as ReadingStatus[];
  return statuses
    .map((status) => ({
      status,
      ...statusMeta[status],
      books: visibleBooks.value
        .filter((book) => book.readingStatus === status)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    }))
    .filter((group) => group.books.length > 0)
    .sort((a, b) => a.order - b.order);
});

const noteCount = computed(() => books.reduce((total, book) => total + book.notes.length, 0));
const conceptCount = computed(() => books.reduce((total, book) => total + book.notes.filter((note) => note.type === 'concept').length, 0));
</script>

<template>
  <main class="library-shell">
    <section class="library-intro" aria-labelledby="library-title">
      <div class="library-title-block">
        <p class="eyebrow">Public Reading Annotation</p>
        <h1 id="library-title">哲学原书批注</h1>
        <p class="library-kicker">
          以原书为中心整理阅读现场：公版与开放授权文本、批注、概念索引和可回到原文的搜索结果。
        </p>
      </div>

      <div class="library-stats" aria-label="站点统计">
        <div>
          <span>{{ books.length }}</span>
          <small>原书</small>
        </div>
        <div>
          <span>{{ noteCount }}</span>
          <small>批注</small>
        </div>
        <div>
          <span>{{ conceptCount }}</span>
          <small>概念</small>
        </div>
      </div>
    </section>

    <section class="library-toolbar" aria-label="书架筛选">
      <label class="search-field">
        <Search :size="18" aria-hidden="true" />
        <input v-model="query" type="search" placeholder="搜索书名、作者、标签或批注" />
      </label>
    </section>

    <section class="shelf-groups" aria-label="书架">
      <div v-for="group in groupedBooks" :key="group.status" class="shelf-group">
        <div class="group-heading">
          <Library :size="18" aria-hidden="true" />
          <h2>{{ group.label }}</h2>
        </div>

        <div class="book-grid">
          <article v-for="book in group.books" :key="book.slug" class="book-card">
            <div class="book-card-header">
              <span class="format-badge">{{ book.sourceKindLabel }}</span>
              <span class="date-text">{{ book.updatedAt }}</span>
            </div>
            <h3>{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>
            <p class="book-summary">{{ book.summary }}</p>
            <div class="tag-row" aria-label="主题标签">
              <span v-for="tag in book.topicTags" :key="tag">{{ tag }}</span>
            </div>
            <div class="book-card-footer">
              <span class="note-count">
                <BookOpen :size="16" aria-hidden="true" />
                {{ book.notes.length }} 条批注
              </span>
              <a class="text-link" :href="withBase(`/books/${book.slug}/`)">
                进入
                <ArrowRight :size="16" aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

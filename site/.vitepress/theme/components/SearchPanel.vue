<script setup lang="ts">
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';
import { ArrowRight, FileText, Search } from '@lucide/vue';
import { books, noteTypeMeta } from '../data/books';

const query = ref('');

const results = computed(() => {
  const needle = query.value.trim().toLowerCase();
  if (!needle) return [];

  const noteResults = books.flatMap((book) =>
    book.notes
      .filter((note) => [note.title, note.body, note.sourceExcerpt, ...note.tags].join(' ').toLowerCase().includes(needle))
      .map((note) => ({
        key: `${book.slug}-${note.id}`,
        rank: 1,
        label: noteTypeMeta[note.type].label,
        title: `${book.title} · ${note.title}`,
        excerpt: note.body,
        href: withBase(`/books/${book.slug}/read#${note.id}`)
      }))
  );

  const sourceResults = books.flatMap((book) =>
    [...book.notes.map((note) => note.sourceExcerpt), ...book.standaloneHighlights.map((highlight) => highlight.sourceExcerpt)]
      .filter((excerpt) => excerpt.toLowerCase().includes(needle))
      .map((excerpt, index) => ({
        key: `${book.slug}-source-${index}`,
        rank: 2,
        label: '原文',
        title: book.title,
        excerpt,
        href: withBase(`/books/${book.slug}/read`)
      }))
  );

  const metadataResults = books
    .filter((book) => [book.title, book.author, book.summary, ...book.topicTags].join(' ').toLowerCase().includes(needle))
    .map((book) => ({
      key: `${book.slug}-metadata`,
      rank: 3,
      label: '书籍',
      title: `${book.title} · ${book.author}`,
      excerpt: book.summary,
      href: withBase(`/books/${book.slug}/`)
    }));

  return [...noteResults, ...sourceResults, ...metadataResults].sort((a, b) => a.rank - b.rank);
});
</script>

<template>
  <main class="search-shell">
    <section class="search-header" aria-labelledby="search-title">
      <p class="eyebrow">Note-first Search</p>
      <h1 id="search-title">搜索</h1>
      <p>优先返回批注，其次返回原文片段，最后返回书籍信息。</p>
    </section>

    <label class="search-field large">
      <Search :size="20" aria-hidden="true" />
      <input v-model="query" type="search" placeholder="输入概念、作者、原文片段或标签" autofocus />
    </label>

    <section class="result-list" aria-live="polite">
      <article v-for="result in results" :key="result.key" class="search-result">
        <div class="result-meta">
          <FileText :size="16" aria-hidden="true" />
          <span>{{ result.label }}</span>
        </div>
        <h2>{{ result.title }}</h2>
        <p>{{ result.excerpt }}</p>
        <a class="text-link" :href="result.href">
          打开位置
          <ArrowRight :size="16" aria-hidden="true" />
        </a>
      </article>

      <p v-if="query && results.length === 0" class="empty-copy">没有匹配结果。</p>
    </section>
  </main>
</template>

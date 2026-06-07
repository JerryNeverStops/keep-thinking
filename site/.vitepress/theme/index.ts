import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import BookOverview from './components/BookOverview.vue';
import BookShelf from './components/BookShelf.vue';
import ReadingWorkspace from './components/ReadingWorkspace.vue';
import SearchPanel from './components/SearchPanel.vue';
import './styles.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('BookShelf', BookShelf);
    app.component('BookOverview', BookOverview);
    app.component('ReadingWorkspace', ReadingWorkspace);
    app.component('SearchPanel', SearchPanel);
  }
} satisfies Theme;

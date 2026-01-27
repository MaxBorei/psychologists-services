import { defineConfig } from 'vite';
import includeHtml from 'vite-include-html-plugin';

export default defineConfig({
  plugins: [includeHtml()],
});
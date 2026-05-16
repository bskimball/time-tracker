// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://shiftpulse.com',
  vite: {
    // @ts-expect-error - Astro/Vite plugin type mismatch in monorepo
    plugins: [tailwindcss(), tsconfigPaths()],
    ssr: {
      noExternal: ['@monorepo/design-system'],
    },
  },

  integrations: [react(), sitemap()]
});

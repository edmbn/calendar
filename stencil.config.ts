import { Config } from '@stencil/core';
import { postcss } from '@stencil/postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import atImport from 'postcss-import';

export const config: Config = {
  namespace: 'edmbn-calendar',
  plugins: [
    postcss({
      plugins: [atImport(), autoprefixer(), tailwindcss('./tailwind.config.js')],
      injectGlobalPaths: ['src/global/tailwind.pcss']
    })
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};

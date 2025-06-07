import replace from '@rollup/plugin-replace';
import { Config } from '@stencil/core';
import dotenv from 'dotenv';

dotenv.config();
// Stencil configuration file for the search-gif-stencil component library
export const config: Config = {
  namespace: 'search-gif-stencil',
  plugins: [
    replace({
      // Variables que quieres inyectar
      preventAssignment: true,
      values: {
        'import.meta.env.API_URL': JSON.stringify(process.env.API_URL || 'https://api.default.com'),
        'import.meta.env.API_KEY': JSON.stringify(process.env.API_KEY || 'dev-key'),
      },
    }),
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: 'shell',
  },
};

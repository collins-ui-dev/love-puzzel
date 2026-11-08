import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps image and music paths working wherever the built site is hosted.
export default defineConfig({
  base: './',
  plugins: [react()],
});

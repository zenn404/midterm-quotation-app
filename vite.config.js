import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/midterm-quotation-app/', // <-- Make sure this line is present and correct
});
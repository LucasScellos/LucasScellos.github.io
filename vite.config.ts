import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { agentContent } from './scripts/agentContent';

// User site (LucasScellos.github.io) is served from the domain root.
export default defineConfig({
  base: '/',
  plugins: [react(), agentContent()],
});

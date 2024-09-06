import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),  // This is correct
            name: 'AntdWeeklyCalendar',
            fileName: (format) => `antd-weekly-calendar.${format}.js`,
            formats: ['es', 'umd'],  // Library output formats
        },
        rollupOptions: {
            external: ['react', 'react-dom'],  // Peer dependencies
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
        emptyOutDir: false,  // Prevent Vite from clearing the output directory
    },
});

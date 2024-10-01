import { TailwindConfig } from '@/ui-tailwind';
import { scanModule } from '@/ui-tailwind/scanModule';

// keeping this import for working HMR in Vite ??????
// import { TailwindConfig } from '../../../packages/tailwind/tailwind.config';

export default {
  darkMode: TailwindConfig.darkMode,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',

    scanModule('@/client-base', 'ui/**/*.{js,ts,jsx,tsx}'),
    scanModule('plate-editor', 'src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: TailwindConfig.theme,
};

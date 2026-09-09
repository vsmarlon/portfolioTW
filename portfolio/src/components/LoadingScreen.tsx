import { useTheme } from '../contexts/ThemeContext';
import { useLocale } from '../contexts/LocaleContext';

const LoadingScreen = () => {
  const { theme } = useTheme();
  const { t } = useLocale();
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'dark' ? 'bg-[#131110]' : 'bg-[#faf6ef]'
    }`}>
      <div className={`flex flex-col items-center gap-4 border-[3px] px-8 py-6 ${
        theme === 'dark' ? 'border-stone-100 bg-[#131110]' : 'border-stone-900 bg-[#fffdf8]'
      }`}>
        <div className={`h-12 w-12 border-4 animate-spin ${
          theme === 'dark'
            ? 'border-stone-100/30 border-t-fuchsia-200'
            : 'border-stone-900/30 border-t-[#a1006b]'
        }`}></div>
        <p className={`font-mono text-sm font-semibold uppercase tracking-[0.16em] ${
          theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
        }`}>{t('blog.demoLoading')}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen = () => {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-zinc-200'
    }`}>
      <div className={`flex flex-col items-center gap-4 border-3 px-8 py-6 ${
        theme === 'dark' ? 'border-white bg-black' : 'border-black bg-white'
      }`}>
        <div className={`h-12 w-12 border-4 animate-spin ${
          theme === 'dark'
            ? 'border-white/30 border-t-cyan-400'
            : 'border-black/30 border-t-cyan-400'
        }`}></div>
        <p className={`text-sm font-semibold uppercase tracking-[0.16em] ${
          theme === 'dark' ? 'text-white/80' : 'text-black/80'
        }`}>Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

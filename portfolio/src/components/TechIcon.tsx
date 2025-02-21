import { useState } from 'react';
import type { TechnologyIconName } from '../data/hero';

type TechIconProps = {
  name: TechnologyIconName;
  label: string;
  className?: string;
};

const iconMap: Record<TechnologyIconName, string> = {
  html: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
  css: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
  javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
  react: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  tailwindcss: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
  flutter: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg',
  python: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  redis: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',
  docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
  git: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
};

const fallbackMap: Record<TechnologyIconName, { short: string; bg: string; text: string }> = {
  html: { short: 'H', bg: 'bg-orange-100 dark:bg-orange-500/15', text: 'text-orange-600 dark:text-orange-300' },
  css: { short: 'C', bg: 'bg-blue-100 dark:bg-blue-500/15', text: 'text-blue-600 dark:text-blue-300' },
  javascript: { short: 'JS', bg: 'bg-yellow-100 dark:bg-yellow-500/15', text: 'text-yellow-700 dark:text-yellow-300' },
  typescript: { short: 'TS', bg: 'bg-sky-100 dark:bg-sky-500/15', text: 'text-sky-700 dark:text-sky-300' },
  react: { short: 'R', bg: 'bg-cyan-100 dark:bg-cyan-500/15', text: 'text-cyan-700 dark:text-cyan-300' },
  tailwindcss: { short: 'TW', bg: 'bg-cyan-100 dark:bg-cyan-500/15', text: 'text-cyan-700 dark:text-cyan-300' },
  flutter: { short: 'F', bg: 'bg-sky-100 dark:bg-sky-500/15', text: 'text-sky-700 dark:text-sky-300' },
  python: { short: 'Py', bg: 'bg-amber-100 dark:bg-amber-500/15', text: 'text-amber-700 dark:text-amber-300' },
  postgresql: { short: 'PG', bg: 'bg-indigo-100 dark:bg-indigo-500/15', text: 'text-indigo-700 dark:text-indigo-300' },
  redis: { short: 'Re', bg: 'bg-rose-100 dark:bg-rose-500/15', text: 'text-rose-700 dark:text-rose-300' },
  docker: { short: 'D', bg: 'bg-blue-100 dark:bg-blue-500/15', text: 'text-blue-700 dark:text-blue-300' },
  git: { short: 'G', bg: 'bg-orange-100 dark:bg-orange-500/15', text: 'text-orange-700 dark:text-orange-300' },
};

const TechIcon = ({ name, label, className }: TechIconProps) => {
  const [hasError, setHasError] = useState(false);
  const fallback = fallbackMap[name];

  if (hasError) {
    return (
      <div
        aria-label={label}
        role="img"
        className={`flex items-center justify-center rounded-lg font-bold ${fallback.bg} ${fallback.text} ${className ?? ''}`}
      >
        <span className="text-[0.7rem] uppercase tracking-[0.08em]">{fallback.short}</span>
      </div>
    );
  }

  return (
    <img
      src={iconMap[name]}
      alt={label}
      loading="lazy"
      decoding="async"
      width={40}
      height={40}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
};

export default TechIcon;

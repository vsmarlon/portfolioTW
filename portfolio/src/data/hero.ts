export type TechnologyIconName =
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'tailwindcss'
  | 'flutter'
  | 'python'
  | 'postgresql'
  | 'redis'
  | 'docker'
  | 'git';

export const technologies = [
  { name: 'HTML5', icon: 'html' as const },
  { name: 'CSS3', icon: 'css' as const },
  { name: 'JavaScript', icon: 'javascript' as const },
  { name: 'TypeScript', icon: 'typescript' as const },
  { name: 'React', icon: 'react' as const },
  { name: 'Tailwind CSS', icon: 'tailwindcss' as const },
  { name: 'Flutter', icon: 'flutter' as const },
  { name: 'Python', icon: 'python' as const },
  { name: 'PostgreSQL', icon: 'postgresql' as const },
  { name: 'Redis', icon: 'redis' as const },
  { name: 'Docker', icon: 'docker' as const },
  { name: 'Git', icon: 'git' as const },
];

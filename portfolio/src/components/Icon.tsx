import type { ReactNode, SVGProps } from 'react';
import type { IconName } from '../types/icons';

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

const commonProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeWidth: 1.8,
  viewBox: '0 0 24 24',
};

const paths: Record<IconName, ReactNode> = {
  'arrow-left': <path d="M19 12H5m7-7-7 7 7 7" />,
  'arrow-right': <path d="M5 12h14m-7-7 7 7-7 7" />,
  bars: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  cogs: (
    <>
      <rect x="4" y="6" width="6" height="6" rx="1.5" />
      <rect x="14" y="6" width="6" height="6" rx="1.5" />
      <rect x="9" y="16" width="6" height="4" rx="1.5" />
      <path d="M7 12v2.5a1.5 1.5 0 0 0 1.5 1.5H12" />
      <path d="M17 12v2.5a1.5 1.5 0 0 1-1.5 1.5H12" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  envelope: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  'external-link': (
    <>
      <path d="M14 5h5v5" />
      <path d="M10 14 19 5" />
      <path d="M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
    </>
  ),
  github: <path d="M9 19c-4.5 1.4-4.5-2.5-6-3m12 6v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6.3A4.9 4.9 0 0 0 18.7 7 4.5 4.5 0 0 0 18.6 4S17.5 3.7 15 5.3a13.3 13.3 0 0 0-6 0C6.5 3.7 5.4 4 5.4 4a4.5 4.5 0 0 0-.1 3A4.9 4.9 0 0 0 4 10.2c0 4.9 2.7 6 5.5 6.3-.6.6-.6 1.2-.5 2V22" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  heart: <path d="m12 20-1.4-1.3C5.4 14 2 10.9 2 7.1 2 4.4 4.2 2 7 2c1.6 0 3.1.7 4 1.9C11.9 2.7 13.4 2 15 2c2.8 0 5 2.4 5 5.1 0 3.8-3.4 6.9-8.6 11.6Z" />,
  home: <path d="m3 11 9-8 9 8M5 10v10h14V10" />,
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2" />
      <rect x="2" y="9" width="4" height="12" rx="1" />
      <circle cx="4" cy="4" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
  'paper-plane': <path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />,
  pen: (
    <>
      <path d="m12 20 8-8-4-4-8 8-1 5 5-1Z" />
      <path d="m14 6 4 4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="2" />
      <rect x="4" y="14" width="16" height="6" rx="2" />
      <path d="M8 7h.01M8 17h.01M12 7h6M12 17h6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m7 9 3 3-3 3" />
      <path d="M13 15h4" />
    </>
  ),
  tachometer: (
    <>
      <path d="M4 16a8 8 0 1 1 16 0" />
      <path d="m12 12 4-4" />
      <path d="M12 16h.01" />
    </>
  ),
};

const Icon = ({ name, className, ...props }: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="1em"
      height="1em"
      {...commonProps}
      {...props}
    >
      {paths[name]}
    </svg>
  );
};

export default Icon;

import type { ReactNode } from 'react';
import { UI_CLASSES } from '../../constants/ui';
import { classNames } from '../../utils/classNames';

interface StatusPillProps {
  children: ReactNode;
  className?: string;
}

const StatusPill = ({ children, className }: StatusPillProps) => (
  <span className={classNames(UI_CLASSES.statusPill, className)}>{children}</span>
);

export default StatusPill;


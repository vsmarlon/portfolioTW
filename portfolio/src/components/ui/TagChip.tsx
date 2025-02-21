import type { ReactNode } from 'react';
import { UI_CLASSES } from '../../constants/ui';
import { classNames } from '../../utils/classNames';

interface TagChipProps {
  children: ReactNode;
  className?: string;
}

const TagChip = ({ children, className }: TagChipProps) => (
  <span className={classNames(UI_CLASSES.tagChip, className)}>{children}</span>
);

export default TagChip;


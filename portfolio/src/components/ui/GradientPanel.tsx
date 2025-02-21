import type { ReactNode } from 'react';
import { UI_CLASSES } from '../../constants/ui';
import { classNames } from '../../utils/classNames';

interface GradientPanelProps {
  children: ReactNode;
  className?: string;
}

const GradientPanel = ({ children, className }: GradientPanelProps) => (
  <div className={classNames(UI_CLASSES.gradientPanel, className)}>{children}</div>
);

export default GradientPanel;


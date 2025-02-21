import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { UI_CLASSES } from '../../constants/ui';
import { classNames } from '../../utils/classNames';

type SurfaceCardVariant = 'default' | 'strong' | 'muted';

const SURFACE_VARIANT_CLASS: Record<SurfaceCardVariant, string> = {
  default: UI_CLASSES.surfaceCard,
  strong: UI_CLASSES.surfaceCardStrong,
  muted: UI_CLASSES.surfaceCardMuted,
};

interface SurfaceCardProps extends ComponentPropsWithoutRef<'div'> {
  variant?: SurfaceCardVariant;
}

const SurfaceCard = forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ children, className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={classNames(SURFACE_VARIANT_CLASS[variant], className)}
      {...props}
    >
      {children}
    </div>
  ),
);

SurfaceCard.displayName = 'SurfaceCard';

export default SurfaceCard;

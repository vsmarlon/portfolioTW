import Icon from './Icon';

// "Opens outside the portfolio" signal for target=_blank links.
// Decorative icon plus screen-reader text; the visible label already
// names the destination, so sighted users just get the extra glyph.
const ExternalMark = ({ className = 'text-xs opacity-70' }: { className?: string }) => (
  <>
    <Icon name="external-link" className={className} />
    <span className="sr-only">(abre em nova aba)</span>
  </>
);

export default ExternalMark;

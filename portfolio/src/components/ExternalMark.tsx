import Icon from './Icon';

// "Opens outside the portfolio" signal for target=_blank links.
// Decorative icon plus screen-reader text; the visible label already
// names the destination, so sighted users just get the extra glyph.
const ExternalMark = ({
  className = 'text-[15px] leading-none',
  label = 'abre em nova aba',
}: {
  className?: string;
  label?: string;
}) => (
  <>
    <Icon name="external-link" className={`inline-block shrink-0 align-[-0.12em] ${className}`} />
    <span className="sr-only">({label})</span>
  </>
);

export default ExternalMark;

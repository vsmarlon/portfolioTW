import { socialLinks } from '../data/contact';
import Icon from './Icon';

const Footer = () => {
  return (
    <footer className="ui-divider-strong relative z-10 border-t bg-zinc-100/50 py-8 text-sm dark:bg-slate-900/80 md:text-base">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-black dark:border-white bg-cyan-400 text-black font-bold text-sm">
              M
            </div>
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Marlon Vargas
            </span>
          </div>

          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-500 transition-colors"
                aria-label={link.label}
              >
                <Icon name={link.icon} className="text-lg" />
              </a>
            ))}
          </div>

          <p className="text-slate-500 dark:text-slate-500 font-medium">
            Desenvolvido com <Icon name="heart" className="mx-1 inline text-cyan-500" /> em 2024
          </p>
        </div>

        <div className="ui-divider-soft mt-4 border-t pt-4 text-center">
          <p className="text-slate-400 dark:text-slate-600 text-xs tracking-wider uppercase">
            &copy; {new Date().getFullYear()} Marlon Vargas. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { socialLinks } from '../data/contact';
import Icon from './Icon';

const Footer = () => {
  return (
    <footer className="relative z-10 border-t-2 border-stone-900/20 bg-[#fffdf8] py-8 text-sm dark:border-stone-100/20 dark:bg-[#131110] md:text-base">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-stone-900 bg-[#a1006b] text-[#fff7fb] font-bold text-sm dark:border-stone-100 dark:bg-[#ec7cc3] dark:text-[#1c0a14]">
              M
            </div>
            <span className="text-stone-700 dark:text-stone-300 font-medium">
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
                 className="focus-ring text-stone-700 hover:text-[#a1006b] dark:text-stone-300 dark:hover:text-fuchsia-200 transition-colors"
                aria-label={link.label}
              >
                <Icon name={link.icon} className="text-lg" />
              </a>
            ))}
          </div>

           <p className="text-stone-700 dark:text-stone-300 font-medium">
            Desenvolvido com <Icon name="heart" className="mx-1 inline text-[#a1006b] dark:text-fuchsia-200" /> em 2024
          </p>
        </div>

        <div className="mt-4 border-t border-stone-900/15 pt-4 text-center dark:border-stone-100/15">
           <p className="text-stone-600 dark:text-stone-400 text-xs tracking-wider uppercase">
            &copy; {new Date().getFullYear()} Marlon Vargas. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

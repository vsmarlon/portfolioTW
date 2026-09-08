import { Link } from 'react-router-dom';
import { notFoundQuickLinks } from '../data/notFound';
import Icon from './Icon';

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center px-4 pb-12 pt-28 md:px-8 lg:px-16">
      <section className="card-interactive mx-auto flex w-full max-w-5xl flex-col gap-8 overflow-hidden border-[3px] border-stone-900 bg-[#fffdf8] p-6 dark:border-stone-100 dark:bg-[#131110] md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex w-fit items-center gap-2 border-2 border-stone-900 bg-[#a1006b] px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#fff7fb] dark:border-fuchsia-200/60 dark:bg-[#ec7cc3] dark:text-[#1c0a14]">
              <span className="h-2 w-2 bg-[#fff7fb] dark:bg-[#1c0a14]"></span>
              Erro 404
            </p>
            <h1 className="font-display text-4xl font-black leading-none text-stone-900 dark:text-stone-100 md:text-6xl">
              Essa rota saiu do mapa.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-stone-700 dark:text-stone-300 md:text-base">
              A página que você tentou abrir não existe mais, foi movida ou o link chegou quebrado.
              O portfólio continua por aqui.
            </p>
          </div>

           <div className="grid min-w-[220px] gap-2 border-l-2 border-stone-900/25 pl-4 text-sm text-stone-800 dark:border-stone-100/25 dark:text-stone-200">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
              status
            </span>
            <span className="font-mono">request: not_found</span>
            <span className="font-mono">hint: use one of the safe links below</span>
          </div>
        </div>

         <div className="relative overflow-hidden border-y-2 border-stone-900/20 py-6 dark:border-stone-100/20 md:py-8">
          <div className="relative grid gap-3 md:grid-cols-3">
            {notFoundQuickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                 className="focus-ring flex items-center justify-between border-2 border-stone-900/25 px-4 py-4 text-stone-900 transition-colors duration-200 hover:border-[#a1006b] hover:text-[#a1006b] dark:border-stone-100/25 dark:text-stone-100 dark:hover:border-fuchsia-200 dark:hover:text-fuchsia-200"
              >
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <Icon name={link.icon} />
                  {link.label}
                </span>
                <Icon name="arrow-right" className="text-[#a1006b] dark:text-fuchsia-200" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;

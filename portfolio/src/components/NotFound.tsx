import { Link } from 'react-router-dom';
import { notFoundQuickLinks } from '../data/notFound';
import Icon from './Icon';

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center px-4 pb-12 pt-28 md:px-8 lg:px-16">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 overflow-hidden border-4 border-black dark:border-white bg-cyan-400/20 dark:bg-black p-6 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex w-fit items-center gap-2 border-2 border-black dark:border-cyan-400 bg-cyan-400 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-black dark:bg-black dark:text-cyan-400">
              <span className="h-2 w-2 bg-black dark:bg-cyan-400"></span>
              Erro 404
            </p>
            <h1 className="text-4xl font-black leading-none text-black dark:text-white md:text-6xl">
              Essa rota saiu do mapa.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-black/80 dark:text-white/80 md:text-base">
              A página que você tentou abrir não existe mais, foi movida ou o link chegou quebrado.
              O portfólio continua por aqui.
            </p>
          </div>

          <div className="grid min-w-[220px] gap-2 border-2 border-black dark:border-white bg-white dark:bg-black p-4 text-sm text-black dark:text-white">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/60 dark:text-white/60">
              status
            </span>
            <span>request: not_found</span>
            <span>hint: use one of the safe links below</span>
          </div>
        </div>

        <div className="relative overflow-hidden border-2 border-black dark:border-white bg-white dark:bg-black p-6 md:p-8">
          <div className="relative grid gap-3 md:grid-cols-3">
            {notFoundQuickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center justify-between border-2 border-black dark:border-white bg-white dark:bg-black px-4 py-4 text-black dark:text-white transition-colors duration-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
              >
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <Icon name={link.icon} />
                  {link.label}
                </span>
                <Icon name="arrow-right" className="text-cyan-400 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;

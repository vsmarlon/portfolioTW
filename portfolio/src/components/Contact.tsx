import { contactHighlights, contactLinks } from '../data/contact';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Icon from './Icon';

const highlightRowClassName =
  'flex flex-col gap-2 border-b-2 border-black/20 py-4 last:border-b-0 dark:border-white/20 sm:flex-row sm:items-start sm:justify-between';

const contactMetaClassName =
  'flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between';

const ContactHighlightRow = ({ label, value }: { label: string; value: string }) => (
  <div className={highlightRowClassName}>
    <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/60 dark:text-white/60">
      {label}
    </span>
    <span className="max-w-xs text-sm leading-6 font-medium text-black dark:text-white sm:text-right">
      {value}
    </span>
  </div>
);

const ContactChannelRow = ({
  type,
  href,
  label,
  value,
  description,
  actionLabel,
  icon,
  iconBg,
  iconColor,
}: (typeof contactLinks)[number]) => (
  <a
    href={href}
    target={type === 'email' ? undefined : '_blank'}
    rel={type === 'email' ? undefined : 'noopener noreferrer'}
    className="group block py-5 transition-all duration-200 first:pt-0 last:pb-0 hover:translate-x-1"
  >
    <div className="flex gap-4">
      <div className={`mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black dark:border-white ${iconBg} transition-colors duration-200`}>
        <Icon name={icon} className={`${iconColor} text-xl`} />
      </div>

      <div className="min-w-0 flex-1 text-left">
        <div className={contactMetaClassName}>
          <div className="min-w-0">
            <span className="block text-sm font-bold uppercase tracking-[0.18em] text-black/60 dark:text-white/60">
              {label}
            </span>
            <span className="mt-2 block break-words text-base font-semibold text-black dark:text-white">
              {value}
            </span>
          </div>

          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black dark:text-cyan-400 sm:text-right">
            {actionLabel}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-black/80 dark:text-white/80">{description}</p>
      </div>
    </div>
  </a>
);

const Contact = () => {
  const reveal = useScrollReveal();

  return (
    <section id="contact" className="py-24 relative">
      <div ref={reveal} className="reveal container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="relative border-4 border-black dark:border-white bg-cyan-400 dark:bg-slate-900 p-6 md:p-10 lg:p-12">

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 border-2 border-black bg-green-400 dark:bg-green-500 dark:border-white px-4 py-1.5 text-sm font-bold text-black dark:text-white">
                <span className="inline-block h-2 w-2 bg-black dark:bg-white animate-pulse"></span>
                Disponível para oportunidades e projetos
              </div>

              <h2 className="mt-6 text-3xl font-bold text-black dark:text-white md:text-5xl">
                Contato que vira <span className="text-black dark:text-cyan-400">conversa boa</span>, não mensagem perdida.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-black dark:text-white">
                Se você procura alguém para construir interfaces com mais cuidado visual, performance
                percebida e pensamento de produto, estou aberto para conversar sobre vagas, freelas e
                colaborações com escopo claro.
              </p>

              <div className="mt-8 border-2 border-black dark:border-white bg-white dark:bg-black px-5 py-2">
                {contactHighlights.map((item) => (
                  <ContactHighlightRow key={item.label} {...item} />
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:vsmarlonvargas@gmail.com?subject=Vamos%20conversar%20sobre%20uma%20oportunidade"
                  className="inline-flex items-center justify-center gap-2 border-3 border-black bg-black dark:bg-white px-8 py-4 font-bold text-white dark:text-black transition-colors duration-200 hover:bg-cyan-400 hover:text-black dark:hover:bg-cyan-400 dark:hover:text-black"
                >
                  <Icon name="paper-plane" />
                  Falar por email
                </a>
                <a
                  href="https://www.linkedin.com/in/marlon-vargas-917618223/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border-3 border-black bg-white dark:bg-black dark:border-white px-8 py-4 font-bold text-black dark:text-white transition-colors duration-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  <Icon name="linkedin" />
                  Chamar no LinkedIn
                </a>
              </div>
            </div>

            <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-5 md:p-6">
              <div className="flex items-start justify-between gap-4 border-b-2 border-black dark:border-white pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black dark:text-cyan-400">
                    Canais diretos
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-black dark:text-white">
                    Escolha o melhor ponto de contato
                  </h3>
                </div>
                <div className="border-2 border-black dark:border-cyan-400 bg-cyan-400 dark:bg-black px-3 py-2 text-right text-xs font-semibold uppercase tracking-[0.18em] text-black dark:text-cyan-400">
                  Resposta rápida
                </div>
              </div>

              <div className="mt-5 divide-y-2 divide-black dark:divide-white">
                {contactLinks.map((link) => (
                  <ContactChannelRow key={link.type} {...link} />
                ))}
              </div>

              <div className="mt-5 border-2 border-dashed border-black dark:border-cyan-400 bg-cyan-400/20 dark:bg-cyan-400/10 px-4 py-4 text-sm leading-6 text-black dark:text-white font-medium">
                Prefere chegar com contexto? Me manda a stack, objetivo e prazo desejado. Isso acelera bastante a conversa.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

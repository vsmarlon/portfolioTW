import { contactHighlights, contactLinks } from '../data/contact';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ExternalMark from './ExternalMark';
import Icon from './Icon';

const highlightRowClassName =
  'flex flex-col gap-2 border-b border-stone-900/15 py-4 last:border-b-0 dark:border-stone-100/15 sm:flex-row sm:items-start sm:justify-between';

const contactMetaClassName =
  'flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between';

const ContactHighlightRow = ({ label, value }: { label: string; value: string }) => (
  <div className={highlightRowClassName}>
    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-stone-600 dark:text-stone-300">
      {label}
    </span>
    <span className="max-w-xs text-sm leading-6 font-medium text-stone-900 dark:text-stone-100 sm:text-right">
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
    className="card-interactive focus-ring group block border border-stone-900/15 bg-white/60 p-4 dark:border-stone-100/15 dark:bg-white/[0.03]"
  >
    <div className="flex gap-4">
      <div className={`mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center border-2 border-stone-900 dark:border-stone-100 ${iconBg} transition-colors duration-200`}>
        <Icon name={icon} className={`${iconColor} text-xl`} />
      </div>

      <div className="min-w-0 flex-1 text-left">
        <div className={contactMetaClassName}>
          <div className="min-w-0">
            <span className="block font-mono text-xs font-bold uppercase tracking-[0.18em] text-stone-600 dark:text-stone-300">
              {label}
            </span>
            <span className="mt-2 block break-all text-base font-semibold text-stone-900 dark:text-stone-100">
              {value}
            </span>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 border border-stone-900/20 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#73004c] dark:border-stone-100/20 dark:text-fuchsia-200 sm:text-right">
            {actionLabel}
            {type !== 'email' ? <ExternalMark /> : null}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-stone-700 dark:text-stone-300">{description}</p>
      </div>
    </div>
  </a>
);

const Contact = () => {
  const reveal = useScrollReveal();

  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div ref={reveal} className="reveal card-interactive relative border-[3px] border-stone-900 bg-[#fffdf8] p-6 dark:border-stone-100 dark:bg-[#131110] md:p-10 lg:p-12">

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="text-left">
              <p className="eyebrow">Contato</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100 md:text-5xl">
                Direto ao ponto.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700 dark:text-stone-300">
                Interface, backend e dados como um sistema só. Me mande stack, objetivo e prazo.
              </p>

               <div className="mt-8 border-2 border-stone-900/25 px-5 py-2 dark:border-stone-100/25">
                {contactHighlights.map((item) => (
                  <ContactHighlightRow key={item.label} {...item} />
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:vsmarlonvargas@gmail.com?subject=Vamos%20conversar%20sobre%20uma%20oportunidade"
                  className="focus-ring inline-flex items-center justify-center gap-2 border-2 border-stone-900 bg-stone-900 px-8 py-4 font-bold text-[#faf6ef] transition-all duration-200 hover:bg-[#a1006b] hover:border-[#73004c] dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-[#ec7cc3] dark:hover:text-[#1c0a14]"
                >
                  <Icon name="paper-plane" />
                  Falar por email
                </a>
                <a
                  href="https://www.linkedin.com/in/marlon-vargas-917618223/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center justify-center gap-2 border-2 border-stone-900 bg-transparent px-8 py-4 font-bold text-stone-900 transition-all duration-200 hover:border-[#a1006b] hover:text-[#a1006b] dark:border-stone-100 dark:text-stone-100 dark:hover:border-fuchsia-200 dark:hover:text-fuchsia-200"
                >
                  <Icon name="linkedin" />
                  Chamar no LinkedIn
                </a>
              </div>

              <div ref={reveal} className="reveal mt-8 border-2 border-stone-900/20 p-5 dark:border-stone-100/20">
                <p className="eyebrow">Método</p>
                <h3 className="mt-2 text-xl font-bold text-stone-900 dark:text-stone-100">Como trabalho</h3>
                <ol className="mt-4 space-y-3">
                  {[
                    ['Escopo', 'Problema, restrições e critérios de aceite antes de qualquer código.'],
                    ['Proposta', 'Desenho técnico, fronteiras e estimativa explícita.'],
                    ['Entrega', 'Implementação testada e documentada, sem caixa-preta.'],
                  ].map(([title, text], index) => (
                    <li key={title} className="flex gap-3 text-sm leading-6 text-stone-700 dark:text-stone-300">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-stone-900/30 font-mono text-xs font-bold text-[#73004c] dark:border-stone-100/30 dark:text-fuchsia-200">{index + 1}</span>
                      <span><strong className="text-stone-900 dark:text-stone-100">{title}: </strong>{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

             <div className="border-t-2 border-stone-900/20 pt-6 dark:border-stone-100/20 lg:border-l-2 lg:border-t-0 lg:pl-6 lg:pt-0">
              <div className="flex items-start justify-between gap-4 border-b-2 border-stone-900/20 pb-5 dark:border-stone-100/20">
                <div>
                  <p className="eyebrow">
                    Canais diretos
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-stone-900 dark:text-stone-100">
                    Escolha o melhor ponto de contato
                  </h3>
                </div>
                <div className="shrink-0 border-2 border-stone-900 bg-[#a1006b] px-3 py-2 text-right font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#fff7fb] dark:border-fuchsia-200/60 dark:bg-[#ec7cc3] dark:text-[#1c0a14]">
                  Resposta rápida
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {contactLinks.map((link, index) => (
                  <div key={link.type} ref={reveal} className="reveal" style={{ transitionDelay: `${index * 90}ms` }}>
                    <ContactChannelRow {...link} />
                  </div>
                ))}
              </div>

               <div className="mt-5 border-2 border-dashed border-stone-900/30 bg-stone-900/[0.03] px-4 py-4 text-sm leading-6 font-medium text-stone-700 dark:border-stone-100/25 dark:bg-white/[0.03] dark:text-stone-300">
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

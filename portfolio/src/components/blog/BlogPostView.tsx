import { Fragment, Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import rehypeHighlight from 'rehype-highlight';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLocation } from 'react-router-dom';
import type { BlogPost } from '../../types/blog';
import StatusPill from '../ui/StatusPill';
import SurfaceCard from '../ui/SurfaceCard';
import TagChip from '../ui/TagChip';

const LazyGitHubRepoExplorer = lazy(() => import('./GitHubRepoExplorer'));
const DEMO_MARKER = '[[DEMO_GITHUB_REPOS]]';

const markdownComponents = {
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="mt-12 text-3xl font-black text-black first:mt-0 dark:text-white">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-10 text-2xl font-black text-black dark:text-white">{children}</h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mt-8 text-xl font-bold text-black dark:text-white">{children}</h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mt-5 text-sm leading-7 text-black/90 dark:text-white/85 md:text-base">
      {children}
    </p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mt-5 space-y-3 text-sm text-black/90 dark:text-white/85 md:text-base">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm text-black/90 dark:text-white/85 md:text-base">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="leading-7 marker:text-cyan-400">{children}</li>
  ),
  code: ({ children, className }: { children?: ReactNode; className?: string }) =>
    className ? (
      <code className={`code-block ${className}`}>{children}</code>
    ) : (
      <code className="border border-cyan-400 bg-slate-950/90 px-1.5 py-1 font-mono text-[0.9em] text-cyan-300">
        {children}
      </code>
    ),
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="code-block-pre mt-5 overflow-x-auto border-2 border-black bg-slate-950 p-4 text-sm text-slate-100 dark:border-white">
      {children}
    </pre>
  ),
  a: ({ children, href }: { children?: ReactNode; href?: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-cyan-600 underline decoration-cyan-400/40 underline-offset-4 transition-colors duration-200 hover:text-cyan-400 dark:text-cyan-400"
    >
      {children}
    </a>
  ),
};

const BlogPostView = ({ post }: { post: BlogPost }) => {
  const contentChunks = post.body.split(DEMO_MARKER);

  return (
    <article className="ui-border-strong border-3 border-black dark:border-white bg-white dark:bg-black p-6 md:p-8">
      <header className="ui-divider-soft border-b pb-8">
        <div className="flex flex-wrap items-center gap-2 pb-1 text-xs font-semibold uppercase tracking-[0.18em]">
          <StatusPill>{post.category}</StatusPill>
          <span className="text-cyan-600 dark:text-cyan-400 whitespace-nowrap">|</span>
          <span className="border border-cyan-400 bg-cyan-400/15 px-2 py-1 text-black dark:text-cyan-300 whitespace-nowrap">
            {post.formattedDate}
          </span>
          <span className="text-cyan-600 dark:text-cyan-400 whitespace-nowrap">|</span>
          <span className="border border-black/40 dark:border-white/40 bg-white/70 dark:bg-black px-2 py-1 text-black dark:text-white whitespace-nowrap">
            {post.readTime}
          </span>
          {post.hasDemo ? (
            <>
              <span className="text-cyan-600 dark:text-cyan-400 whitespace-nowrap">|</span>
              <span className="border border-black/40 dark:border-white/40 bg-white/70 dark:bg-black px-2 py-1 text-black dark:text-white whitespace-nowrap">
                com demo interativa
              </span>
            </>
          ) : null}
        </div>

        <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-black dark:text-white md:text-5xl">
          {post.title}
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/80 dark:text-white/80 md:text-base">
          {post.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </div>
      </header>

      <div className="mt-8 space-y-8">
        {contentChunks.map((chunk, index) => (
          <Fragment key={`${post.slug}-${index}`}>
            {chunk.trim() ? (
              <div className="prose-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={markdownComponents}
                >
                  {chunk}
                </ReactMarkdown>
              </div>
            ) : null}

            {index < contentChunks.length - 1 ? <LazyDemoSection /> : null}
          </Fragment>
        ))}
      </div>
    </article>
  );
};

const LazyDemoSection = () => {
  const { hash } = useLocation();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(hash === '#demo');

  useEffect(() => {
    if (hash === '#demo') {
      setShouldLoad(true);
    }
  }, [hash]);

  useEffect(() => {
    if (shouldLoad || !sentinelRef.current) {
      return;
    }

    const node = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '320px 0px' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={sentinelRef}>
      {shouldLoad ? (
        <Suspense fallback={<DemoFallback loading />}>
          <LazyGitHubRepoExplorer />
        </Suspense>
      ) : (
        <DemoFallback />
      )}
    </div>
  );
};

const DemoFallback = ({ loading = false }: { loading?: boolean }) => (
  <section
    id="demo"
    className="ui-gradient-panel overflow-hidden border-3 border-black dark:border-cyan-400 bg-cyan-400/20 dark:bg-slate-900"
  >
    <div className="border-b-2 border-black dark:border-cyan-400 px-5 py-5 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black dark:text-cyan-400">
        Demo interativa
      </p>
      <h2 className="mt-2 text-2xl font-black text-black dark:text-white">
        Repositórios reais, grid sob demanda
      </h2>
      <p className="mt-2 text-sm leading-6 text-black/80 dark:text-white/80">
        {loading
          ? 'Carregando o módulo do DataGrid para manter a leitura do artigo fluida.'
          : 'O módulo interativo será carregado quando esta seção entrar no viewport ou se você chegar direto pelo link da demo.'}
      </p>
    </div>

    <div className="grid min-h-[280px] place-items-center p-6">
      <SurfaceCard className="w-full max-w-3xl p-5">
        <div className="h-10 w-44 border-2 border-black dark:border-white bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="mt-6 grid gap-3">
          <div className="h-12 border-2 border-black dark:border-white bg-slate-200/70 dark:bg-slate-800/70" />
          <div className="h-12 border-2 border-black dark:border-white bg-slate-200/55 dark:bg-slate-800/55" />
          <div className="h-12 border-2 border-black dark:border-white bg-slate-200/45 dark:bg-slate-800/45" />
          <div className="h-12 border-2 border-black dark:border-white bg-slate-200/35 dark:bg-slate-800/35" />
        </div>
      </SurfaceCard>
    </div>
  </section>
);

export default BlogPostView;

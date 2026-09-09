import { Fragment, Suspense, lazy, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import rehypeHighlight from 'rehype-highlight';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { BlogPost } from '../../types/blog';
import { extractHeadings, plainText, slugifyHeading } from '../../utils/headings';
import ExternalMark from '../ExternalMark';
import StatusPill from '../ui/StatusPill';
import TagChip from '../ui/TagChip';
import SectionTimeline from '../SectionTimeline';
import { useLocale } from '../../contexts/LocaleContext';
import { getLocalizedBlogPostBySlug } from '../../data/blogPosts';

const LazyGitHubRepoExplorer = lazy(() => import('./GitHubRepoExplorer'));
const DEMO_MARKER = '[[DEMO_GITHUB_REPOS]]';
const demoQueryClient = new QueryClient();

const markdownComponents = {
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="mt-12 font-display text-3xl font-black text-stone-900 first:mt-0 dark:text-stone-100">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 id={slugifyHeading(plainText(children))} className="mt-10 scroll-mt-28 font-display text-2xl font-black text-stone-900 dark:text-stone-100">{children}</h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 id={slugifyHeading(plainText(children))} className="mt-8 scroll-mt-28 text-xl font-bold text-stone-900 dark:text-stone-100">{children}</h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mt-5 text-sm leading-7 text-stone-800 dark:text-stone-200 md:text-base">
      {children}
    </p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mt-5 list-disc space-y-3 pl-5 text-sm text-stone-800 dark:text-stone-200 md:text-base">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm text-stone-800 dark:text-stone-200 md:text-base">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="leading-7 marker:text-[#a1006b] dark:marker:text-fuchsia-200">{children}</li>
  ),
  table: ({ children }: { children?: ReactNode }) => (
    <div className="article-table-wrap">
      <table className="article-table">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: ReactNode }) => <thead>{children}</thead>,
  tbody: ({ children }: { children?: ReactNode }) => <tbody>{children}</tbody>,
  tr: ({ children }: { children?: ReactNode }) => <tr>{children}</tr>,
  th: ({ children }: { children?: ReactNode }) => <th scope="col">{children}</th>,
  td: ({ children }: { children?: ReactNode }) => <td>{children}</td>,
  code: ({ children, className }: { children?: ReactNode; className?: string }) =>
    className ? (
      <code className={`code-block ${className}`}>{children}</code>
    ) : (
      <code className="border border-stone-900/25 bg-stone-900/[0.04] px-1.5 py-1 font-mono text-[0.9em] text-[#73004c] dark:border-stone-100/25 dark:bg-white/[0.06] dark:text-fuchsia-200">
        {children}
      </code>
    ),
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="code-block-pre mt-5 overflow-x-auto p-4 text-sm">
      {children}
    </pre>
  ),
  a: ({ children, href }: { children?: ReactNode; href?: string }) => {
    const isExternal = typeof href === 'string' && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#73004c] underline decoration-[#a1006b]/40 underline-offset-4 transition-colors duration-200 hover:text-[#a1006b] dark:text-fuchsia-200"
      >
        {children}
        {isExternal ? (
          <>
            {' '}<ExternalMark className="text-[0.9em] leading-none" />
          </>
        ) : null}
      </a>
    );
  },
};

const BlogPostView = ({ post, articleRef }: { post: BlogPost; articleRef?: (node: HTMLElement | null) => void }) => {
  const { t } = useLocale();
  const canonicalBody = getLocalizedBlogPostBySlug(post.slug, 'pt-BR')?.body;
  const headingMap = useMemo(() => {
    const sections = extractHeadings(post.body, canonicalBody);
    const map = new Map<string, string>();
    for (const section of sections) {
      map.set(slugifyHeading(section.label), section.id);
    }
    return map;
  }, [canonicalBody, post.body]);

  const components = useMemo(
    () => ({
      ...markdownComponents,
      h2: ({ children }: { children?: ReactNode }) => {
        const slug = slugifyHeading(plainText(children));
        const id = headingMap.get(slug) ?? slug;
        return (
          <h2 id={id} className="mt-10 scroll-mt-28 font-display text-2xl font-black text-stone-900 dark:text-stone-100">
            {children}
          </h2>
        );
      },
      h3: ({ children }: { children?: ReactNode }) => {
        const slug = slugifyHeading(plainText(children));
        const id = headingMap.get(slug) ?? slug;
        return (
          <h3 id={id} className="mt-8 scroll-mt-28 text-xl font-bold text-stone-900 dark:text-stone-100">
            {children}
          </h3>
        );
      },
    }),
    [headingMap],
  );

  const contentChunks = post.body.split(DEMO_MARKER);

  return (
    <Fragment key={post.slug}>
      <SectionTimeline />
      <article ref={articleRef} data-blog-article className="card-interactive border-[3px] border-stone-900 bg-[#fffdf8] p-6 dark:border-stone-100 dark:bg-[#131110] md:p-8">
      <header className="border-b-2 border-stone-900/20 pb-8 dark:border-stone-100/20">
        <div className="flex flex-wrap items-center gap-2 pb-1 font-mono text-xs font-semibold uppercase tracking-[0.14em]">
          <StatusPill>{post.category}</StatusPill>
          <span className="whitespace-nowrap text-stone-500 dark:text-stone-400">|</span>
          <span className="whitespace-nowrap border border-stone-900/25 bg-stone-900/[0.04] px-2 py-1 text-stone-800 dark:border-stone-100/25 dark:bg-white/[0.04] dark:text-stone-200">
            {post.formattedDate}
          </span>
          <span className="whitespace-nowrap text-stone-500 dark:text-stone-400">|</span>
          <span className="whitespace-nowrap border border-stone-900/25 bg-stone-900/[0.04] px-2 py-1 text-stone-800 dark:border-stone-100/25 dark:bg-white/[0.04] dark:text-stone-200">
            {post.readTime}
          </span>
          {post.hasDemo ? (
            <>
              <span className="whitespace-nowrap text-stone-500 dark:text-stone-400">|</span>
              <span className="whitespace-nowrap border border-stone-900/25 bg-stone-900/[0.04] px-2 py-1 text-stone-800 dark:border-stone-100/25 dark:bg-white/[0.04] dark:text-stone-200">
                 {t('blog.interactiveDemo')}
              </span>
            </>
          ) : null}
        </div>

        <h1 className="mt-5 max-w-4xl font-display text-4xl font-black leading-tight text-stone-900 dark:text-stone-100 md:text-5xl">
          {post.title}
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-700 dark:text-stone-300 md:text-base">
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
                  components={components}
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
    </Fragment>
  );
};

const LazyDemoSection = () => {
  const { hash } = useLocation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const shouldLoad = hash === '#demo' || hasLoaded;
  const sentinelRef = (node: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!node || shouldLoad) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setHasLoaded(true);
        observer.disconnect();
      }
    }, { rootMargin: '320px 0px' });
    observerRef.current = observer;
    observer.observe(node);
  };

  return (
    <div ref={sentinelRef}>
      {shouldLoad ? (
        <Suspense fallback={<DemoFallback loading />}>
          <QueryClientProvider client={demoQueryClient}>
            <LazyGitHubRepoExplorer />
          </QueryClientProvider>
        </Suspense>
      ) : (
        <DemoFallback />
      )}
    </div>
  );
};

const DemoFallback = ({ loading = false }: { loading?: boolean }) => {
  const { t } = useLocale();
  return (
  <section
    id="demo"
    className="overflow-hidden border-2 border-stone-900 bg-[#fffdf8] dark:border-stone-100/25 dark:bg-[#1c1917]"
  >
    <div className="border-b-2 border-stone-900/20 px-5 py-5 dark:border-stone-100/20 sm:px-6">
       <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#73004c] dark:text-fuchsia-200">
         {t('blog.demo')}
      </p>
      <h2 className="mt-2 font-display text-2xl font-black text-stone-900 dark:text-stone-100">
         {t('blog.demoTitle')}
      </h2>
      <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-stone-300">
        {loading
           ? t('blog.demoLoading')
           : t('blog.demoWaiting')}
      </p>
    </div>

    <div className="grid min-h-[280px] place-items-center p-6">
      <div className="w-full max-w-3xl border-y border-stone-900/20 p-5 dark:border-stone-100/20">
        <div className="h-10 w-44 border-2 border-stone-900/25 bg-stone-900/[0.06] dark:border-stone-100/25 dark:bg-white/[0.06]" />
        <div className="mt-6 grid gap-3">
          <div className="h-12 border-2 border-stone-900/25 bg-stone-900/[0.05] dark:border-stone-100/25 dark:bg-white/[0.05]" />
          <div className="h-12 border-2 border-stone-900/25 bg-stone-900/[0.04] dark:border-stone-100/25 dark:bg-white/[0.04]" />
          <div className="h-12 border-2 border-stone-900/25 bg-stone-900/[0.03] dark:border-stone-100/25 dark:bg-white/[0.03]" />
          <div className="h-12 border-2 border-stone-900/25 bg-stone-900/[0.02] dark:border-stone-100/25 dark:bg-white/[0.02]" />
        </div>
      </div>
    </div>
  </section>
  );
};

export default BlogPostView;

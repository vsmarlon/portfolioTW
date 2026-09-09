import { useNavigate, useParams } from 'react-router-dom';
import { getBlogPosts, getLocalizedBlogPostBySlug } from '../data/blogPosts';
import { extractHeadings } from '../utils/headings';
import BackLink from './BackLink';
import BlogListing from './blog/BlogListing';
import BlogPostView from './blog/BlogPostView';
import BlogSidebarContent from './blog/BlogSidebarContent';
import NotFound from './NotFound';
import ReadingShell from './ReadingShell';
import SurfaceCard from './ui/SurfaceCard';
import { useLocale } from '../contexts/LocaleContext';
import { useRouteScrollRoot } from '../hooks/useRouteScrollRoot';
import { useReadingSection } from '../hooks/useReadingSection';
import Icon from './Icon';

const Blog = () => {
  const { slug } = useParams();
  const routeRootRef = useRouteScrollRoot();
  const { activeId, articleRef } = useReadingSection();
  const { t, locale } = useLocale();
  const blogPosts = getBlogPosts(locale);
  const featuredBlogPost = blogPosts.find((post) => post.featured) ?? blogPosts[0];
  const navigate = useNavigate();
  const activePost = getLocalizedBlogPostBySlug(slug, locale);
  const isListingPage = !slug;
  const secondaryPosts = blogPosts.filter((post) => post.slug !== featuredBlogPost.slug);
  const navOptions = [
    { id: 'all', label: t('blog.all'), to: '/blog', date: '' },
    ...blogPosts.map((post) => ({ id: post.slug, label: post.title, to: `/blog/${post.slug}`, date: post.formattedDate })),
  ];
  const selectedNavOption = isListingPage
    ? navOptions[0]
    : navOptions.find((option) => option.id === slug) ?? navOptions[0];
  const activeSections = activePost
    ? extractHeadings(activePost.body, getLocalizedBlogPostBySlug(activePost.slug, 'pt-BR')?.body)
    : [];

  if (slug && !activePost) {
    return <NotFound />;
  }

  return (
    <main ref={routeRootRef} className="reading-page min-h-screen">
      <div className="w-full px-3 py-10 sm:px-4 lg:px-6">
         <BackLink to="/">{t('blog.back')}</BackLink>

        <div className="mx-1 flex flex-col gap-4 border-b-2 border-stone-900/20 pb-8 dark:border-stone-100/20 sm:mx-0 lg:flex-row lg:items-end lg:justify-between">
          <div>
             <p className="eyebrow inline-flex items-center gap-2">
               <Icon name="pen" />{t('blog.eyebrow')}
            </p>
            <h1 className="mt-3 font-display text-3xl font-black text-stone-900 dark:text-stone-100 md:text-5xl">
               {t('blog.title')} <span className="text-[#a1006b] dark:text-fuchsia-200">{t('blog.and')}</span> {t('blog.caseStudies')}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 dark:text-stone-400 md:text-base">
               {t('blog.description')}
            </p>
          </div>

          <SurfaceCard className="p-5 text-sm text-stone-700 dark:text-stone-200">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#73004c] dark:text-fuchsia-200">
               {t('blog.status')}
            </span>
            <div className="mt-3 divide-y divide-stone-900/15 border-t border-stone-900/15 dark:divide-stone-100/15 dark:border-stone-100/15">
              <span className="flex items-center gap-2 py-2 font-semibold text-stone-900 dark:text-stone-100 whitespace-nowrap">
                <span className="h-2 w-2 bg-[#a1006b] dark:bg-fuchsia-200" />
                 {blogPosts.length} {t('blog.published')}
              </span>
              <span className="flex items-center gap-2 py-2 text-[#73004c] dark:text-fuchsia-200 whitespace-nowrap">
                <span className="h-2 w-2 bg-[#a1006b] dark:bg-fuchsia-200" />
                 {t('blog.demoCount')}
              </span>
            </div>
          </SurfaceCard>
        </div>

        <div className="mt-6 lg:hidden">
          <label htmlFor="blog-mobile-nav" className="block font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#73004c] dark:text-fuchsia-200 mb-2">
            {t('blog.navigate')}
          </label>
          <div className="relative">
            <select
              id="blog-mobile-nav"
              value={selectedNavOption.id}
              onChange={(event) => {
                const option = navOptions.find((opt) => opt.id === event.target.value);
                if (option) {
                  void navigate(option.to);
                }
              }}
              aria-label={t('blog.navigate')}
              className="h-12 w-full appearance-none border-2 border-stone-900 bg-[#fffdf8] px-4 pr-10 font-mono text-sm font-semibold text-stone-900 shadow-sm focus:border-[#a1006b] focus:outline-none dark:border-stone-100/30 dark:bg-[#131110] dark:text-stone-100 dark:focus:border-fuchsia-200"
            >
              {navOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label} {option.date ? `(${option.date})` : ''}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-700 dark:text-stone-300">
              <Icon name="chevron-down" className="text-sm" />
            </div>
          </div>
        </div>

        <div className="mt-4 border-2 border-stone-900/25 bg-[#fffdf8] lg:hidden dark:border-stone-100/25 dark:bg-[#131110]">
          <BlogSidebarContent activeSlug={slug} isListingPage={isListingPage} sections={activeSections} activeSectionId={activeId} />
        </div>


        <ReadingShell
          sidebarTestId="blog-sidebar"
          resizerTestId="blog-sidebar-resizer"
          sidebar={
            <div className="border-2 border-stone-900/25 bg-[#fffdf8] dark:border-stone-100/25 dark:bg-[#131110]">
               <BlogSidebarContent activeSlug={slug} isListingPage={isListingPage} sections={activeSections} activeSectionId={activeId} />
            </div>
          }
        >
          <section
            data-testid="blog-main-content"
            className="flex min-h-[calc(100vh-5rem)] min-w-0 flex-1 flex-col"
          >
            {activePost ? (
              <BlogPostView post={activePost} articleRef={articleRef} />
            ) : (
              <BlogListing featuredPost={featuredBlogPost} posts={secondaryPosts} />
            )}
          </section>
        </ReadingShell>
      </div>
    </main>
  );
};

export default Blog;

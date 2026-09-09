import { Autocomplete, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
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
import ReadingNavigation from './ReadingNavigation';
import Icon from './Icon';

const Blog = () => {
  const { slug } = useParams();
  const routeRootRef = useRouteScrollRoot();
  const { activeId, articleRef } = useReadingSection();
  const { theme } = useTheme();
  const { t, locale } = useLocale();
  const blogPosts = getBlogPosts(locale);
  const featuredBlogPost = blogPosts.find((post) => post.featured) ?? blogPosts[0];
  const isDark = theme === 'dark';
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
          <Autocomplete
            disablePortal
            disableClearable
            options={navOptions}
            value={selectedNavOption}
            onChange={(_, option) => {
              if (option) {
                void navigate(option.to);
              }
            }}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
             label={t('blog.navigate')}
                size="small"
                slotProps={{
                  inputLabel: {
                    sx: {
                      fontSize: '0.825rem',
                      fontWeight: 600,
                    },
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <div className="flex min-w-0 flex-col py-1">
                  <span className="truncate text-sm font-semibold">{option.label}</span>
                  {option.date ? (
                    <span className="text-xs text-slate-500 dark:text-slate-400">{option.date}</span>
                  ) : null}
                </div>
              </li>
            )}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 0,
                fontFamily: 'var(--font-mono)',
                color: isDark ? '#fafafa' : '#0a0a0a',
                backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? '#fafafa' : '#0a0a0a',
                borderWidth: '2px',
              },
              '& .MuiInputLabel-root': {
                color: isDark ? '#fafafa' : '#0a0a0a',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#22d3ee',
              },
              '& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator': {
                color: isDark ? '#22d3ee' : '#0a0a0a',
              },
            }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  mt: 1,
                  borderRadius: 0,
                  border: `2px solid ${isDark ? '#fafafa' : '#0a0a0a'}`,
                  backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
                  boxShadow: 'none',
                  '& .MuiAutocomplete-listbox': {
                    p: '0.4rem',
                  },
                  '& .MuiAutocomplete-option': {
                    borderRadius: 0,
                    border: `1px solid ${isDark ? '#fafafa' : '#0a0a0a'}`,
                    minHeight: 44,
                    alignItems: 'flex-start',
                    color: isDark ? '#fafafa' : '#0a0a0a',
                    '& .MuiTypography-root': {
                      color: isDark ? '#fafafa' : '#0a0a0a',
                    },
                    '&.Mui-focused': {
                      backgroundColor: isDark ? 'rgba(34, 211, 238, 0.2)' : 'rgba(34, 211, 238, 0.24)',
                    },
                    '&[aria-selected="true"]': {
                      backgroundColor: isDark ? 'rgba(34, 211, 238, 0.26)' : 'rgba(34, 211, 238, 0.3)',
                    },
                  },
                },
              },
            }}
          />
        </div>

        {activeSections.length > 0 ? (
          <div className="mt-4 border-2 border-stone-900/25 bg-[#fffdf8] lg:hidden dark:border-stone-100/25 dark:bg-[#131110]">
            <ReadingNavigation sections={activeSections} activeId={activeId} />
          </div>
        ) : (
          <div className="mt-4 border-2 border-stone-900/25 bg-[#fffdf8] lg:hidden dark:border-stone-100/25 dark:bg-[#131110]">
            <BlogSidebarContent activeSlug={slug} isListingPage={isListingPage} sections={activeSections} activeSectionId={activeId} />
          </div>
        )}

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

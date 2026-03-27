import { useMemo } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { blogPosts, featuredBlogPost, getBlogPostBySlug } from '../data/blogPosts';
import { useBlogSidebarResize } from '../hooks/useBlogSidebarResize';
import BlogListing from './blog/BlogListing';
import BlogPostView from './blog/BlogPostView';
import BlogSidebarContent from './blog/BlogSidebarContent';
import Icon from './Icon';
import NotFound from './NotFound';
import SurfaceCard from './ui/SurfaceCard';

const Blog = () => {
  const { slug } = useParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const activePost = getBlogPostBySlug(slug);
  const isListingPage = !slug;
  const secondaryPosts = useMemo(
    () => blogPosts.filter((post) => post.slug !== featuredBlogPost.slug),
    [],
  );
  const navOptions = useMemo(
    () => [
      {
        id: 'all',
        label: 'Todos os artigos',
        to: '/blog',
        date: '',
      },
      ...blogPosts.map((post) => ({
        id: post.slug,
        label: post.title,
        to: `/blog/${post.slug}`,
        date: post.formattedDate,
      })),
    ],
    [],
  );
  const selectedNavOption = useMemo(() => {
    if (isListingPage) {
      return navOptions[0];
    }

    return navOptions.find((option) => option.id === slug) ?? navOptions[0];
  }, [isListingPage, navOptions, slug]);
  const {
    sidebarWidth,
    sidebarMinWidth,
    sidebarMaxWidth,
    handleResizeMouseDown,
    handleResizeKeyDown,
  } = useBlogSidebarResize();

  if (slug && !activePost) {
    return <NotFound />;
  }

  return (
    <main className="min-h-screen pt-20">
      <div className="w-full px-3 py-10 sm:px-4 lg:px-6">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors duration-200 hover:text-cyan-400 group"
        >
          <Icon name="arrow-left" className="transition-transform group-hover:-translate-x-1" />
          Voltar ao portfólio
        </Link>

        <div className="ui-divider-strong mx-1 flex flex-col gap-4 border-b pb-8 sm:mx-0 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-400">
              Escrita + demos com contexto
            </p>
            <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white md:text-5xl">
              Blog <span className="text-cyan-400">&</span> estudos de caso
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400 md:text-base">
              Artigos em português sobre frontend, critério de interface e demos que existem para
              sustentar a história, não para competir com ela.
            </p>
          </div>

          <SurfaceCard className="ui-border-strong p-5 text-sm text-slate-700 dark:text-slate-200">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-400">
              Status editorial
            </span>
            <div className="mt-3 divide-y divide-black/25 dark:divide-white/25 border-t border-black/25 dark:border-white/25">
              <span className="flex items-center gap-2 py-2 font-semibold text-black dark:text-white whitespace-nowrap">
                <span className="h-2 w-2 bg-cyan-400" />
                {blogPosts.length} artigos publicados
              </span>
              <span className="flex items-center gap-2 py-2 text-cyan-700 dark:text-cyan-300 whitespace-nowrap">
                <span className="h-2 w-2 bg-cyan-400" />
                1 estudo com demo interativa embutida
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
                label="Navegar pelo blog"
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

        <div className="mt-10 flex min-h-[calc(100vh-5rem)] flex-col gap-6 lg:flex-row lg:items-start lg:gap-0">
          <aside
            data-testid="blog-sidebar"
            className="hidden lg:block lg:shrink-0 lg:sticky lg:top-28"
            style={{ width: `${sidebarWidth}px` }}
          >
            <div className="ui-sidebar-shell border-2 border-black dark:border-white bg-white dark:bg-black">
              <BlogSidebarContent activeSlug={slug} isListingPage={isListingPage} />
            </div>
          </aside>

          <button
            type="button"
            role="separator"
            aria-label="Redimensionar navegação lateral"
            aria-orientation="vertical"
            aria-valuemin={sidebarMinWidth}
            aria-valuemax={sidebarMaxWidth}
            aria-valuenow={Math.round(sidebarWidth)}
            onMouseDown={handleResizeMouseDown}
            onKeyDown={handleResizeKeyDown}
            data-testid="blog-sidebar-resizer"
            className="group hidden w-10 shrink-0 cursor-col-resize touch-none select-none items-stretch justify-center lg:flex lg:self-stretch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100 dark:focus-visible:ring-offset-slate-950"
          >
            <span className="ui-sidebar-rail h-full w-px transition-colors" />
          </button>

          <section
            data-testid="blog-main-content"
            className="flex min-h-[calc(100vh-5rem)] min-w-0 flex-1 flex-col"
          >
            {activePost ? (
              <BlogPostView post={activePost} />
            ) : (
              <BlogListing featuredPost={featuredBlogPost} posts={secondaryPosts} />
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Blog;

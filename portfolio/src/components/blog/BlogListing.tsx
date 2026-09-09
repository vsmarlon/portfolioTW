import { Link, useSearchParams } from 'react-router-dom';
import type { BlogPost } from '../../types/blog';
import Icon from '../Icon';
import StatusPill from '../ui/StatusPill';
import SurfaceCard from '../ui/SurfaceCard';
import TagChip from '../ui/TagChip';
import { useLocale } from '../../contexts/LocaleContext';

interface BlogListingProps {
  featuredPost: BlogPost;
  posts: BlogPost[];
}

function matchesQuery(post: BlogPost, query: string): boolean {
  const q = query.toLowerCase();
  return (
    post.title.toLowerCase().includes(q) ||
    post.category.toLowerCase().includes(q) ||
    post.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

const META_PILL = 'whitespace-nowrap border border-stone-900/25 bg-stone-900/[0.04] px-2 py-1 text-stone-800 dark:border-stone-100/25 dark:bg-white/[0.04] dark:text-stone-200';
const META_DATE_PILL = 'whitespace-nowrap border border-[#a1006b]/40 bg-[#a1006b]/10 px-2 py-1 text-[#73004c] dark:border-fuchsia-200/40 dark:bg-fuchsia-200/10 dark:text-fuchsia-200';
const META_SEPARATOR = 'whitespace-nowrap text-stone-400 dark:text-stone-500';

const MetaRow = ({ post, size }: { post: BlogPost; size: 'xs' | 'sm' }) => (
  <div className={`flex flex-wrap items-center gap-2 pb-1 font-semibold uppercase tracking-[0.18em] ${size === 'xs' ? 'text-[11px]' : 'text-xs'}`}>
    <span className={META_PILL}>{post.category}</span>
    <span className={META_SEPARATOR}>|</span>
    <span className={META_DATE_PILL}>{post.formattedDate}</span>
    <span className={META_SEPARATOR}>|</span>
    <span className={META_PILL}>{post.readTime}</span>
  </div>
);

const BlogListing = ({ featuredPost, posts }: BlogListingProps) => {
  const [searchParams] = useSearchParams();
  const { t } = useLocale();
  const query = searchParams.get('q') ?? '';
  const allPosts = [featuredPost, ...posts];
  const filtered = query.trim() ? allPosts.filter((p) => matchesQuery(p, query)) : null;

  return (
    <div className="space-y-8">
      {/* Search results */}
      {filtered !== null && (
        <div>
          {filtered.length === 0 ? (
               <p className="py-4 font-mono text-sm text-stone-700 dark:text-stone-300">
               {t('blog.noResults')} &quot;{query}&quot;
            </p>
          ) : (
            <div className="space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                 {filtered.length} {t('blog.results')}{filtered.length !== 1 ? 's' : ''}
              </p>
              {filtered.map((post) => (
                <SurfaceCard key={post.slug} className="p-6">
                  <MetaRow post={post} size="xs" />
                  <h3 className="mt-4 text-xl font-black text-stone-900 dark:text-stone-100">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-700 dark:text-stone-300">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <TagChip key={tag}>{tag}</TagChip>
                    ))}
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#73004c] transition-colors duration-200 hover:text-[#a1006b] dark:text-fuchsia-200 dark:hover:text-fuchsia-100"
                  >
                     {t('blog.openArticle')}
                    <Icon name="arrow-right" />
                  </Link>
                </SurfaceCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Normal layout when not searching */}
      {filtered === null && (
        <>
          <SurfaceCard variant="strong" className="overflow-hidden">
             <div className="border-b-2 border-stone-900/20 p-8 dark:border-stone-100/20">
              <div className="flex flex-wrap items-center gap-2 pb-1 text-xs font-semibold uppercase tracking-[0.18em]">
                 <StatusPill>{t('projects.flagship')}</StatusPill>
                <MetaRow post={featuredPost} size="xs" />
              </div>

              <h2 className="mt-5 max-w-3xl font-display text-3xl font-black leading-tight text-stone-900 dark:text-stone-100 md:text-4xl">
                {featuredPost.title}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700 dark:text-stone-300 md:text-base">
                {featuredPost.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {featuredPost.tags.map((tag) => (
                  <TagChip key={tag}>{tag}</TagChip>
                ))}
              </div>

              <Link
                to={`/blog/${featuredPost.slug}`}
                className="focus-ring mt-8 inline-flex items-center gap-2 border-2 border-stone-900 bg-stone-900 px-5 py-3 text-sm font-bold text-[#faf6ef] transition-colors duration-200 hover:border-[#73004c] hover:bg-[#a1006b] dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 dark:hover:border-[#ec7cc3] dark:hover:bg-[#ec7cc3]"
              >
                 {t('blog.readArticle')}
                <Icon name="arrow-right" />
              </Link>
            </div>
          </SurfaceCard>

          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
               {t('blog.archive')}
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-stone-900 dark:text-stone-100">
               {t('blog.moreArticles')}
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {posts.map((post) => (
                <SurfaceCard key={post.slug} className="p-6">
                  <MetaRow post={post} size="xs" />

                  <h3 className="mt-4 font-display text-2xl font-black text-stone-900 dark:text-stone-100">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-700 dark:text-stone-300">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <TagChip key={tag}>{tag}</TagChip>
                    ))}
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#73004c] transition-colors duration-200 hover:text-[#a1006b] dark:text-fuchsia-200 dark:hover:text-fuchsia-100"
                  >
                     {t('blog.openArticle')}
                    <Icon name="arrow-right" />
                  </Link>
                </SurfaceCard>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogListing;

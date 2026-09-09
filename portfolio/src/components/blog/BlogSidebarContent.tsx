import { Link } from 'react-router-dom';
import type { ContentSection } from '../../utils/headings';
import Icon from '../Icon';
import TagChip from '../ui/TagChip';
import { useLocale } from '../../contexts/LocaleContext';
import { getBlogPosts } from '../../data/blogPosts';
import ReadingNavigation from '../ReadingNavigation';

interface BlogSidebarContentProps {
  activeSlug?: string;
  isListingPage: boolean;
  sections?: ContentSection[];
  activeSectionId?: string | null;
}

const BlogSidebarContent = ({ activeSlug, isListingPage, sections = [], activeSectionId }: BlogSidebarContentProps) => {
  const { t, locale } = useLocale();
  const localizedPosts = getBlogPosts(locale);
  const localizedDemoPost = localizedPosts.find((post) => post.hasDemo) ?? localizedPosts[0];
  return (
  <div>
    <details className="sidebar-accordion" open>
       <summary><span className="inline-flex items-center gap-2"><Icon name="grid" />{t('blog.navigation')}</span></summary>
      <div className="accordion-body">
        <div className="divide-y divide-black/5 dark:divide-white/10">
          <Link
            to="/blog"
            className={`block py-3 text-sm font-semibold transition-colors first:pt-0 ${
              isListingPage
                ? 'border-l-[3px] border-[#a1006b] bg-[#a1006b]/10 pl-3 pr-3 text-[#73004c] dark:border-fuchsia-200 dark:bg-fuchsia-200/10 dark:text-fuchsia-200'
                : 'text-stone-700 hover:text-[#a1006b] dark:text-stone-200 dark:hover:text-fuchsia-200'
            }`}
          >
             {t('blog.allTopics')}
          </Link>

           {localizedPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className={`block py-3 transition-colors ${
                activeSlug === post.slug
                  ? 'border-l-[3px] border-[#a1006b] bg-[#a1006b]/10 pl-3 pr-3 text-[#73004c] dark:border-fuchsia-200 dark:bg-fuchsia-200/10 dark:text-fuchsia-200'
                  : 'text-stone-700 hover:text-[#a1006b] dark:text-stone-200 dark:hover:text-fuchsia-200'
              }`}
            >
              <span className="block text-sm font-semibold">{post.title}</span>
              <span className="mt-1 block font-mono text-xs text-stone-500 dark:text-stone-400">
                {post.formattedDate}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </details>

    {sections.length > 0 ? (
      <ReadingNavigation sections={sections} activeId={activeSectionId} />
    ) : null}

    <details className="sidebar-accordion" open={isListingPage}>
       <summary><span className="inline-flex items-center gap-2"><Icon name="server" />{t('blog.accessibleDemo')}</span></summary>
      <div className="accordion-body">
        <h2 className="text-lg font-black text-stone-900 dark:text-stone-100">
           {t('blog.openStudy')}
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-stone-300">
           {t('blog.demoDescription')}
        </p>
        <Link
           to={`/blog/${localizedDemoPost.slug}#demo`}
          className="focus-ring mt-4 inline-flex items-center gap-2 border-2 border-stone-900 bg-stone-900 px-4 py-2 text-sm font-bold text-[#faf6ef] transition-colors duration-200 hover:border-[#73004c] hover:bg-[#a1006b] dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 dark:hover:border-[#ec7cc3] dark:hover:bg-[#ec7cc3]"
        >
          <Icon name="grid" />
           {t('blog.goToDemo')}
        </Link>
      </div>
    </details>

    <div className="p-5">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
         {t('blog.recurringTopics')}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
         {Array.from(new Set(localizedPosts.flatMap((post) => post.tags))).map((tag) => (
          <TagChip key={tag}>{tag}</TagChip>
        ))}
      </div>
    </div>
  </div>
  );
};
export default BlogSidebarContent;

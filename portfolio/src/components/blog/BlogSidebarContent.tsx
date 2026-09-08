import { Link } from 'react-router-dom';
import { blogPosts, demoBlogPost } from '../../data/blogPosts';
import type { ContentSection } from '../../utils/headings';
import Icon from '../Icon';
import TagChip from '../ui/TagChip';

interface BlogSidebarContentProps {
  activeSlug?: string;
  isListingPage: boolean;
  sections?: ContentSection[];
}

const BlogSidebarContent = ({ activeSlug, isListingPage, sections = [] }: BlogSidebarContentProps) => (
  <div>
    <details className="sidebar-accordion" open>
      <summary><span>Navegação</span></summary>
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
            Todos os artigos
          </Link>

          {blogPosts.map((post) => (
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
      <details className="sidebar-accordion" open>
        <summary><span>Nesta leitura</span></summary>
        <div className="accordion-body">
          <ul className="space-y-1 font-mono text-xs uppercase tracking-wider">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`block px-3 py-2 text-stone-600 hover:bg-[#a1006b]/10 hover:text-[#a1006b] dark:text-stone-300 dark:hover:bg-fuchsia-200/10 dark:hover:text-fuchsia-200${section.depth > 2 ? ' pl-6' : ''}`}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </details>
    ) : null}

    <details className="sidebar-accordion" open={isListingPage}>
      <summary><span>Demo acessível</span></summary>
      <div className="accordion-body">
        <h2 className="text-lg font-black text-stone-900 dark:text-stone-100">
          Abrir o estudo com DataGrid
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-stone-300">
          O experimento com MUI DataGrid agora vive dentro de um artigo técnico, com contexto e
          dados reais do GitHub.
        </p>
        <Link
          to={`/blog/${demoBlogPost.slug}#demo`}
          className="focus-ring mt-4 inline-flex items-center gap-2 border-2 border-stone-900 bg-stone-900 px-4 py-2 text-sm font-bold text-[#faf6ef] transition-colors duration-200 hover:border-[#73004c] hover:bg-[#a1006b] dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 dark:hover:border-[#ec7cc3] dark:hover:bg-[#ec7cc3]"
        >
          <Icon name="grid" />
          Ir para a demo
        </Link>
      </div>
    </details>

    <div className="p-5">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        Temas recorrentes
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from(new Set(blogPosts.flatMap((post) => post.tags))).map((tag) => (
          <TagChip key={tag}>{tag}</TagChip>
        ))}
      </div>
    </div>
  </div>
);
export default BlogSidebarContent;

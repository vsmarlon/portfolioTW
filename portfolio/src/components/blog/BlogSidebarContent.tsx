import { Link } from 'react-router-dom';
import { blogPosts, demoBlogPost } from '../../data/blogPosts';
import Icon from '../Icon';
import GradientPanel from '../ui/GradientPanel';
import SurfaceCard from '../ui/SurfaceCard';
import TagChip from '../ui/TagChip';

interface BlogSidebarContentProps {
  activeSlug?: string;
  isListingPage: boolean;
}

const BlogSidebarContent = ({ activeSlug, isListingPage }: BlogSidebarContentProps) => (
  <div className="space-y-6">
    <SurfaceCard className="ui-border-strong border-2 border-black dark:border-white bg-white dark:bg-black p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
        Navegação
      </p>
      <div className="mt-4 divide-y divide-black/5 dark:divide-white/10">
        <Link
          to="/blog"
          className={`block py-3 text-sm font-semibold transition-colors first:pt-0 ${
            isListingPage
              ? 'border-l-[3px] border-cyan-400 bg-cyan-400/10 pl-3 pr-3 text-cyan-700 dark:text-cyan-300'
              : 'text-slate-700 hover:text-cyan-400 dark:text-slate-200 dark:hover:text-cyan-400'
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
                ? 'border-l-[3px] border-cyan-400 bg-cyan-400/10 pl-3 pr-3 text-cyan-700 dark:text-cyan-300'
                : 'text-slate-700 hover:text-cyan-400 dark:text-slate-200 dark:hover:text-cyan-400'
            }`}
          >
            <span className="block text-sm font-semibold">{post.title}</span>
            <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
              {post.formattedDate}
            </span>
          </Link>
        ))}
      </div>
    </SurfaceCard>

    <GradientPanel className="p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black dark:text-cyan-400">
        Demo acessível
      </p>
      <h2 className="mt-3 text-lg font-black text-black dark:text-white">
        Abrir o estudo com DataGrid
      </h2>
      <p className="mt-2 text-sm leading-6 text-black/80 dark:text-white/80">
        O experimento com MUI DataGrid agora vive dentro de um artigo técnico, com contexto e
        dados reais do GitHub.
      </p>
      <Link
        to={`/blog/${demoBlogPost.slug}#demo`}
        className="mt-4 inline-flex items-center gap-2 border-2 border-black dark:border-white bg-black dark:bg-white px-4 py-2 text-sm font-bold text-white dark:text-black transition-colors duration-200 hover:bg-cyan-400 hover:text-black"
      >
        <Icon name="grid" />
        Ir para a demo
      </Link>
    </GradientPanel>

    <SurfaceCard
      variant="muted"
      className="ui-border-strong border-2 border-black dark:border-white bg-white dark:bg-black p-5"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
        Temas recorrentes
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from(new Set(blogPosts.flatMap((post) => post.tags))).map((tag) => (
          <TagChip key={tag}>{tag}</TagChip>
        ))}
      </div>
    </SurfaceCard>
  </div>
);

export default BlogSidebarContent;

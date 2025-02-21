import { Link } from 'react-router-dom';
import type { BlogPost } from '../../types/blog';
import Icon from '../Icon';
import StatusPill from '../ui/StatusPill';
import SurfaceCard from '../ui/SurfaceCard';
import TagChip from '../ui/TagChip';

interface BlogListingProps {
  featuredPost: BlogPost;
  posts: BlogPost[];
}

const BlogListing = ({ featuredPost, posts }: BlogListingProps) => (
  <div className="space-y-8">
    <SurfaceCard variant="strong" className="overflow-hidden border-3 border-black dark:border-white">
      <div className="border-b-2 border-black dark:border-white bg-cyan-400/25 dark:bg-slate-900 p-8">
        <div className="flex flex-wrap items-center gap-2 pb-1 text-xs font-semibold uppercase tracking-[0.18em]">
          <StatusPill>Destaque</StatusPill>
          <span className="border border-black/40 dark:border-white/40 bg-white/70 dark:bg-black px-2 py-1 text-black dark:text-white whitespace-nowrap">
            {featuredPost.category}
          </span>
          <span className="text-cyan-600 dark:text-cyan-400 whitespace-nowrap">|</span>
          <span className="border border-cyan-400 bg-cyan-400/20 px-2 py-1 text-black dark:text-cyan-300 whitespace-nowrap">
            {featuredPost.formattedDate}
          </span>
          <span className="text-cyan-600 dark:text-cyan-400 whitespace-nowrap">|</span>
          <span className="border border-black/40 dark:border-white/40 bg-white/70 dark:bg-black px-2 py-1 text-black dark:text-white whitespace-nowrap">
            {featuredPost.readTime}
          </span>
        </div>

        <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight text-black dark:text-white md:text-4xl">
          {featuredPost.title}
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-black/80 dark:text-white/80 md:text-base">
          {featuredPost.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {featuredPost.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </div>

        <Link
          to={`/blog/${featuredPost.slug}`}
          className="mt-8 inline-flex items-center gap-2 border-2 border-black dark:border-white bg-black dark:bg-white px-5 py-3 text-sm font-bold text-white dark:text-black transition-colors duration-200 hover:bg-cyan-400 hover:text-black"
        >
          Ler artigo
          <Icon name="arrow-right" />
        </Link>
      </div>
    </SurfaceCard>

    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
        Arquivo
      </p>
      <h2 className="mt-2 text-2xl font-black text-black dark:text-white">
        Mais artigos publicados
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <SurfaceCard key={post.slug} className="border-2 border-black dark:border-white p-6">
            <div className="flex flex-wrap items-center gap-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
              <span className="border border-black/35 dark:border-white/35 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 text-black/80 dark:text-white/80 whitespace-nowrap">
                {post.category}
              </span>
              <span className="text-cyan-600 dark:text-cyan-400 whitespace-nowrap">|</span>
              <span className="border border-cyan-400 bg-cyan-400/15 px-2 py-1 text-cyan-700 dark:text-cyan-300 whitespace-nowrap">
                {post.formattedDate}
              </span>
              <span className="text-cyan-600 dark:text-cyan-400 whitespace-nowrap">|</span>
              <span className="border border-black/35 dark:border-white/35 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 text-black/80 dark:text-white/80 whitespace-nowrap">
                {post.readTime}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-black text-black dark:text-white">
              {post.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-black/80 dark:text-white/80">
              {post.excerpt}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <TagChip key={tag}>{tag}</TagChip>
              ))}
            </div>

            <Link
              to={`/blog/${post.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black dark:text-cyan-400 transition-colors duration-200 hover:text-cyan-400 dark:hover:text-cyan-300"
            >
              Abrir artigo
              <Icon name="arrow-right" />
            </Link>
          </SurfaceCard>
        ))}
      </div>
    </div>
  </div>
);

export default BlogListing;

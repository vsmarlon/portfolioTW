import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { useScrollReveal } from '../hooks/useScrollReveal';

const LatestWriting = () => {
  const reveal = useScrollReveal();
  return (
    <section id="writing" className="content-section">
      <div ref={reveal} className="reveal editorial-container">
        <div className="section-heading flex items-end justify-between gap-6">
           <div><p className="eyebrow">Últimos textos</p><h2>Escrita com contexto técnico.</h2></div>
           <Link to="/blog" className="focus-ring hidden text-sm font-semibold text-[#73004c] underline-offset-4 hover:underline dark:text-fuchsia-200 sm:inline">Ver todos →</Link>
        </div>
        <div className="mt-8 border-y-2 border-stone-900/20 dark:border-stone-100/20">
          {blogPosts.slice(0, 3).map((post) => (
             <Link key={post.slug} to={`/blog/${post.slug}`} className="card-interactive focus-ring grid gap-3 border-b border-stone-900/15 px-4 py-5 last:border-b-0 dark:border-stone-100/15 md:grid-cols-[1fr_auto] md:items-center">
              <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-[#73004c] dark:text-fuchsia-200">{post.category}</p><h3 className="mt-2 text-lg font-bold text-stone-900 dark:text-stone-100">{post.title}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-stone-700 dark:text-stone-300">{post.excerpt}</p></div>
              <span className="font-mono text-xs text-stone-600 dark:text-stone-400">{post.formattedDate} · {post.readTime}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestWriting;

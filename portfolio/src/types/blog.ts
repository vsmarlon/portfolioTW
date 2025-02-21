export interface BlogPostMeta {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  hasDemo: boolean;
}

export interface BlogPost extends BlogPostMeta {
  body: string;
  formattedDate: string;
}

export interface GitHubRepoRow {
  id: number;
  name: string;
  description: string;
  language: string;
  visibility: string;
  stars: number;
  forks: number;
  updatedAt: string;
  url: string;
}

import { lazy, Suspense, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, useParams } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocaleProvider, useLocale, type Locale } from './contexts/LocaleContext';
import { ActiveSectionProvider } from './contexts/ActiveSectionContext';
import Home from './components/Home';
import Projects from './components/Projects';
import NotFound from './components/NotFound';
import EngineeringSystems from './components/EngineeringSystems';
import About from './components/About';
import LatestWriting from './components/LatestWriting';
import Contact from './components/Contact';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { usePerformanceMode } from './hooks/usePerformanceMode';
import { useThemeRootRef } from './contexts/ThemeContext';
import { useActiveSectionRoot } from './contexts/ActiveSectionContext';
import { useRouteScrollRoot } from './hooks/useRouteScrollRoot';
import type { ResumeLocale } from './data/resume';
import { getLocalizedBlogPostBySlug } from './data/blogPosts';


function resolvePageMeta(
  pathname: string,
  locale: Locale,
  t: (key: string) => string,
): { pageTitle: string; description: string } {
  if (pathname === '/') return { pageTitle: t('home.title'), description: t('home.description') };
  if (pathname === '/blog') return { pageTitle: t('blog.title'), description: t('blog.description') };
  if (pathname === '/projects/freebay') return { pageTitle: 'Freebay', description: t('freebay.lead') };
  if (pathname.startsWith('/blog/')) {
    const article = getLocalizedBlogPostBySlug(pathname.slice('/blog/'.length), locale);
    if (article) return { pageTitle: article.title, description: article.excerpt };
  }
  return { pageTitle: t('notFound.title'), description: t('notFound.description') };
}

const Blog = lazy(() => import('./components/Blog'));
const FreebayCaseStudy = lazy(() => import('./components/freebay/FreebayCaseStudy'));
const Resume = lazy(() => import('./components/Resume'));
const resumeLocales: ResumeLocale[] = ['en', 'pt-BR'];

const MainPage = () => {
  const routeRootRef = useRouteScrollRoot();
  const activeSectionRootRef = useActiveSectionRoot();
  const rootRef = useCallback((node: HTMLElement | null) => {
    routeRootRef(node);
    activeSectionRootRef(node);
  }, [activeSectionRootRef, routeRootRef]);

  return (
    <main ref={rootRef} className="flex flex-col min-h-screen relative">
      <Home />
      <Projects />
      <EngineeringSystems />
      <About />
      <LatestWriting />
      <Contact />
    </main>
  );
};

const Background = () => (
  <div className="app-background">
    <div className="app-background-grid" />
    <div className="app-background-grain" />
  </div>
);

const SiteLayout = () => {
  const { pathname } = useLocation();
  const { locale, t } = useLocale();
  const { pageTitle, description } = resolvePageMeta(pathname, locale, t);
  const title = pathname === '/' ? `Marlon Vargas | ${pageTitle}` : `${pageTitle} | Marlon Vargas`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <Background />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

const ResumeRoute = () => {
  const { locale } = useParams<'locale'>();
  if (!locale || !resumeLocales.includes(locale as ResumeLocale)) {
    return <NotFound />;
  }

  const resumeLocale = locale as ResumeLocale;
  return <Resume locale={resumeLocale} />;
};

function AppContent() {
  const { performanceRootRef } = usePerformanceMode();
  const themeRootRef = useThemeRootRef();
  const appRootRef = useCallback((node: HTMLElement | null) => {
    themeRootRef(node);
    performanceRootRef(node);
  }, [performanceRootRef, themeRootRef]);

  return (
    <div ref={appRootRef}>
      <LocaleProvider>
        <Router>
          <ActiveSectionProvider>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route
                  path="/blog"
                  element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Blog />
                    </Suspense>
                  }
                />
                <Route
                  path="/blog/:slug"
                  element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Blog />
                    </Suspense>
                  }
                />
                <Route
                  path="/projects/freebay"
                  element={
                    <Suspense fallback={<LoadingScreen />}>
                      <FreebayCaseStudy />
                    </Suspense>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route
                path="/cv/:locale"
                element={
                  <Suspense fallback={<LoadingScreen />}>
                    <ResumeRoute />
                  </Suspense>
                }
              />
            </Routes>
          </ActiveSectionProvider>
        </Router>
      </LocaleProvider>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
      <Analytics />
    </ThemeProvider>
  );
}

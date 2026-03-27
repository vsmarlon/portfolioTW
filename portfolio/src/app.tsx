import { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { ActiveSectionProvider } from './contexts/ActiveSectionContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Terminal from './components/Terminal';
import SectionTimeline from './components/SectionTimeline';
import NotFound from './components/NotFound';
import { usePerformanceMode } from './hooks/usePerformanceMode';
import { getRouteScrollKey, RouteScrollMemory } from './utils/routeScrollMemory';
import { scheduleHashScroll, scheduleScrollToPosition, scrollToTop } from './utils/scroll';

const Blog = lazy(() => import('./components/Blog'));
const queryClient = new QueryClient();

const MainPage = () => (
  <main className="flex flex-col min-h-screen relative">
    <Home />
    <About />
    <Projects />
    <Terminal />
    <Contact />
  </main>
);

const Background = () => (
  <div className="app-background">
    <div className="app-background-grid" />
    <div className="app-background-grain" />
  </div>
);

const ScrollHandler = () => {
  const { hash, pathname, search } = useLocation();
  const scrollMemoryRef = useRef(new RouteScrollMemory());
  const previousRouteKeyRef = useRef(getRouteScrollKey(pathname, search));

  useEffect(() => {
    const previousMode = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previousMode;
    };
  }, []);

  useEffect(() => {
    const currentRouteKey = getRouteScrollKey(pathname, search);
    const previousRouteKey = previousRouteKeyRef.current;

    if (previousRouteKey !== currentRouteKey) {
      scrollMemoryRef.current.save(previousRouteKey, window.scrollY);
      previousRouteKeyRef.current = currentRouteKey;
    }

    if (hash) {
      return scheduleHashScroll(hash);
    }

    const savedPosition = scrollMemoryRef.current.read(currentRouteKey);

    if (typeof savedPosition === 'number') {
      return scheduleScrollToPosition(savedPosition);
    }

    scrollToTop();
    return undefined;
  }, [hash, pathname, search]);

  return null;
};

export function App() {
  usePerformanceMode();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <ActiveSectionProvider>
            <Background />
            <ScrollHandler />
            <Header />
            <SectionTimeline />
            <Routes>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </ActiveSectionProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

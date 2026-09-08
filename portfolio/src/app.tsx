import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { ActiveSectionProvider } from './contexts/ActiveSectionContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import Home from './components/Home';
import Projects from './components/Projects';
import NotFound from './components/NotFound';
import ScrollHandler from './components/ScrollHandler';
import EngineeringSystems from './components/EngineeringSystems';
import About from './components/About';
import LatestWriting from './components/LatestWriting';
import Contact from './components/Contact';
import FreebayCaseStudy from './components/FreebayCaseStudy';
import { usePerformanceMode } from './hooks/usePerformanceMode';

const Blog = lazy(() => import('./components/Blog'));
const queryClient = new QueryClient();

const MainPage = () => (
  <main className="flex flex-col min-h-screen relative">
    <Home />
    <Projects />
    <EngineeringSystems />
    <About />
    <LatestWriting />
    <Contact />
  </main>
);

const Background = () => (
  <div className="app-background">
    <div className="app-background-grid" />
    <div className="app-background-grain" />
  </div>
);

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
              <Route path="/projects/freebay" element={<FreebayCaseStudy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </ActiveSectionProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

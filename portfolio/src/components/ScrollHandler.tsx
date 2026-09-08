import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { scheduleHashScroll, scrollToTop } from '../utils/scroll';

const ScrollHandler = () => {
  const { hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') return;

    if (hash) {
      return scheduleHashScroll(hash);
    }

    scrollToTop();
  }, [hash, navigationType]);

  return null;
};

export default ScrollHandler;

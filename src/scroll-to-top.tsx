import { useEffect } from "react";
import type { RefObject } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
}

export default function ScrollToTop({ scrollContainerRef }: ScrollToTopProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", 
      });
    }
  }, [pathname, scrollContainerRef]);

  return null; 
}
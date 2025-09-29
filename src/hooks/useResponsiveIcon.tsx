import { useEffect, useState } from 'react';

const useResponsiveIconSize = () => {
  const [iconSize, setIconSize] = useState(20);

  useEffect(() => {
    const updateSize = () => {
      setIconSize(window.innerWidth >= 768 ? 24 : 20);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return iconSize;
};

export default useResponsiveIconSize
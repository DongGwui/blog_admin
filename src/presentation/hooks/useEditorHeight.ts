import { useState, useEffect, useCallback, useRef } from 'react';

interface UseEditorHeightOptions {
  headerHeight?: number;
  titleAreaHeight?: number;
  padding?: number;
}

interface UseEditorHeightReturn {
  editorHeight: number;
  containerRef: (node: HTMLDivElement | null) => void;
}

// 디바운스 딜레이 (ms)
const RESIZE_DEBOUNCE_DELAY = 100;

export function useEditorHeight(options: UseEditorHeightOptions = {}): UseEditorHeightReturn {
  const { headerHeight = 57, titleAreaHeight = 80, padding = 32 } = options;
  const [editorHeight, setEditorHeight] = useState(500);
  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainerNode(node);
  }, []);

  useEffect(() => {
    const calculateHeight = () => {
      if (containerNode) {
        // Use container's actual height
        const containerHeight = containerNode.clientHeight;
        const calculatedHeight = containerHeight - padding;
        setEditorHeight(Math.max(300, calculatedHeight));
      } else {
        // Fallback: calculate from viewport
        const viewportHeight = window.innerHeight;
        const calculatedHeight = viewportHeight - headerHeight - titleAreaHeight - padding;
        setEditorHeight(Math.max(300, calculatedHeight));
      }
    };

    // 디바운스된 resize 핸들러
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(calculateHeight, RESIZE_DEBOUNCE_DELAY);
    };

    // 초기 계산
    calculateHeight();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [containerNode, headerHeight, titleAreaHeight, padding]);

  return {
    editorHeight,
    containerRef,
  };
}

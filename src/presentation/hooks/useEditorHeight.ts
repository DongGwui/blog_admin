import { useState, useEffect, useCallback } from 'react';

interface UseEditorHeightOptions {
  headerHeight?: number;
  titleAreaHeight?: number;
  padding?: number;
}

interface UseEditorHeightReturn {
  editorHeight: number;
  containerRef: (node: HTMLDivElement | null) => void;
}

export function useEditorHeight(options: UseEditorHeightOptions = {}): UseEditorHeightReturn {
  const { headerHeight = 57, titleAreaHeight = 80, padding = 32 } = options;
  const [editorHeight, setEditorHeight] = useState(500);
  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(null);

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

    calculateHeight();

    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, [containerNode, headerHeight, titleAreaHeight, padding]);

  return {
    editorHeight,
    containerRef,
  };
}

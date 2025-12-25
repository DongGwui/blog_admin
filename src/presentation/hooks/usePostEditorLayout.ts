import { useState, useCallback } from 'react';

export type PreviewMode = 'edit' | 'preview' | 'live';

interface UsePostEditorLayoutReturn {
  // Settings panel state
  isSettingsPanelOpen: boolean;
  openSettingsPanel: () => void;
  closeSettingsPanel: () => void;
  toggleSettingsPanel: () => void;

  // Preview mode state
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;

  // Fullscreen mode
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export function usePostEditorLayout(): UsePostEditorLayoutReturn {
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('live');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openSettingsPanel = useCallback(() => {
    setIsSettingsPanelOpen(true);
  }, []);

  const closeSettingsPanel = useCallback(() => {
    setIsSettingsPanelOpen(false);
  }, []);

  const toggleSettingsPanel = useCallback(() => {
    setIsSettingsPanelOpen((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  return {
    isSettingsPanelOpen,
    openSettingsPanel,
    closeSettingsPanel,
    toggleSettingsPanel,
    previewMode,
    setPreviewMode,
    isFullscreen,
    toggleFullscreen,
  };
}

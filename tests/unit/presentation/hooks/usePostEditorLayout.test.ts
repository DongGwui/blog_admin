import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePostEditorLayout } from '@/presentation/hooks/usePostEditorLayout';

describe('usePostEditorLayout', () => {
  describe('settings panel state', () => {
    it('should initialize with settings panel closed', () => {
      const { result } = renderHook(() => usePostEditorLayout());

      expect(result.current.isSettingsPanelOpen).toBe(false);
    });

    it('should open settings panel when openSettingsPanel is called', () => {
      const { result } = renderHook(() => usePostEditorLayout());

      act(() => {
        result.current.openSettingsPanel();
      });

      expect(result.current.isSettingsPanelOpen).toBe(true);
    });

    it('should close settings panel when closeSettingsPanel is called', () => {
      const { result } = renderHook(() => usePostEditorLayout());

      act(() => {
        result.current.openSettingsPanel();
      });
      expect(result.current.isSettingsPanelOpen).toBe(true);

      act(() => {
        result.current.closeSettingsPanel();
      });
      expect(result.current.isSettingsPanelOpen).toBe(false);
    });

    it('should toggle settings panel state', () => {
      const { result } = renderHook(() => usePostEditorLayout());

      // Initially closed
      expect(result.current.isSettingsPanelOpen).toBe(false);

      // Toggle to open
      act(() => {
        result.current.toggleSettingsPanel();
      });
      expect(result.current.isSettingsPanelOpen).toBe(true);

      // Toggle to close
      act(() => {
        result.current.toggleSettingsPanel();
      });
      expect(result.current.isSettingsPanelOpen).toBe(false);
    });
  });

  describe('preview mode state', () => {
    it('should initialize with live preview mode', () => {
      const { result } = renderHook(() => usePostEditorLayout());

      expect(result.current.previewMode).toBe('live');
    });

    it('should change preview mode', () => {
      const { result } = renderHook(() => usePostEditorLayout());

      act(() => {
        result.current.setPreviewMode('edit');
      });
      expect(result.current.previewMode).toBe('edit');

      act(() => {
        result.current.setPreviewMode('preview');
      });
      expect(result.current.previewMode).toBe('preview');

      act(() => {
        result.current.setPreviewMode('live');
      });
      expect(result.current.previewMode).toBe('live');
    });
  });

  describe('fullscreen mode state', () => {
    it('should initialize with fullscreen disabled', () => {
      const { result } = renderHook(() => usePostEditorLayout());

      expect(result.current.isFullscreen).toBe(false);
    });

    it('should toggle fullscreen mode', () => {
      const { result } = renderHook(() => usePostEditorLayout());

      act(() => {
        result.current.toggleFullscreen();
      });
      expect(result.current.isFullscreen).toBe(true);

      act(() => {
        result.current.toggleFullscreen();
      });
      expect(result.current.isFullscreen).toBe(false);
    });
  });
});

import { createContext, useContext, useState, useCallback, useRef, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CalendarEvent, CalendarEventWeek, CalendarEventList } from './calendar';

interface TooltipState {
  isVisible: boolean;
  event: (CalendarEvent | CalendarEventWeek | CalendarEventList) | null;
  position: { x: number; y: number };
  isMouseOverTooltip: boolean;
}

interface TooltipContextType {
  tooltipState: TooltipState;
  showTooltip: (event: CalendarEvent | CalendarEventWeek | CalendarEventList, position: { x: number; y: number }) => void;
  hideTooltip: () => void;
  scheduleHideTooltip: () => void;
  clearHideTimeout: () => void;
  setMouseOverTooltip: (isOver: boolean) => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

interface TooltipProviderProps {
  children: ReactNode;
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    isVisible: false,
    event: null,
    position: { x: 0, y: 0 },
    isMouseOverTooltip: false
  });
  
  const hideTimeoutRef = useRef<number | null>(null);

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const showTooltip = useCallback((event: CalendarEvent | CalendarEventWeek | CalendarEventList, position: { x: number; y: number }) => {
    // Cancelar qualquer timeout de fechamento pendente
    clearHideTimeout();
    
    setTooltipState({
      isVisible: true,
      event,
      position,
      isMouseOverTooltip: false
    });
  }, [clearHideTimeout]);

  const hideTooltip = useCallback(() => {
    setTooltipState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const scheduleHideTooltip = useCallback(() => {
    // Cancelar qualquer timeout anterior
    clearHideTimeout();
    
    // Agendar novo timeout para fechar o tooltip
    hideTimeoutRef.current = setTimeout(() => {
      hideTooltip();
    }, 100);
    
  }, [clearHideTimeout, hideTooltip, tooltipState.isMouseOverTooltip]);

  const setMouseOverTooltip = useCallback((isOver: boolean) => {
    setTooltipState(prev => ({
      ...prev,
      isMouseOverTooltip: isOver
    }));
  }, []);

  // Adicionar suporte a teclado (ESC para fechar)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && tooltipState.isVisible) {
        hideTooltip();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [tooltipState.isVisible, hideTooltip]);

  const contextValue = useMemo(() => ({
    tooltipState,
    showTooltip,
    hideTooltip,
    scheduleHideTooltip,
    clearHideTimeout,
    setMouseOverTooltip
  }), [tooltipState, showTooltip, hideTooltip, scheduleHideTooltip, clearHideTimeout, setMouseOverTooltip]);

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  );
}

export function useTooltip() {
  const context = useContext(TooltipContext);
  if (context === undefined) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
}

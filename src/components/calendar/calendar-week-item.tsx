import React, { useState, useRef, useEffect } from 'react';
import type { TooltipComponentProps, CalendarEventWeek, EventComponentProps } from './calendar';
import type { ReactNode } from 'react';
import { CalendarItemTooltip, calculateTooltipPosition } from './calendar-item-tooltip';

interface CalendarWeekItemProps {
  event: CalendarEventWeek;
  index: number;
  top: number;
  adjustedLeft: number;
  adjustedWidth: number;
  height: number;
  eventClick?: (event: CalendarEventWeek) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
}

export function CalendarWeekItem({ event, index, top, adjustedLeft, adjustedWidth, height, eventClick, tooltipComponent, eventComponent}: CalendarWeekItemProps) {
  // Estados para o tooltip
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isMouseOverTooltip, setIsMouseOverTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup dos timeouts quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handlers para o tooltip
  const handleMouseEnter = (e: React.MouseEvent) => {
    const calculatedPosition = calculateTooltipPosition(e.clientX, e.clientY);
    setTooltipPosition(calculatedPosition);
    setIsTooltipVisible(true);
    setIsMouseOverTooltip(false);
    
    // Limpar timeout se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    // Limpar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Só fechar o tooltip se o mouse não estiver sobre ele
    if (!isMouseOverTooltip) {
      timeoutRef.current = setTimeout(() => {
        setIsTooltipVisible(false);
      }, 300); // Aumentar delay para dar mais tempo
    }
  };

  const handleTooltipMouseEnter = () => {
    setIsMouseOverTooltip(true);
    // Limpar timeout se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    setIsMouseOverTooltip(false);
    // Limpar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Adicionar um pequeno delay para permitir transição suave
    timeoutRef.current = setTimeout(() => {
      setIsTooltipVisible(false);
    }, 150);
  };

  // Função para renderizar o tooltip
  const renderTooltip = () => {
    if (!isTooltipVisible) return null;

    // Se um componente customizado foi fornecido
    if (tooltipComponent) {
      const customTooltip = tooltipComponent({ event });
      
      // Se o componente customizado retornou algo
      if (customTooltip) {
        return (
          <div
            className="fixed z-50 transform -translate-y-full pointer-events-auto"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
            }}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
            onClick={e => {
              e.stopPropagation();
            }}
          >
            {customTooltip}
          </div>
        );
      }
    }

    // Caso contrário, usar o tooltip padrão
    return (
      <CalendarItemTooltip
        event={event}
        isVisible={isTooltipVisible}
        position={tooltipPosition}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
      />
    );
  };

  // Função para renderizar o evento
  const renderEvent = () => {
    // Se um componente customizado foi fornecido
    if (eventComponent) {
      const customEvent = eventComponent({ event });
      
      // Se o componente customizado retornou algo, renderize-o
      if (customEvent) {
        return (
          <div
            className="absolute cursor-pointer z-10 overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-lg hover:z-50"
            style={{
              top: `${top}px`,
              left: `${adjustedLeft}%`,
              width: `${adjustedWidth}%`,
              maxWidth: '200px',
              height: `${height}px`,
              pointerEvents: 'auto'
            }}
            onClick={() => eventClick?.(event)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {customEvent}
          </div>
        );
      }
    }

    // Caso contrário, use o evento padrão
    return (
      <div
        key={`${event.title}-${index}`}
        className={`absolute text-white text-xs p-1 rounded cursor-pointer z-10 overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-lg hover:z-50`}
        style={{
          top: `${top}px`,
          left: `${adjustedLeft}%`,
          width: `${adjustedWidth}%`,
          maxWidth: '200px',
          height: `${height}px`,
          backgroundColor: event.color || '#5abff2',
          pointerEvents: 'auto'
        }}
        onClick={() => eventClick?.(event)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {event.title}
      </div>
    );
  };

  return (
    <>
      {renderEvent()}
      
      {/* Tooltip */}
      {renderTooltip()}
    </>
  );
}
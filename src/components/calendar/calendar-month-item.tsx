import React, { useState, useRef, useEffect } from 'react';
import type { CalendarEvent, EventComponentProps, TooltipComponentProps } from './calendar';
import type { ReactNode } from 'react';
import { CalendarItemTooltip, calculateTooltipPosition } from './calendar-item-tooltip';

interface CalendarItemProps {
  event: CalendarEvent;
  eventClick?: (event: CalendarEvent) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
}

export function CalendarMonthItem({ event, eventClick, tooltipComponent, eventComponent}: CalendarItemProps) {
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
      }, 300); // Pequeno delay para permitir transição suave
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
      
      // Se o componente customizado retornou algo, renderize-o com posicionamento
      if (customTooltip) {
        return (
          <div
            className="fixed z-50 transform -translate-y-full"
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

    // Caso contrário, use o tooltip padrão
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
            className="cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              eventClick && eventClick(event);
            }}
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
        className="rounded-md cursor-pointer mb-0.5"
        style={{backgroundColor: event.color || '#5abff2'}}
        onClick={e => {
          e.stopPropagation();
          eventClick && eventClick(event);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <p className="text-sm font-semibold pl-1 truncate whitespace-nowrap max-w-full">{event.title}</p>
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
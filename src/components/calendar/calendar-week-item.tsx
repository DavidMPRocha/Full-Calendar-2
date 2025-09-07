import React, { useEffect, memo } from 'react';
import type { TooltipComponentProps, CalendarEventWeek, EventComponentProps } from './calendar';
import type { ReactNode } from 'react';
import { CalendarItemTooltip, calculateTooltipPosition } from './calendar-item-tooltip';
import { useTooltip } from './tooltip-context';

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

const CalendarWeekItem = memo(function CalendarWeekItem({ event, index, top, adjustedLeft, adjustedWidth, height, eventClick, tooltipComponent, eventComponent}: CalendarWeekItemProps) {
  const { showTooltip, tooltipState, scheduleHideTooltip, clearHideTimeout, setMouseOverTooltip } = useTooltip();

  // Cleanup dos timeouts quando o componente for desmontado
  useEffect(() => {
    return () => {
      clearHideTimeout();
    };
  }, [clearHideTimeout]);

  // Handlers para o tooltip
  const handleMouseEnter = (e: React.MouseEvent) => {
    const calculatedPosition = calculateTooltipPosition(e.clientX, e.clientY);
    showTooltip(event, calculatedPosition);
  };

  const handleMouseLeave = () => {
    // Sempre agendar fechamento, mas o tooltip pode cancelar se o mouse estiver sobre ele
    scheduleHideTooltip();
  };

  const handleTooltipMouseEnter = () => {
    setMouseOverTooltip(true);
    clearHideTimeout();
  };

  const handleTooltipMouseLeave = () => {
    setMouseOverTooltip(false);
    scheduleHideTooltip();
  };

  // Função helper para comparar eventos
  const isSameEvent = (event1: any, event2: any) => {
    if (!event1 || !event2) return false;
    
    // Se ambos têm ID, comparar por ID
    if (event1.id && event2.id) {
      return event1.id === event2.id;
    }
    
    // Caso contrário, comparar por título e data
    return event1.title === event2.title && event1.date === event2.date;
  };

  // Função para renderizar o tooltip
  const renderTooltip = () => {
    if (!tooltipState.isVisible || !isSameEvent(tooltipState.event, event)) return null;

    // Se um componente customizado foi fornecido
    if (tooltipComponent) {
      const customTooltip = tooltipComponent({ event });
      
      // Se o componente customizado retornou algo
      if (customTooltip) {
        return (
          <div
            className="fixed z-50 transform -translate-y-full pointer-events-auto"
            style={{
              left: tooltipState.position.x,
              top: tooltipState.position.y,
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
        isVisible={tooltipState.isVisible}
        position={tooltipState.position}
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
});

export { CalendarWeekItem };
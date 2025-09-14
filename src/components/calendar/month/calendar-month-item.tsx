import React, { useEffect, memo } from 'react';
import type { CalendarEvent, EventComponentProps, TooltipComponentProps } from './../calendar';
import type { ReactNode } from 'react';
import { CalendarItemTooltip, calculateTooltipPosition } from './../calendar-item-tooltip';
import { useTooltip } from './../tooltip-context';

interface CalendarItemProps {
  event: CalendarEvent;
  eventClick?: (event: CalendarEvent) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
}

const CalendarMonthItem = memo(function CalendarMonthItem({ event, eventClick, tooltipComponent, eventComponent}: CalendarItemProps) {
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
      
      // Se o componente customizado retornou algo, renderize-o com posicionamento
      if (customTooltip) {
        return (
          <div
            className="fixed z-50 transform -translate-y-full"
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

    // Caso contrário, use o tooltip padrão
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
});

export { CalendarMonthItem };
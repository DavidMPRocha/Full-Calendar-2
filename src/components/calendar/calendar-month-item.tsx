import React, { useState } from 'react';
import type { CalendarEvent, EventComponentProps, TooltipComponentProps } from './calendar';
import type { ReactNode } from 'react';
import { CalendarItemTooltip } from './calendar-item-toltip';

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

  // Handlers para o tooltip
  const handleMouseEnter = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setIsTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
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
            className="fixed z-50"
            style={{
              left: tooltipPosition.x + 10,
              top: tooltipPosition.y - 10,
              transform: 'translateY(-100%)'
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
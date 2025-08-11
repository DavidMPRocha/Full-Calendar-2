import React, { useState } from 'react';
import type { TooltipComponentProps, CalendarEventWeek } from './calendar';
import type { ReactNode } from 'react';
import { CalendarItemTooltip } from './calendar-item-toltip';

interface CalendarWeekItemProps {
  event: CalendarEventWeek;
  index: number;
  top: number;
  adjustedLeft: number;
  adjustedWidth: number;
  height: number;
  eventClick?: (event: CalendarEventWeek) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
}

export function CalendarWeekItem({ event, index, top, adjustedLeft, adjustedWidth, height, eventClick, tooltipComponent}: CalendarWeekItemProps) {
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

    // Se um componente customizado foi fornecido entar usar
    if (tooltipComponent) {
      const customTooltip = tooltipComponent({ event });
      
      // Se o componente customizado retornou algo
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

    // Caso contrário, usar o tooltip padrão
    return (
      <CalendarItemTooltip
        event={event}
        isVisible={isTooltipVisible}
        position={tooltipPosition}
      />
    );
  };

  return (
    <>
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
      
      {/* Tooltip */}
      {renderTooltip()}
    </>
  );
}
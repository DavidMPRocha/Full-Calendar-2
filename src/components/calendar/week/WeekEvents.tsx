import { CalendarWeekItem } from './calendar-week-item';
import type { CalendarEventWeek, TooltipComponentProps, EventComponentProps } from '../calendar';
import type { ReactNode } from 'react';
import { getEventPosition, getRowHeight, type OptimizedPosition } from './hooks';

interface WeekEventsProps {
  events: CalendarEventWeek[];
  timeList: string[];
  timeInterval: 5 | 15 | 30;
  optimizedPositions: Record<number, OptimizedPosition>;
  eventClick?: (event: CalendarEventWeek) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
}

export function WeekEvents({
  events,
  timeList,
  timeInterval,
  optimizedPositions,
  eventClick,
  tooltipComponent,
  eventComponent
}: WeekEventsProps) {
  const renderEvent = (event: CalendarEventWeek, index: number) => {
    const position = getEventPosition(event, timeList);
    if (!position) return null;

    const rowHeight = getRowHeight(timeInterval);
    const top = position.startRow * rowHeight;
    const height = position.duration * rowHeight;
    
    // Obter posição otimizada
    const optimizedPosition = optimizedPositions[index];
    if (!optimizedPosition) return null;
    
    // Calcular largura e posição horizontal baseado no número de eventos sobrepostos
    const columnWidth = 100 / 7; // Largura de uma coluna (7 dias)
    const columnWidthWithMargin = 90 / 7;

    // Se não há sobreposições, o evento ocupa toda a largura da coluna
    let eventWidth, left;
    if (optimizedPosition.totalOverlapping === 1) {
      eventWidth = columnWidthWithMargin;
      left = position.column * columnWidth;
    } else {
      // Dividir a largura entre os eventos sobrepostos
      eventWidth = columnWidthWithMargin / optimizedPosition.totalOverlapping;
      left = position.column * columnWidth + (eventWidth * optimizedPosition.column);
    }
    
    // Adicionar pequena margem entre eventos para melhor visualização
    const adjustedWidth = eventWidth;
    const adjustedLeft = left;
    
    return (
      <CalendarWeekItem
        key={`${event.title}-${index}`}
        event={event}
        index={index}
        top={top}
        adjustedLeft={adjustedLeft}
        adjustedWidth={adjustedWidth}
        height={height}
        eventClick={eventClick}
        tooltipComponent={tooltipComponent}
        eventComponent={eventComponent}
      />
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {events.map((event, index) => renderEvent(event, index))}
    </div>
  );
}

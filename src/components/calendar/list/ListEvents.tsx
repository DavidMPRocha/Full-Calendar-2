import { CalendarWeekItem } from '../week/calendar-week-item';
import type { CalendarEventList, TooltipComponentProps, EventComponentProps } from '../calendar';
import type { ReactNode } from 'react';
import { getListEventPosition, type ListOptimizedPosition } from './hooks';
import { getRowHeight } from '../week/hooks/useTimeList';

interface ListEventsProps {
  events: CalendarEventList[];
  timeList: string[];
  listList: string[];
  timeInterval: 5 | 15 | 30;
  optimizedPositions: Record<number, ListOptimizedPosition>;
  eventClick?: (event: CalendarEventList) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
}

export function ListEvents({
  events,
  timeList,
  listList,
  timeInterval,
  optimizedPositions,
  eventClick,
  tooltipComponent,
  eventComponent
}: ListEventsProps) {
  const renderEvent = (event: CalendarEventList, index: number) => {
    const position = getListEventPosition(event, timeList, listList);
    if (!position) return null;

    const rowHeight = getRowHeight(timeInterval);
    const top = position.startRow * rowHeight;
    const height = position.duration * rowHeight;
    
    // Obter posição otimizada
    const optimizedPosition = optimizedPositions[index];
    if (!optimizedPosition) return null;
    
    // Calcular largura e posição horizontal baseado no número de eventos sobrepostos
    const columnWidth = 100 / listList.length;
    const columnWidthWithMargin = 90 / listList.length;

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
        eventClick={eventClick as any}
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

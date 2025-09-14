import { CalendarListHeader } from './calendar-list-header';
import { CalendarListRow } from './calendar-list-row';
import { CalendarHeaderHourList } from '../week/calendar-header-hour-list';
import type { TimeInterval } from '../week';
import type { CalendarEventList, TooltipComponentProps, EventComponentProps } from '../calendar';
import type { ReactNode } from 'react';
import { ListEvents } from './ListEvents';
import type { ListOptimizedPosition } from './hooks';

interface ListGridProps {
  timeList: string[];
  listList: string[];
  dateClick?: (date: string, time: string, list: string) => void;
  currentYear: number;
  currentMonth: number;
  currentDay: number;
  timeInterval: TimeInterval;
  events: CalendarEventList[];
  optimizedPositions: Record<number, ListOptimizedPosition>;
  eventClick?: (event: CalendarEventList) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
}

export function ListGrid({
  timeList,
  listList,
  dateClick,
  currentYear,
  currentMonth,
  currentDay,
  timeInterval,
  events,
  optimizedPositions,
  eventClick,
  tooltipComponent,
  eventComponent
}: ListGridProps) {
  return (
    <>
      {/* Header de listas */}
      <div className="ml-[50px]">
        <CalendarListHeader listList={listList}/>
      </div>
      <div className="relative flex max-h-full overflow-y-auto">
        {/* Header de horários */}
        <div className="w-[50px]">
          <CalendarHeaderHourList listTime={timeList} timeInterval={timeInterval} />
        </div>
        {/* Linhas de horários */}
        <div className="w-full relative">
          <CalendarListRow 
            listTime={timeList} 
            listList={listList} 
            dateClick={dateClick}
            currentYear={currentYear}
            currentMonth={currentMonth}
            currentDay={currentDay}
            timeInterval={timeInterval}
          />
          {/* Eventos posicionados dentro do container de scroll */}
          <ListEvents
            events={events}
            timeList={timeList}
            listList={listList}
            timeInterval={timeInterval}
            optimizedPositions={optimizedPositions}
            eventClick={eventClick}
            tooltipComponent={tooltipComponent}
            eventComponent={eventComponent}
          />
        </div>
      </div>
    </>
  );
}

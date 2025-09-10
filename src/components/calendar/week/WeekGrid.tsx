import { CalendarHeaderWeekList } from './calendar-header-week-list';
import { CalendarWeekRow } from './calendar-week-row';
import { CalendarHeaderHourList } from './calendar-header-hour-list';
import type { TimeInterval, OptimizedPosition } from './hooks';
import type { CalendarEventWeek, TooltipComponentProps, EventComponentProps } from '../calendar';
import type { ReactNode } from 'react';
import { WeekEvents } from './WeekEvents';

interface WeekGridProps {
  timeList: string[];
  dateClick?: (date: string, time: string) => void;
  currentWeek: number;
  currentYear: number;
  timeInterval: TimeInterval;
  events: CalendarEventWeek[];
  optimizedPositions: Record<number, OptimizedPosition>;
  eventClick?: (event: CalendarEventWeek) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
}

export function WeekGrid({
  timeList,
  dateClick,
  currentWeek,
  currentYear,
  timeInterval,
  events,
  optimizedPositions,
  eventClick,
  tooltipComponent,
  eventComponent
}: WeekGridProps) {
  return (
    <>
      {/* Header de dias de semana */}
      <div className="ml-[50px] overflow-y-auto">
        <CalendarHeaderWeekList/>
      </div>
      <div className="relative flex max-h-full overflow-y-auto">
        {/* Header de horários */}
        <div className="w-[50px]">
          <CalendarHeaderHourList listTime={timeList} timeInterval={timeInterval} />
        </div>
        {/* Linhas de horários */}
        <div className="w-full relative">
          <CalendarWeekRow 
            listTime={timeList} 
            dateClick={dateClick} 
            currentWeek={currentWeek} 
            currentYear={currentYear}
            timeInterval={timeInterval}
          />
          {/* Eventos posicionados dentro do container de scroll */}
          <WeekEvents
            events={events}
            timeList={timeList}
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

import { CalendarHeaderWeekList } from '../week/calendar-header-week-list';
import { CalendarMonthRow } from './calendar-month-row';
import type { TooltipComponentProps, EventComponentProps } from '../calendar';
import type { ReactNode } from 'react';
import type { CalendarWeek } from './hooks';

interface MonthGridProps {
  calendarData: CalendarWeek[];
  currentMonth: number;
  eventClick?: (event: any) => void;
  dateClick?: (date: string) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
}

export function MonthGrid({
  calendarData,
  currentMonth,
  eventClick,
  dateClick,
  tooltipComponent,
  eventComponent
}: MonthGridProps) {
  return (
    <>
      {/* Header de dias de semana */}
      <CalendarHeaderWeekList />
      {/* Lista de dias*/}
      {
        calendarData.map((week, index) => (
          <CalendarMonthRow 
            key={index} 
            days={week.days} 
            eventClick={eventClick} 
            dateClick={dateClick} 
            currentMonth={currentMonth}
            tooltipComponent={tooltipComponent}
            eventComponent={eventComponent}
          />
        ))
      }
    </>
  );
}

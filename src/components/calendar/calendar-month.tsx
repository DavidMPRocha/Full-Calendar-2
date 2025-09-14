import { useState } from "react";
import type { CalendarEvent, EventComponentProps, TooltipComponentProps } from "./calendar";
import type { ReactNode } from "react";
import { MonthNavigation, MonthGrid, useMonthData } from "./month";

interface CalendarMonthProps {
  type?: 'month' | 'list';
  year: number;
  month: number;
  events: CalendarEvent[];
  eventClick?: (event: CalendarEvent) => void;
  dateClick?: (date: string) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
}

// Re-exportar funções que são usadas em outros lugares
export { monthNames, getWeekNumberSundayStart } from './month';

export function CalendarMonth({year, month, events, eventClick, dateClick, tooltipComponent, eventComponent}: CalendarMonthProps) {
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);

  // Hook customizado para dados do mês
  const calendarData = useMonthData(events, currentYear, currentMonth);

  return (
    <div className="w-full h-full min-w-[500px] min-h-[500px]">
      <MonthNavigation
        currentMonth={currentMonth}
        currentYear={currentYear}
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
      />
      
      <MonthGrid
        calendarData={calendarData}
        currentMonth={currentMonth}
        eventClick={eventClick}
        dateClick={dateClick}
        tooltipComponent={tooltipComponent}
        eventComponent={eventComponent}
      />
    </div>
  )
}
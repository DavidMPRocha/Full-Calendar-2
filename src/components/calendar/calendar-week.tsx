import { useState } from "react";
import type { TooltipComponentProps, CalendarEventWeek, EventComponentProps } from "./calendar";
import type { ReactNode } from "react";
import { WeekNavigation, WeekGrid, useWeekDateRange, useTimeList, useEventPositions, type TimeInterval } from "./week";

interface CalendarWeekProps {
  type: 'week';
  year: number;
  week: number;
  events: CalendarEventWeek[];
  eventClick?: (event: CalendarEventWeek) => void;
  dateClick?: (date: string, time: string) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
  timeInterval?: TimeInterval;
}

export function CalendarWeek({year, week, events, eventClick, dateClick, tooltipComponent, eventComponent, timeInterval: initialTimeInterval}: CalendarWeekProps) {
  const [currentYear, setCurrentYear] = useState(year);
  const [currentWeek, setCurrentWeek] = useState(week);
  const [timeInterval, setTimeInterval] = useState<TimeInterval>(initialTimeInterval || 5);

  // Hooks customizados
  const weekDateRange = useWeekDateRange(currentYear, currentWeek);
  const timeList = useTimeList(timeInterval);
  
  // Filtrar eventos da semana atual
  const filteredEvents = events.filter(event => {
    const eventDate = event.date;
    return eventDate >= weekDateRange.start && eventDate <= weekDateRange.end;
  });

  // Calcular posições otimizadas dos eventos
  const optimizedPositions = useEventPositions(filteredEvents, timeList);

  return (
    <div className="w-full h-full">
      <WeekNavigation
        currentWeek={currentWeek}
        currentYear={currentYear}
        setCurrentWeek={setCurrentWeek}
        setCurrentYear={setCurrentYear}
        timeInterval={timeInterval}
        setTimeInterval={setTimeInterval}
      />
      
      <WeekGrid
        timeList={timeList}
        dateClick={dateClick}
        currentWeek={currentWeek}
        currentYear={currentYear}
        timeInterval={timeInterval}
        events={filteredEvents}
        optimizedPositions={optimizedPositions}
        eventClick={eventClick}
        tooltipComponent={tooltipComponent}
        eventComponent={eventComponent}
      />
    </div>
  )
}
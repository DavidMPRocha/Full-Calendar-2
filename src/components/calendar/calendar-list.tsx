import { useState } from "react";
import type { CalendarEventList, TooltipComponentProps, EventComponentProps } from "./calendar";
import type { ReactNode } from "react";
import { ListNavigation, ListGrid, useListData, useListEventPositions } from "./list";
import { useTimeList, type TimeInterval } from "./week";

interface CalendarListProps {
  type: 'list';
  year: number;
  month: number;
  day: number;
  events: CalendarEventList[];
  eventClick?: (event: CalendarEventList) => void;
  dateClick?: (date: string, time: string, list: string) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
  timeInterval?: TimeInterval;
}

export function CalendarList({year, month, day, events, eventClick, dateClick, tooltipComponent, eventComponent, timeInterval: initialTimeInterval}: CalendarListProps) {
  const [currentYear, setCurrentYear] = useState(year);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentDay, setCurrentDay] = useState(day);
  const [timeInterval, setTimeInterval] = useState<TimeInterval>(initialTimeInterval || 5);

  // Hooks customizados
  const { filteredEvents, listList } = useListData(events, currentYear, currentMonth, currentDay);
  const timeList = useTimeList(timeInterval);
  const optimizedPositions = useListEventPositions(filteredEvents, timeList, listList);

  return (
    <div className="w-full h-full">
      <ListNavigation
        currentDay={currentDay}
        currentMonth={currentMonth}
        currentYear={currentYear}
        setCurrentDay={setCurrentDay}
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
        timeInterval={timeInterval}
        setTimeInterval={setTimeInterval}
      />
      
      <ListGrid
        timeList={timeList}
        listList={listList}
        dateClick={dateClick}
        currentYear={currentYear}
        currentMonth={currentMonth}
        currentDay={currentDay}
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
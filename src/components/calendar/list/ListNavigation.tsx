import { CalendarListHeaderFilter } from './calendar-list-header-filter';
import type { TimeInterval } from '../week';

interface ListNavigationProps {
  currentDay: number;
  currentMonth: number;
  currentYear: number;
  setCurrentDay: (day: number) => void;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  timeInterval: TimeInterval;
  setTimeInterval: (interval: TimeInterval) => void;
}

export function ListNavigation({
  currentDay,
  currentMonth,
  currentYear,
  setCurrentDay,
  setCurrentMonth,
  setCurrentYear,
  timeInterval,
  setTimeInterval
}: ListNavigationProps) {
  return (
    <CalendarListHeaderFilter 
      currentDay={currentDay} 
      currentMonth={currentMonth} 
      currentYear={currentYear} 
      setCurrentDay={setCurrentDay} 
      setCurrentMonth={setCurrentMonth} 
      setCurrentYear={setCurrentYear}
      timeInterval={timeInterval}
      setTimeInterval={setTimeInterval}
    />
  );
}

import { CalendarWeekHeaderFilter } from './calendar-week-header-filter';
import type { TimeInterval } from './hooks';

interface WeekNavigationProps {
  currentWeek: number;
  currentYear: number;
  setCurrentWeek: (week: number) => void;
  setCurrentYear: (year: number) => void;
  timeInterval: TimeInterval;
  setTimeInterval: (interval: TimeInterval) => void;
}

export function WeekNavigation({
  currentWeek,
  currentYear,
  setCurrentWeek,
  setCurrentYear,
  timeInterval,
  setTimeInterval
}: WeekNavigationProps) {
  return (
    <CalendarWeekHeaderFilter 
      currentWeek={currentWeek} 
      currentYear={currentYear} 
      setCurrentWeek={setCurrentWeek} 
      setCurrentYear={setCurrentYear}
      timeInterval={timeInterval}
      setTimeInterval={setTimeInterval}
    />
  );
}

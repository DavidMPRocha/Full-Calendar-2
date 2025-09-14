import { CalendarMonthHeaderFilter } from './calendar-month-header-filter';

interface MonthNavigationProps {
  currentMonth: number;
  currentYear: number;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
}

export function MonthNavigation({
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear
}: MonthNavigationProps) {
  return (
    <CalendarMonthHeaderFilter 
      currentMonth={currentMonth}
      currentYear={currentYear}
      setCurrentMonth={setCurrentMonth}
      setCurrentYear={setCurrentYear}
    />
  );
}

import { useState, useMemo } from "react";
import type { CalendarDay, CalendarEvent, EventComponentProps, TooltipComponentProps } from "./calendar";
import type { ReactNode } from "react";
import { CalendarHeaderWeekList } from "./calendar-header-week-list";
import { CalendarMonthRow } from "./calendar-month-row";
import { CalendarMonthHeaderFilter } from "./calendar-month-header-filter";

interface CalendarWeek {
  week: number;
  year: number;
  days: CalendarDay[];
}

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

export const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function getWeekNumberSundayStart(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1); // 1º de janeiro
  const dayOfWeekStart = startOfYear.getDay(); // 0 = domingo, 1 = segunda, 2 = terça, 3 = quarta, 4 = quinta, 5 = sexta, 6 = sábado

  // Diferença em milissegundos entre a data e o começo do ano
  const diffInMs = date.getTime() - startOfYear.getTime();

  // Dias desde o início do ano
  const daysPassed = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Ajusta para o início da semana começando no domingo
  const weekNumber = Math.floor((daysPassed + dayOfWeekStart) / 7) + 1;

  return weekNumber + 1; 
}

export function CalendarMonth({type, year, month, events, eventClick, dateClick, tooltipComponent, eventComponent}: CalendarMonthProps) {
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);

  const calendarData = useMemo(() => {
    return getWeeksInMonth(currentYear, currentMonth);
  }, [currentYear, currentMonth, events]);

  function getWeeksInMonth(year: number, month: number) {
    const calendarDataTemp: CalendarWeek[] = [];
    const firstDay = new Date(year, (month-1), 1);
    const lastDay = new Date(year, (month-1) + 1, 0);

    // Começa no domingo da primeira semana do mês
    const current = new Date(firstDay);
    current.setDate(current.getDate() - current.getDay());

    while (current <= lastDay || current.getMonth() === (month-1)) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = current.getDate();
        const monthNum = current.getMonth() + 1;
        const yearNum = current.getFullYear();

        // Formato ISO para comparar datas (yyyy-mm-dd)
        const currentDateStr = `${yearNum.toString().padStart(4, '0')}-${monthNum.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        const dayEvents = events.filter(ev => ev.date === currentDateStr);
        days.push({
          day,
          month: monthNum,
          year: yearNum,
          events: dayEvents,
        });
        current.setDate(current.getDate() + 1);
      }
      calendarDataTemp.push({
        week: getWeekNumberSundayStart(new Date(days[0].year, days[0].month - 1, days[0].day)), // semana do ano começando no domingo
        year: year,
        days,
      });
    }

    return calendarDataTemp;
  }

  return (
    <div className="w-full h-full min-w-[500px] min-h-[500px]">
      {/* Header de navegação */}
      <CalendarMonthHeaderFilter 
        currentMonth={currentMonth}
        currentYear={currentYear}
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
      />
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
    </div>
  )
}
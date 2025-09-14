import { useMemo } from 'react';
import type { CalendarDay, CalendarEvent } from '../../calendar';

export interface CalendarWeek {
  week: number;
  year: number;
  days: CalendarDay[];
}

/**
 * Hook para gerenciar dados específicos da visualização mensal
 */
export function useMonthData(events: CalendarEvent[], year: number, month: number): CalendarWeek[] {
  return useMemo(() => {
    return getWeeksInMonth(year, month, events);
  }, [year, month, events]);
}

/**
 * Função para calcular o número da semana começando no domingo
 */
export function getWeekNumberSundayStart(date: Date): number {
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

/**
 * Função para gerar as semanas do mês
 */
function getWeeksInMonth(year: number, month: number, events: CalendarEvent[]): CalendarWeek[] {
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

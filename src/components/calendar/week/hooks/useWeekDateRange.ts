import { useMemo } from 'react';

export interface WeekDateRange {
  start: string;
  end: string;
}

/**
 * Hook para calcular o range de datas da semana atual
 */
export function useWeekDateRange(year: number, week: number): WeekDateRange {
  return useMemo(() => {
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    
    // Calcular o primeiro dia da semana
    const daysToAdd = (week - 1) * 7 - dayOfWeek;
    const startDate = new Date(year, 0, 1 + daysToAdd);
    
    // Calcular o último dia da semana (sábado)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    // Formatar as datas
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return {
      start: formatDate(startDate),
      end: formatDate(endDate)
    };
  }, [year, week]);
}

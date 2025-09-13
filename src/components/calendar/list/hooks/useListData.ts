import { useMemo } from 'react';
import type { CalendarEventList } from '../../calendar';

/**
 * Hook para gerenciar dados específicos da visualização lista
 */
export function useListData(events: CalendarEventList[], year: number, month: number, day: number) {
  // Filtrar eventos do dia atual
  const filteredEvents = useMemo(() => {
    const currentDateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return events.filter(event => event.date === currentDateStr);
  }, [events, year, month, day]);

  // Extrair listas únicas dos eventos
  const listList = useMemo(() => {
    const uniqueLists = [...new Set(filteredEvents.map(event => event.list))];
    return uniqueLists.length > 0 ? uniqueLists : ["default"];
  }, [filteredEvents]);

  return {
    filteredEvents,
    listList
  };
}

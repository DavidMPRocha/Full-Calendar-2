import { useMemo } from 'react';
import type { CalendarEventList } from '../../calendar';
import { timeToMinutes } from '../../week/hooks/useTimeList';

export interface ListEventPosition {
  startRow: number;
  endRow: number;
  column: number;
  duration: number;
  totalOverlapping: number;
  eventIndex: number;
}

export interface ListOptimizedPosition {
  column: number;
  totalOverlapping: number;
}

/**
 * Hook para calcular posições de eventos na visualização lista
 */
export function useListEventPositions(
  events: CalendarEventList[],
  timeList: string[],
  listList: string[]
): Record<number, ListOptimizedPosition> {
  return useMemo(() => {
    const positions: { [eventIndex: number]: ListOptimizedPosition } = {};

    // Agrupar índices de eventos por lista
    const eventsByList: { [listName: string]: number[] } = {};

    events.forEach((event, idx) => {
      if (!event.dateStart) return;

      const listName = event.list;

      if (!eventsByList[listName]) {
        eventsByList[listName] = [];
      }
      eventsByList[listName].push(idx);
    });

    // Para cada lista, calcular posições otimizadas
    Object.keys(eventsByList).forEach(listName => {
      const listEventIndices = eventsByList[listName];

      // Ordenar índices por horário de início
      listEventIndices.sort((aIdx, bIdx) => {
        const startA = timeToMinutes(events[aIdx].dateStart?.split(' ')[1] || '00:00');
        const startB = timeToMinutes(events[bIdx].dateStart?.split(' ')[1] || '00:00');
        return startA - startB;
      });

      // Para cada evento, encontrar a primeira coluna disponível
      listEventIndices.forEach(eventIndex => {
        const event = events[eventIndex];

        // Encontrar todos os eventos que se sobrepõem com este evento
        const overlappingIndices = listEventIndices.filter(otherIndex =>
          otherIndex !== eventIndex && eventsOverlap(event, events[otherIndex])
        );

        // Calcular o máximo de eventos sobrepostos simultaneamente
        let maxOverlapping = 1;
        const relevantIndices = [eventIndex, ...overlappingIndices];

        relevantIndices.forEach(checkIndex => {
          const checkStart = timeToMinutes(events[checkIndex].dateStart?.split(' ')[1] || '00:00');
          const checkEnd = timeToMinutes(events[checkIndex].dateEnd?.split(' ')[1] || '00:00');

          let maxSimultaneous = 1;
          for (let minute = checkStart; minute < checkEnd; minute++) {
            let simultaneousCount = 0;

            relevantIndices.forEach(otherIndex => {
              const otherStart = timeToMinutes(events[otherIndex].dateStart?.split(' ')[1] || '00:00');
              const otherEnd = timeToMinutes(events[otherIndex].dateEnd?.split(' ')[1] || '00:00');

              if (minute >= otherStart && minute < otherEnd) {
                simultaneousCount++;
              }
            });

            maxSimultaneous = Math.max(maxSimultaneous, simultaneousCount);
          }

          maxOverlapping = Math.max(maxOverlapping, maxSimultaneous);
        });

        // Verificar se há espaço livre para expandir
        let availableColumns = maxOverlapping;
        if (overlappingIndices.length + 1 < maxOverlapping) {
          availableColumns = overlappingIndices.length + 1;
        }

        // Se não há sobreposições, usar a primeira coluna disponível
        if (overlappingIndices.length === 0) {
          positions[eventIndex] = { column: 0, totalOverlapping: 1 };
          return;
        }

        // Encontrar a primeira coluna disponível
        let availableColumn = 0;
        const usedColumns = new Set<number>();

        overlappingIndices.forEach(overlappingIndex => {
          const existingPosition = positions[overlappingIndex];
          if (existingPosition) {
            usedColumns.add(existingPosition.column);
          }
        });

        while (usedColumns.has(availableColumn)) {
          availableColumn++;
        }

        positions[eventIndex] = {
          column: availableColumn,
          totalOverlapping: availableColumns
        };
      });
    });

    return positions;
  }, [events, timeList, listList]);
}

/**
 * Função para verificar se dois eventos se sobrepõem
 */
function eventsOverlap(event1: CalendarEventList, event2: CalendarEventList): boolean {
  if (!event1.dateStart || !event1.dateEnd || !event2.dateStart || !event2.dateEnd) return false;
  
  const start1 = timeToMinutes(event1.dateStart.split(' ')[1]);
  const end1 = timeToMinutes(event1.dateEnd.split(' ')[1]);
  const start2 = timeToMinutes(event2.dateStart.split(' ')[1]);
  const end2 = timeToMinutes(event2.dateEnd.split(' ')[1]);
  
  return start1 < end2 && start2 < end1;
}

/**
 * Função para calcular a posição de um evento no grid da lista
 */
export function getListEventPosition(
  event: CalendarEventList,
  timeList: string[],
  listList: string[]
): ListEventPosition | null {
  if (!event.dateStart || !event.dateEnd) return null;

  const startTime = event.dateStart.split(' ')[1];
  const endTime = event.dateEnd.split(' ')[1];
  
  // Encontrar o índice mais próximo para startTime
  let startIndex = timeList.findIndex(time => time === startTime);
  if (startIndex === -1) {
    const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    let minDiff = Infinity;
    timeList.forEach((time, index) => {
      const timeMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
      const diff = Math.abs(timeMinutes - startMinutes);
      if (diff < minDiff) {
        minDiff = diff;
        startIndex = index;
      }
    });
  }
  
  // Encontrar o índice mais próximo para endTime
  let endIndex = timeList.findIndex(time => time === endTime);
  if (endIndex === -1) {
    const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
    let minDiff = Infinity;
    timeList.forEach((time, index) => {
      const timeMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
      const diff = Math.abs(timeMinutes - endMinutes);
      if (diff < minDiff) {
        minDiff = diff;
        endIndex = index;
      }
    });
  }
  
  if (startIndex === -1 || endIndex === -1) return null;

  // Para list view, usar o índice da lista como coluna
  const listIndex = listList.indexOf(event.list);
  const column = listIndex !== -1 ? listIndex : 0;
  
  return {
    startRow: startIndex,
    endRow: endIndex,
    column: column,
    duration: Math.max(1, endIndex - startIndex),
    totalOverlapping: 1, // Será calculado na função de renderização
    eventIndex: 0 // Será calculado na função de renderização
  };
}

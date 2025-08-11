import { useState, useMemo } from "react";
import type { CalendarEventList, TooltipComponentProps } from "./calendar";
import type { ReactNode } from "react";
import { CalendarHeaderHourList } from "./calendar-header-hour-list";
import { CalendarListHeaderFilter } from "./calendar-list-header-filter";
import { CalendarListRow } from "./calendar-list-row";
import { CalendarListHeader } from "./calendar-list-header";
import { CalendarWeekItem } from "./calendar-week-item";

interface CalendarListProps {
  type: 'list';
  year: number;
  month: number;
  day: number;
  events: CalendarEventList[];
  eventClick?: (event: CalendarEventList) => void;
  dateClick?: (date: string, time: string, list: string) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
}

export function CalendarList({type, year, month, day, events, eventClick, dateClick, tooltipComponent}: CalendarListProps) {
  const [currentYear, setCurrentYear] = useState(year);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentDay, setCurrentDay] = useState(day);
  const [listTime, setListTime] = useState<string[]>([
    "00:00", "00:05", "00:10", "00:15", "00:20", "00:25", "00:30", "00:35", "00:40", "00:45", "00:50", "00:55","01:00", "01:05", "01:10", "01:15", "01:20", "01:25", "01:30", "01:35", "01:40", "01:45", "01:50", "01:55","02:00", "02:05", "02:10", "02:15", "02:20", "02:25", "02:30", "02:35", "02:40", "02:45", "02:50", "02:55","03:00", "03:05", "03:10", "03:15", "03:20", "03:25", "03:30", "03:35", "03:40", "03:45", "03:50", "03:55","04:00", "04:05", "04:10", "04:15", "04:20", "04:25", "04:30", "04:35", "04:40", "04:45", "04:50", "04:55","05:00", "05:05", "05:10", "05:15", "05:20", "05:25", "05:30", "05:35", "05:40", "05:45", "05:50", "05:55","06:00", "06:05", "06:10", "06:15", "06:20", "06:25", "06:30", "06:35", "06:40", "06:45", "06:50", "06:55","07:00", "07:05", "07:10", "07:15", "07:20", "07:25", "07:30", "07:35", "07:40", "07:45", "07:50", "07:55","08:00", "08:05", "08:10", "08:15", "08:20", "08:25", "08:30", "08:35", "08:40", "08:45", "08:50", "08:55", "09:00", "09:05", "09:10", "09:15", "09:20", "09:25", "09:30", "09:35", "09:40", "09:45", "09:50", "09:55", "10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30", "10:35", "10:40", "10:45", "10:50", "10:55", "11:00", "11:05", "11:10", "11:15", "11:20", "11:25", "11:30", "11:35", "11:40", "11:45", "11:50", "11:55",
    "12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30", "12:35", "12:40", "12:45", "12:50", "12:55","13:00", "13:05", "13:10", "13:15", "13:20", "13:25", "13:30", "13:35", "13:40", "13:45", "13:50", "13:55","14:00", "14:05", "14:10", "14:15", "14:20", "14:25", "14:30", "14:35", "14:40", "14:45", "14:50", "14:55","15:00", "15:05", "15:10", "15:15", "15:20", "15:25", "15:30", "15:35", "15:40", "15:45", "15:50", "15:55","16:00", "16:05", "16:10", "16:15", "16:20", "16:25", "16:30", "16:35", "16:40", "16:45", "16:50", "16:55","17:00", "17:05", "17:10", "17:15", "17:20", "17:25", "17:30", "17:35", "17:40", "17:45", "17:50", "17:55","18:00", "18:05", "18:10", "18:15", "18:20", "18:25", "18:30", "18:35", "18:40", "18:45", "18:50", "18:55","19:00", "19:05", "19:10", "19:15", "19:20", "19:25", "19:30", "19:35", "19:40", "19:45", "19:50", "19:55","20:00", "20:05", "20:10", "20:15", "20:20", "20:25", "20:30", "20:35", "20:40", "20:45", "20:50", "20:55","21:00", "21:05", "21:10", "21:15", "21:20", "21:25", "21:30", "21:35", "21:40", "21:45", "21:50", "21:55","22:00", "22:05", "22:10", "22:15", "22:20", "22:25", "22:30", "22:35", "22:40", "22:45", "22:50", "22:55","23:00", "23:05", "23:10", "23:15", "23:20", "23:25", "23:30", "23:35", "23:40", "23:45", "23:50", "23:55",
  ]);
  
  // Extrair listas únicas dos eventos
  const listList = useMemo(() => {
    const uniqueLists = [...new Set(events.map(event => event.list))];
    return uniqueLists.length > 0 ? uniqueLists : ["default"];
  }, [events]);

  // Função para converter tempo para minutos
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Função para verificar se dois eventos se sobrepõem
  const eventsOverlap = (event1: CalendarEventList, event2: CalendarEventList): boolean => {
    if (!event1.dateStart || !event1.dateEnd || !event2.dateStart || !event2.dateEnd) return false;
    
    const start1 = timeToMinutes(event1.dateStart.split(' ')[1]);
    const end1 = timeToMinutes(event1.dateEnd.split(' ')[1]);
    const start2 = timeToMinutes(event2.dateStart.split(' ')[1]);
    const end2 = timeToMinutes(event2.dateEnd.split(' ')[1]);
    
    return start1 < end2 && start2 < end1;
  };

  // Função para calcular a posição de um evento no grid
  const getEventPosition = (event: CalendarEventList) => {
    if (!event.dateStart || !event.dateEnd) return null;

    const startTime = event.dateStart.split(' ')[1];
    const endTime = event.dateEnd.split(' ')[1];
    
    // Encontrar o índice mais próximo para startTime
    let startIndex = listTime.findIndex(time => time === startTime);
    if (startIndex === -1) {
      // Se não encontrar exato, procurar o mais próximo
      const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
      let minDiff = Infinity;
      listTime.forEach((time, index) => {
        const timeMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
        const diff = Math.abs(timeMinutes - startMinutes);
        if (diff < minDiff) {
          minDiff = diff;
          startIndex = index;
        }
      });
    }
    
    // Encontrar o índice mais próximo para endTime
    let endIndex = listTime.findIndex(time => time === endTime);
    if (endIndex === -1) {
      // Se não encontrar exato, procurar o mais próximo
      const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
      let minDiff = Infinity;
      listTime.forEach((time, index) => {
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
  };

  // Função para calcular posições otimizadas de todos os eventos
  const calculateOptimizedPositions = useMemo<Record<number, { column: number; totalOverlapping: number }>>(() => {
    const positions: { [eventIndex: number]: { column: number; totalOverlapping: number } } = {};

    // Filtrar eventos do dia atual
    const currentDateStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
    const filteredEvents = events.filter(event => event.date === currentDateStr);

    // Agrupar índices de eventos por lista
    const eventsByList: { [listName: string]: number[] } = {};

    filteredEvents.forEach((event, idx) => {
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
        const startA = timeToMinutes(filteredEvents[aIdx].dateStart?.split(' ')[1] || '00:00');
        const startB = timeToMinutes(filteredEvents[bIdx].dateStart?.split(' ')[1] || '00:00');
        return startA - startB;
      });

      // Para cada evento, encontrar a primeira coluna disponível
      listEventIndices.forEach(eventIndex => {
        const event = filteredEvents[eventIndex];

        // Encontrar todos os eventos que se sobrepõem com este evento
        const overlappingIndices = listEventIndices.filter(otherIndex =>
          otherIndex !== eventIndex && eventsOverlap(event, filteredEvents[otherIndex])
        );

        // Calcular o máximo de eventos sobrepostos simultaneamente APENAS para os eventos que se sobrepõem com este evento
        let maxOverlapping = 1;

        // Lista de índices relevantes (este evento + eventos que se sobrepõem)
        const relevantIndices = [eventIndex, ...overlappingIndices];

        // Para cada evento relevante, verificar quantos eventos estão ativos simultaneamente
        relevantIndices.forEach(checkIndex => {
          const checkStart = timeToMinutes(filteredEvents[checkIndex].dateStart?.split(' ')[1] || '00:00');
          const checkEnd = timeToMinutes(filteredEvents[checkIndex].dateEnd?.split(' ')[1] || '00:00');

          // Verificar quantos eventos estão ativos em cada minuto deste evento
          let maxSimultaneous = 1;

          for (let minute = checkStart; minute < checkEnd; minute++) {
            let simultaneousCount = 0;

            relevantIndices.forEach(otherIndex => {
              const otherStart = timeToMinutes(filteredEvents[otherIndex].dateStart?.split(' ')[1] || '00:00');
              const otherEnd = timeToMinutes(filteredEvents[otherIndex].dateEnd?.split(' ')[1] || '00:00');

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

        // Se há menos eventos sobrepostos do que o máximo de colunas disponíveis, expandir
        if (overlappingIndices.length + 1 < maxOverlapping) {
          // O evento pode ocupar mais espaço se há colunas livres
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

        // Marcar colunas já usadas pelos eventos sobrepostos
        overlappingIndices.forEach(overlappingIndex => {
          const existingPosition = positions[overlappingIndex];
          if (existingPosition) {
            usedColumns.add(existingPosition.column);
          }
        });

        // Encontrar a primeira coluna livre
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
  }, [events, currentYear, currentMonth, currentDay]);

  // Filtrar eventos do dia atual
  const filteredEvents = useMemo(() => {
    const currentDateStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
    return events.filter(event => event.date === currentDateStr);
  }, [events, currentYear, currentMonth, currentDay]);

  // Função para renderizar um evento
  const renderEvent = (event: CalendarEventList, index: number) => {
    const position = getEventPosition(event);
    if (!position) return null;

    const top = position.startRow * 20; // 20px por linha (h-5)
    const height = position.duration * 20;
    
    // Obter posição otimizada
    const optimizedPosition = calculateOptimizedPositions[index];
    if (!optimizedPosition) return null;
    
    // Calcular largura e posição horizontal baseado no número de eventos sobrepostos
    const columnWidth = 100 / listList.length;
    const columnWidthWithMargin = 90 / listList.length;

    // Se não há sobreposições, o evento ocupa toda a largura da coluna
    let eventWidth, left;
    if (optimizedPosition.totalOverlapping === 1) {
      eventWidth = columnWidthWithMargin;
      left = position.column * columnWidth;
    } else {
      // Dividir a largura entre os eventos sobrepostos
      eventWidth = columnWidthWithMargin / optimizedPosition.totalOverlapping;
      left = position.column * columnWidth + (eventWidth * optimizedPosition.column);
    }
    
    // Adicionar pequena margem entre eventos para melhor visualização
    const adjustedWidth = eventWidth;
    const adjustedLeft = left;
    
    return (
      <CalendarWeekItem
        key={`${event.title}-${index}`}
        event={event as any}
        index={index}
        top={top}
        adjustedLeft={adjustedLeft}
        adjustedWidth={adjustedWidth}
        height={height}
        eventClick={eventClick as any}
        tooltipComponent={tooltipComponent}
      />
    );
  };

  return (
    <div className="w-full h-full">
      {/* Header de navegação */}
      <CalendarListHeaderFilter currentDay={currentDay} currentMonth={currentMonth} currentYear={currentYear} setCurrentDay={setCurrentDay} setCurrentMonth={setCurrentMonth} setCurrentYear={setCurrentYear}/>
      {/* Header de listas */}
      <div className="ml-[50px]">
        <CalendarListHeader listList={listList}/>
      </div>
      <div className="relative flex h-[1000px] overflow-y-auto">
        {/* Header de horários */}
        <div className="w-[50px]">
          <CalendarHeaderHourList listTime={listTime} />
        </div>
        {/* Linhas de horários */}
        <div className="w-full">
          <CalendarListRow 
            listTime={listTime} 
            listList={listList} 
            dateClick={dateClick}
            currentYear={currentYear}
            currentMonth={currentMonth}
            currentDay={currentDay}
          />
        </div>
        {/* Eventos */}
        <div className="absolute inset-y-0 left-[50px] right-0 pointer-events-none">
          {filteredEvents.map((event, index) => renderEvent(event, index))}
        </div>
      </div>
    </div>
  )
}
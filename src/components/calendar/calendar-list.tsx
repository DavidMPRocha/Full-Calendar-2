import { useState, useMemo } from "react";
import type { CalendarEventList, TooltipComponentProps, EventComponentProps } from "./calendar";
import type { ReactNode } from "react";
import { CalendarHeaderHourList } from "./week/calendar-header-hour-list";
import { CalendarListHeaderFilter } from "./calendar-list-header-filter";
import { CalendarListRow } from "./calendar-list-row";
import { CalendarListHeader } from "./calendar-list-header";
import { CalendarWeekItem } from "./week/calendar-week-item";

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
  timeInterval?: 5 | 15 | 30;
}

export function CalendarList({year, month, day, events, eventClick, dateClick, tooltipComponent, eventComponent, timeInterval: initialTimeInterval}: CalendarListProps) {
  const [currentYear, setCurrentYear] = useState(year);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentDay, setCurrentDay] = useState(day);
  const [timeInterval, setTimeInterval] = useState<5 | 15 | 30>(initialTimeInterval || 5); // Usar o valor inicial ou padrão 5
  
  // Função para gerar lista de horários baseada no intervalo
  const generateTimeList = (interval: number): string[] => {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const listTime = useMemo(() => generateTimeList(timeInterval), [timeInterval]);
  
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

    // Calcular altura da linha baseada no intervalo
    const getRowHeight = () => {
      switch (timeInterval) {
        case 5: return 20; // h-5
        case 15: return 32; // h-8
        case 30: return 48; // h-12
        default: return 20;
      }
    };

    const rowHeight = getRowHeight();
    const top = position.startRow * rowHeight;
    const height = position.duration * rowHeight;
    
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
        event={event}
        index={index}
        top={top}
        adjustedLeft={adjustedLeft}
        adjustedWidth={adjustedWidth}
        height={height}
        eventClick={eventClick as any}
        tooltipComponent={tooltipComponent}
        eventComponent={eventComponent}
      />
    );
  };

  return (
    <div className="w-full h-full">
      {/* Header de navegação */}
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
      {/* Header de listas */}
      <div className="ml-[50px]">
        <CalendarListHeader listList={listList}/>
      </div>
      <div className="relative flex max-h-full overflow-y-auto">
        {/* Header de horários */}
        <div className="w-[50px]">
          <CalendarHeaderHourList listTime={listTime} timeInterval={timeInterval} />
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
            timeInterval={timeInterval}
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
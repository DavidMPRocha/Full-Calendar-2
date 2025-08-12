import { useState, useMemo } from "react";
import type { CalendarEvent, TooltipComponentProps, CalendarEventWeek, EventComponentProps } from "./calendar";
import type { ReactNode } from "react";
import { CalendarHeaderWeekList } from "./calendar-header-week-list";
import { CalendarWeekRow } from "./calendar-week-row";
import { CalendarHeaderHourList } from "./calendar-header-hour-list";
import { CalendarWeekItem } from "./calendar-week-item";
import { CalendarWeekHeaderFilter } from "./calendar-week-header-filter";

interface CalendarWeekProps {
  type: 'week';
  year: number;
  week: number;
  events: CalendarEventWeek[];
  eventClick?: (event: CalendarEventWeek) => void;
  dateClick?: (date: string, time: string) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
  timeInterval?: 5 | 15 | 30;
}

export function CalendarWeek({type, year, week, events, eventClick, dateClick, tooltipComponent, eventComponent, timeInterval: initialTimeInterval}: CalendarWeekProps) {
  const [currentYear, setCurrentYear] = useState(year);
  const [currentWeek, setCurrentWeek] = useState(week);
  const [timeInterval, setTimeInterval] = useState<5 | 15 | 30>(initialTimeInterval || 5); // Usar o valor inicial ou padrão 5

  // Função para calcular o range de datas da semana atual
  const getWeekDateRange = (year: number, week: number): { start: string, end: string } => {
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
  };

  // Filtrar eventos da semana atual
  const weekDateRange = getWeekDateRange(currentYear, currentWeek);
  const filteredEvents = events.filter(event => {
    const eventDate = event.date;
    return eventDate >= weekDateRange.start && eventDate <= weekDateRange.end;
  });

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

  // Função para converter tempo para minutos
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Função para verificar se dois eventos se sobrepõem
  const eventsOverlap = (event1: CalendarEvent, event2: CalendarEvent): boolean => {
    if (!event1.dateStart || !event1.dateEnd || !event2.dateStart || !event2.dateEnd) return false;
    
    const start1 = timeToMinutes(event1.dateStart.split(' ')[1]);
    const end1 = timeToMinutes(event1.dateEnd.split(' ')[1]);
    const start2 = timeToMinutes(event2.dateStart.split(' ')[1]);
    const end2 = timeToMinutes(event2.dateEnd.split(' ')[1]);
    
    return start1 < end2 && start2 < end1;
  };

  // Função para calcular a posição de um evento no grid
  const getEventPosition = (event: CalendarEvent) => {
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

    const eventDate = new Date(event.dateStart);
    const dayOfWeek = eventDate.getDay();
    
    return {
      startRow: startIndex,
      endRow: endIndex,
      column: dayOfWeek,
      duration: Math.max(1, endIndex - startIndex),
      totalOverlapping: 1, // Será calculado na função de renderização
      eventIndex: 0 // Será calculado na função de renderização
    };
  };

  // Função para calcular posições otimizadas de todos os eventos
  const calculateOptimizedPositions = useMemo<Record<number, { column: number; totalOverlapping: number }>>(() => {
    const positions: { [eventIndex: number]: { column: number; totalOverlapping: number } } = {};

    // Agrupar índices de eventos por dia da semana
    const eventsByDay: { [dayOfWeek: number]: number[] } = {};

    filteredEvents.forEach((event, idx) => {
      if (!event.dateStart) return;

      const eventDate = new Date(event.dateStart);
      const dayOfWeek = eventDate.getDay();

      if (!eventsByDay[dayOfWeek]) {
        eventsByDay[dayOfWeek] = [];
      }
      eventsByDay[dayOfWeek].push(idx);
    });

    // Para cada dia, calcular posições otimizadas
    Object.keys(eventsByDay).forEach(dayStr => {
      const dayOfWeek = parseInt(dayStr);
      const dayEventIndices = eventsByDay[dayOfWeek];

      // Ordenar índices por horário de início
      dayEventIndices.sort((aIdx, bIdx) => {
        const startA = timeToMinutes(filteredEvents[aIdx].dateStart?.split(' ')[1] || '00:00');
        const startB = timeToMinutes(filteredEvents[bIdx].dateStart?.split(' ')[1] || '00:00');
        return startA - startB;
      });

      // Para cada evento, encontrar a primeira coluna disponível
      dayEventIndices.forEach(eventIndex => {
        const event = filteredEvents[eventIndex];

        // Encontrar todos os eventos que se sobrepõem com este evento
        const overlappingIndices = dayEventIndices.filter(otherIndex =>
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
  }, [filteredEvents]);

  // Função para renderizar um evento
  const renderEvent = (event: CalendarEventWeek, index: number) => {
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
    const columnWidth = 100 / 7; // Largura de uma coluna (7 dias)
    const columnWidthWithMargin = 90 / 7;

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
        eventClick={eventClick}
        tooltipComponent={tooltipComponent}
        eventComponent={eventComponent}
      />
    );
  };

  return (
    <div className="w-full h-full">
      {/* Header de navegação */}
      <CalendarWeekHeaderFilter 
        currentWeek={currentWeek} 
        currentYear={currentYear} 
        setCurrentWeek={setCurrentWeek} 
        setCurrentYear={setCurrentYear}
        timeInterval={timeInterval}
        setTimeInterval={setTimeInterval}
      />
      {/* Header de dias de semana */}
      <div className="ml-[50px]">
        <CalendarHeaderWeekList/>
      </div>
      <div className="relative flex h-full overflow-y-auto">
        {/* Header de horários */}
        <div className="w-[50px]">
          <CalendarHeaderHourList listTime={listTime} timeInterval={timeInterval} />
        </div>
        {/* Linhas de horários */}
        <div className="w-full">
          <CalendarWeekRow 
            listTime={listTime} 
            dateClick={dateClick} 
            currentWeek={currentWeek} 
            currentYear={currentYear}
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
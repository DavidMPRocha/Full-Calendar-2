import { useState, useMemo } from "react";
import type { CalendarEvent, TooltipComponentProps, CalendarEventWeek } from "./calendar";
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
}

export function CalendarWeek({type, year, week, events, eventClick, dateClick, tooltipComponent}: CalendarWeekProps) {
  const [currentYear, setCurrentYear] = useState(year);
  const [currentWeek, setCurrentWeek] = useState(week);

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
  const [listTime, setListTime] = useState<string[]>([
    "00:00", "00:05", "00:10", "00:15", "00:20", "00:25", "00:30", "00:35", "00:40", "00:45", "00:50", "00:55","01:00", "01:05", "01:10", "01:15", "01:20", "01:25", "01:30", "01:35", "01:40", "01:45", "01:50", "01:55","02:00", "02:05", "02:10", "02:15", "02:20", "02:25", "02:30", "02:35", "02:40", "02:45", "02:50", "02:55","03:00", "03:05", "03:10", "03:15", "03:20", "03:25", "03:30", "03:35", "03:40", "03:45", "03:50", "03:55","04:00", "04:05", "04:10", "04:15", "04:20", "04:25", "04:30", "04:35", "04:40", "04:45", "04:50", "04:55","05:00", "05:05", "05:10", "05:15", "05:20", "05:25", "05:30", "05:35", "05:40", "05:45", "05:50", "05:55","06:00", "06:05", "06:10", "06:15", "06:20", "06:25", "06:30", "06:35", "06:40", "06:45", "06:50", "06:55","07:00", "07:05", "07:10", "07:15", "07:20", "07:25", "07:30", "07:35", "07:40", "07:45", "07:50", "07:55","08:00", "08:05", "08:10", "08:15", "08:20", "08:25", "08:30", "08:35", "08:40", "08:45", "08:50", "08:55", "09:00", "09:05", "09:10", "09:15", "09:20", "09:25", "09:30", "09:35", "09:40", "09:45", "09:50", "09:55", "10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30", "10:35", "10:40", "10:45", "10:50", "10:55", "11:00", "11:05", "11:10", "11:15", "11:20", "11:25", "11:30", "11:35", "11:40", "11:45", "11:50", "11:55",
    "12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30", "12:35", "12:40", "12:45", "12:50", "12:55","13:00", "13:05", "13:10", "13:15", "13:20", "13:25", "13:30", "13:35", "13:40", "13:45", "13:50", "13:55","14:00", "14:05", "14:10", "14:15", "14:20", "14:25", "14:30", "14:35", "14:40", "14:45", "14:50", "14:55","15:00", "15:05", "15:10", "15:15", "15:20", "15:25", "15:30", "15:35", "15:40", "15:45", "15:50", "15:55","16:00", "16:05", "16:10", "16:15", "16:20", "16:25", "16:30", "16:35", "16:40", "16:45", "16:50", "16:55","17:00", "17:05", "17:10", "17:15", "17:20", "17:25", "17:30", "17:35", "17:40", "17:45", "17:50", "17:55","18:00", "18:05", "18:10", "18:15", "18:20", "18:25", "18:30", "18:35", "18:40", "18:45", "18:50", "18:55","19:00", "19:05", "19:10", "19:15", "19:20", "19:25", "19:30", "19:35", "19:40", "19:45", "19:50", "19:55","20:00", "20:05", "20:10", "20:15", "20:20", "20:25", "20:30", "20:35", "20:40", "20:45", "20:50", "20:55","21:00", "21:05", "21:10", "21:15", "21:20", "21:25", "21:30", "21:35", "21:40", "21:45", "21:50", "21:55","22:00", "22:05", "22:10", "22:15", "22:20", "22:25", "22:30", "22:35", "22:40", "22:45", "22:50", "22:55","23:00", "23:05", "23:10", "23:15", "23:20", "23:25", "23:30", "23:35", "23:40", "23:45", "23:50", "23:55",
  ]);

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

    const top = position.startRow * 20; // 20px por linha (h-5)
    const height = position.duration * 20;
    
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
      />
    );
  };

  return (
    <div className="w-full h-full">
      {/* Header de navegação */}
      <CalendarWeekHeaderFilter currentWeek={currentWeek} currentYear={currentYear} setCurrentWeek={setCurrentWeek} setCurrentYear={setCurrentYear}/>
      {/* Header de dias de semana */}
      <div className="ml-[50px]">
        <CalendarHeaderWeekList/>
      </div>
      <div className="relative flex h-full overflow-y-auto">
        {/* Header de horários */}
        <div className="w-[50px]">
          <CalendarHeaderHourList listTime={listTime} />
        </div>
        {/* Linhas de horários */}
        <div className="w-full">
          <CalendarWeekRow listTime={listTime} dateClick={dateClick} currentWeek={currentWeek} currentYear={currentYear}/>
        </div>
        {/* Eventos */}
        <div className="absolute inset-y-0 left-[50px] right-0 pointer-events-none">
          {filteredEvents.map((event, index) => renderEvent(event, index))}
        </div>
      </div>
    </div>
  )
}
import { CalendarMonth } from "./calendar-month";
import { CalendarWeek } from "./calendar-week";
import { CalendarList } from "./calendar-list";
import type { ReactNode } from "react";

/**
 * Interface base para eventos do calendário
 */
export interface CalendarEvent {
  /** Título do evento */
  title: string;  
  /** Data do evento no formato YYYY-MM-DD */
  date: string;
  /** Cor do evento em formato hexadecimal */
  color?: string; 
  /** Descrição opcional do evento */
  description?: string;
  /** ID único do evento */
  id?: string;
}

/**
 * Interface para eventos com horário específico (visualização semanal)
 */
export interface CalendarEventWeek extends CalendarEvent {
  /** Data e hora de início no formato YYYY-MM-DD HH:MM */
  dateStart: string;
  /** Data e hora de fim no formato YYYY-MM-DD HH:MM */
  dateEnd: string;
}

/**
 * Interface para eventos de lista (visualização lista)
 */
export interface CalendarEventList extends CalendarEvent {
  /** Data e hora de início no formato YYYY-MM-DD HH:MM */
  dateStart: string;
  /** Data e hora de fim no formato YYYY-MM-DD HH:MM */
  dateEnd: string;
  /** Nome da lista/categoria do evento */
  list: string; 
}

export interface CalendarDay {
  day: number;
  month: number;
  year: number;
  events: CalendarEvent[];
}

// Interface para o componente de tooltip customizado - apenas o event é exposto
export interface TooltipComponentProps {
  event: CalendarEvent;
}

// Interface para o componente de evento customizado - apenas o event é exposto
export interface EventComponentProps {
  event: CalendarEvent;
}

interface BaseCalendarProps {
  type?: 'month' | 'week' | 'list';
  year: number;
  events: CalendarEvent[];
  eventClick?: (event: CalendarEvent) => void;
  dateClick?: (date: string, time?: string, list?: string) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
}

interface MonthCalendarProps extends BaseCalendarProps {
  type: 'month' | undefined;
  month: number;
}

interface WeekCalendarProps extends Omit<BaseCalendarProps, 'events'> {
  type: 'week';
  week: number;
  events: CalendarEventWeek[];
  timeInterval?: 5 | 15 | 30;
}

interface ListCalendarProps extends Omit<BaseCalendarProps, 'events'> {
  type: 'list';
  month: number;
  day: number;
  events: CalendarEventList[];
  timeInterval?: 5 | 15 | 30;
}

export type CalendarProps = WeekCalendarProps | MonthCalendarProps | ListCalendarProps;

/**
 * Componente principal do calendário
 * 
 * @param props - Propriedades do calendário
 * @returns Componente de calendário renderizado
 */
export function Calendar(props: CalendarProps) {
  const {type, year, events, eventClick, dateClick, tooltipComponent, eventComponent} = props;
  const month = 'month' in props ? props.month : undefined;
  const week = 'week' in props ? props.week : undefined;
  const day = 'day' in props ? props.day : undefined;
  const timeInterval = 'timeInterval' in props ? props.timeInterval : undefined;

  return (
    <div 
      className="w-full h-full min-w-[320px] md:min-w-[500px] min-h-[400px] md:min-h-[500px]"
      role="application"
      aria-label={`Calendário ${type === 'month' ? 'mensal' : type === 'week' ? 'semanal' : 'lista'}`}
    >
      {(type === 'month' || type === undefined) && month !== undefined && (
        <CalendarMonth
          type={type} 
          year={year} 
          month={month} 
          events={events} 
          eventClick={eventClick} 
          dateClick={dateClick}
          tooltipComponent={tooltipComponent}
          eventComponent={eventComponent}
        />
      )}
      {(type === 'week') && week !== undefined && (
        <CalendarWeek 
          type={type} 
          year={year} 
          week={week}
          events={events} 
          eventClick={eventClick} 
          dateClick={dateClick}
          tooltipComponent={tooltipComponent}
          eventComponent={eventComponent}
          timeInterval={timeInterval}
        />
      )}
      {(type === 'list') && day !== undefined && month !== undefined && (
        <CalendarList
          type={type}
          year={year}
          month={month}
          day={day}
          events={events}
          eventClick={eventClick}
          dateClick={dateClick}
          tooltipComponent={tooltipComponent}
          eventComponent={eventComponent}
          timeInterval={timeInterval}
        />
      )}
    </div>
  );
}
import { CalendarMonth } from "./calendar-month";
import { CalendarWeek } from "./calendar-week";
import { CalendarList } from "./calendar-list";
import type { ReactNode } from "react";

export interface CalendarEvent {
  title: string;  
  date: string;
  color?: string; 
  [key: string]: any; 
}

export interface CalendarEventWeek extends CalendarEvent {
  dateStart: string;
  dateEnd: string;
}

export interface CalendarEventList extends CalendarEvent {
  dateStart: string;
  dateEnd: string;
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

export function Calendar(props: CalendarProps) {
  const {type, year, events, eventClick, dateClick, tooltipComponent, eventComponent} = props;
  const month = 'month' in props ? props.month : undefined;
  const week = 'week' in props ? props.week : undefined;
  const day = 'day' in props ? props.day : undefined;
  const timeInterval = 'timeInterval' in props ? props.timeInterval : undefined;

  return (
    <div className="w-full h-full min-w-[500px] min-h-[500px]">
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
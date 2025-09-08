import { CalendarMonthItem } from "./calendar-month-item";

import type { CalendarEvent, EventComponentProps, TooltipComponentProps } from "./calendar";
import type { ReactNode } from "react";

interface CalendarRowProps {
  days: Array<{ day: number; month: number; year: number; events: CalendarEvent[] }>;
  currentMonth: number;
  eventClick?: (event: CalendarEvent) => void;
  dateClick?: (date: string, time?: string) => void;
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode;
  eventComponent?: (props: EventComponentProps) => ReactNode;
}

export function CalendarMonthRow({ days, currentMonth, eventClick, dateClick, tooltipComponent, eventComponent}: CalendarRowProps) {
  return (
    <div className="grid grid-cols-7">
      {days.map((day, i) => {
        const dateStr = `${day.year}-${day.month.toString().padStart(2, '0')}-${day.day.toString().padStart(2, '0')}`;
        const isOtherMonth = day.month !== currentMonth;
        return (
          <div 
            key={i} 
            onClick={() => dateClick && dateClick(dateStr)} 
            className={`p-1 border border-gray-400 hover:border-gray-700 hover:bg-gray-200 transition ${isOtherMonth ? 'bg-gray-100 text-gray-400 border-gray-400' : ''}`}
          >
            {day.day}
            <div className="aspect-square overflow-y-auto space-y-0.5">
            {
              day.events.map((event, j) => (
                <CalendarMonthItem 
                  key={j} 
                  event={event}
                  eventClick={eventClick}
                  tooltipComponent={tooltipComponent}
                  eventComponent={eventComponent}
                />
              ))
            }
            </div>
          </div>
        );
      })}
    </div>
  );
}
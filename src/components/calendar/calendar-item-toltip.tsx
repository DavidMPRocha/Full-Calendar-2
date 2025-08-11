import type { CalendarEvent } from "./calendar";

interface TooltipProps {
  event: CalendarEvent;
  isVisible: boolean;
  position: { x: number; y: number };
}

export function CalendarItemTooltip({ event, isVisible, position }: TooltipProps) {
  if (!isVisible) return null;

  const formatTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-PT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px] max-w-[320px]"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      {/* Header do tooltip */}
      <div className="flex items-center justify-between mb-3">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: event.color || '#5abff2' }}
        ></div>
        <div className="text-xs text-gray-500">
          {formatDate(event.date)}
        </div>
      </div>

      {/* Título do evento */}
      <h3 className="font-semibold text-gray-900 text-sm mb-2">
        {event.title}
      </h3>

      {/* Informações de data/tempo */}
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center">
          <svg className="w-3 h-3 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Início: {formatTime(event.dateStart)}</span>
        </div>
        <div className="flex items-center">
          <svg className="w-3 h-3 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Fim: {formatTime(event.dateEnd)}</span>
        </div>
      </div>
    </div>
  );
} 
import type { CalendarEvent } from "./calendar";

interface TooltipProps {
  event: CalendarEvent;
  isVisible: boolean;
  position: { x: number; y: number };
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// Função para calcular a posição ideal do tooltip
export function calculateTooltipPosition(mouseX: number, mouseY: number) {
  const tooltipWidth = 320; // max-w-[320px]
  const offset = 0;
  const viewportWidth = window.innerWidth;

  // Calcular se o tooltip vai sair da tela horizontalmente
  const wouldOverflowRight = mouseX + offset + tooltipWidth > viewportWidth;

  // Determinar o posicionamento horizontal
  let newX: number;
  let newY: number;
  if (wouldOverflowRight) {
    // Se vai sair pela direita, posicionar à esquerda
    newX = mouseX - (offset - 30) - tooltipWidth;
    newY = mouseY;
  } else {
    // Posicionar à direita
    newX = mouseX + offset;
    newY = mouseY;
  }

  // Garantir que não saia da tela horizontalmente
  newX = Math.max(10, Math.min(newX, viewportWidth - tooltipWidth - 10));

  return { x: newX, y: newY };
}

export function CalendarItemTooltip({ event, isVisible, position, onMouseEnter, onMouseLeave }: TooltipProps) {
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
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px] max-w-[320px] transform -translate-y-full"
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={e => {
        e.stopPropagation();
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
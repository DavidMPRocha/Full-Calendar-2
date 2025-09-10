import { useMemo } from 'react';

export type TimeInterval = 5 | 15 | 30;

/**
 * Hook para gerar lista de horários baseada no intervalo
 */
export function useTimeList(interval: TimeInterval): string[] {
  return useMemo(() => {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  }, [interval]);
}

/**
 * Função utilitária para converter tempo para minutos
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Função utilitária para obter altura da linha baseada no intervalo
 */
export function getRowHeight(timeInterval: TimeInterval): number {
  switch (timeInterval) {
    case 5: return 20; // h-5
    case 15: return 32; // h-8
    case 30: return 48; // h-12
    default: return 20;
  }
}

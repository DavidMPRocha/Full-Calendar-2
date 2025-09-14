/**
 * Hook para gerenciar nomes dos meses
 */
export const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

/**
 * Função para obter o nome do mês pelo número
 */
export function getMonthName(monthNumber: number): string {
  return monthNames[monthNumber - 1] || '';
}

/**
 * Função para obter o número do mês pelo nome
 */
export function getMonthNumber(monthName: string): number {
  return monthNames.indexOf(monthName) + 1;
}

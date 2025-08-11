interface CalendarWeekRowProps {
  listTime: string[];
  dateClick?: (time: string, date: string) => void;
  currentWeek: number;
  currentYear: number;
}

export function CalendarWeekRow({listTime, dateClick, currentWeek, currentYear}: CalendarWeekRowProps) {
  // Função para calcular a data baseada na semana e ano
  const getDateFromWeekAndDay = (week: number, year: number, dayOfWeek: number): string => {
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeekFirstDay = firstDayOfYear.getDay();
    
    // Calcular o primeiro dia da semana
    const daysToAdd = (week - 1) * 7 - dayOfWeekFirstDay;
    const startDate = new Date(year, 0, 1 + daysToAdd);
    
    // Adicionar o dia da semana específico
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayOfWeek);
    
    // Formatar a data como YYYY-MM-DD
    const yearStr = targetDate.getFullYear();
    const monthStr = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(targetDate.getDate()).padStart(2, '0');
    
    return `${yearStr}-${monthStr}-${dayStr}`;
  };

  const handleTimeSlotClick = (time: string, dayOfWeek: number) => {
    if (dateClick) {
      const date = getDateFromWeekAndDay(currentWeek, currentYear, dayOfWeek);
      dateClick(date, time);
    }
  };

  return (
    <>
    {listTime.map((time, index) => (
      <div key={index} className={`grid grid-cols-7 h-5 hover:bg-gray-200 ${time.includes(':55') ? 'border-b border-b-gray-600' : ''}`}>
        <div 
          className={`border-t border-dashed border-t-gray-400 border-r border-r-gray-600 cursor-pointer`} 
          style={{borderRight: '1px solid #d1d5dc'}}
          onClick={() => handleTimeSlotClick(time, 0)}
        ></div>
        <div 
          className={`border-t border-dashed border-t-gray-400 border-r border-r-gray-600 cursor-pointer`} 
          style={{borderRight: '1px solid #d1d5dc'}}
          onClick={() => handleTimeSlotClick(time, 1)}
        ></div>
        <div 
          className={`border-t border-dashed border-t-gray-400 border-r border-r-gray-600 cursor-pointer`} 
          style={{borderRight: '1px solid #d1d5dc'}}
          onClick={() => handleTimeSlotClick(time, 2)}
        ></div>
        <div 
          className={`border-t border-dashed border-t-gray-400 border-r border-r-gray-600 cursor-pointer`} 
          style={{borderRight: '1px solid #d1d5dc'}}
          onClick={() => handleTimeSlotClick(time, 3)}
        ></div>
        <div 
          className={`border-t border-dashed border-t-gray-400 border-r border-r-gray-600 cursor-pointer`} 
          style={{borderRight: '1px solid #d1d5dc'}}
          onClick={() => handleTimeSlotClick(time, 4)}
        ></div>
        <div 
          className={`border-t border-dashed border-t-gray-400 border-r border-r-gray-600 cursor-pointer`} 
          style={{borderRight: '1px solid #d1d5dc'}}
          onClick={() => handleTimeSlotClick(time, 5)}
        ></div>
        <div 
          className={`border-t border-dashed border-t-gray-400 border-r border-r-gray-600 cursor-pointer`} 
          style={{borderRight: '1px solid #d1d5dc'}}
          onClick={() => handleTimeSlotClick(time, 6)}
        ></div>
      </div>
      ))}
    </>
  )
}
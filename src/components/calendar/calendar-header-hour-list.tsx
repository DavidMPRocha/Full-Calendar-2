interface CalendarHeaderHourListProps {
  listTime: string[];
  timeInterval?: 5 | 15 | 30;
}

export function CalendarHeaderHourList({listTime, timeInterval = 5}: CalendarHeaderHourListProps) {
  // Calcular altura baseada no intervalo
  const getRowHeight = () => {
    switch (timeInterval) {
      case 5: return 'h-5'; // 20px
      case 15: return 'h-8'; // 32px
      case 30: return 'h-12'; // 48px
      default: return 'h-5';
    }
  };

  return (
    <div className="border-r border-r-gray-300">
      {listTime.map((time, index) => {
        return (
          <div key={index} className={`${getRowHeight()} text-right mr-1 flex items-center justify-end border-t border-dashed border-t-gray-400`}>
            {!time.includes(":00") ? `:${time.split(":")[1]}` : time}
          </div>
        );
      })}
    </div>
  )
} 
interface CalendarListRowProps {
    listTime: string[];
    listList: string[];
    dateClick?: (time: string, date: string, list: string) => void;
    currentYear: number;
    currentMonth: number;
    currentDay: number;
    timeInterval?: 5 | 15 | 30;
}

export function CalendarListRow({listTime, listList, dateClick, currentYear, currentMonth, currentDay, timeInterval = 5}: CalendarListRowProps) {
    // Função para formatar a data atual
    const getCurrentDate = (): string => {
        const yearStr = currentYear;
        const monthStr = String(currentMonth).padStart(2, '0');
        const dayStr = String(currentDay).padStart(2, '0');
        return `${yearStr}-${monthStr}-${dayStr}`;
    };

    const handleTimeSlotClick = (time: string, list: string) => {
        if (dateClick) {
            const date = getCurrentDate();
            dateClick(date, time, list);
        }
    };

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
        <>
        {listTime.map((time, index) => {
          // Verificar se é uma hora completa (45 para 15m; 30 para 30m; 55 para 5m)
          const isHourBorder = 
            (timeInterval === 15 && time.includes(':45')) ||
            (timeInterval === 30 && time.includes(':30')) ||
            (timeInterval === 5 && time.includes(':55'));
          
          return (
            <div key={index} className={`grid grid-cols-${listList.length} ${getRowHeight()} hover:bg-gray-200 ${isHourBorder ? 'border-b-1 border-b-gray-600' : ''}`}>
              {
                  listList.map((list, listIndex) => (
                      <div 
                          key={listIndex} 
                          className={`border-t border-dashed border-t-gray-400 border-r border-r-gray-600 cursor-pointer`} 
                          style={{borderRight: '1px solid #d1d5dc'}}
                          onClick={() => handleTimeSlotClick(time, list)}
                      ></div>
                  ))
              }
            </div>
          );
        })}
        </>
      )
}
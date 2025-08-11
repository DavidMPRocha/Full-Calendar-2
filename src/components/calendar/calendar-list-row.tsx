interface CalendarListRowProps {
    listTime: string[];
    listList: string[];
    dateClick?: (time: string, date: string, list: string) => void;
    currentYear: number;
    currentMonth: number;
    currentDay: number;
}

export function CalendarListRow({listTime, listList, dateClick, currentYear, currentMonth, currentDay}: CalendarListRowProps) {
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

    return (
        <>
        {listTime.map((time, index) => (
          <div key={index} className={`grid grid-cols-${listList.length} h-5 hover:bg-gray-200 ${time.includes(':55') ? 'border-b border-b-gray-600' : ''}`}>
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
          ))}
        </>
      )
}
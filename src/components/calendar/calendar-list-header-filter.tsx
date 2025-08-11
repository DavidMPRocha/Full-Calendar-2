interface CalendarListHeaderFilterProps {
    currentDay: number, 
    currentMonth: number, 
    currentYear: number, 
    setCurrentDay: (day: number) => void, 
    setCurrentMonth: (month: number) => void, 
    setCurrentYear: (year: number) => void
}

export function CalendarListHeaderFilter({currentDay, currentMonth, currentYear, setCurrentDay, setCurrentMonth, setCurrentYear}: CalendarListHeaderFilterProps) {
    // Função para formatar a data
    function formatDate(year: number, month: number, day: number): string {
        const date = new Date(year, month - 1, day);
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('pt-PT', options);
    }

    // Função para navegar para o próximo dia
    function getNextDay(currentYear: number, currentMonth: number, currentDay: number): { year: number, month: number, day: number } {
        const currentDate = new Date(currentYear, currentMonth - 1, currentDay);
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        
        return {
            year: nextDate.getFullYear(),
            month: nextDate.getMonth() + 1,
            day: nextDate.getDate()
        };
    }

    // Função para navegar para o dia anterior
    function getPrevDay(currentYear: number, currentMonth: number, currentDay: number): { year: number, month: number, day: number } {
        const currentDate = new Date(currentYear, currentMonth - 1, currentDay);
        const prevDate = new Date(currentDate);
        prevDate.setDate(currentDate.getDate() - 1);
        
        return {
            year: prevDate.getFullYear(),
            month: prevDate.getMonth() + 1,
            day: prevDate.getDate()
        };
    }

    function handlePrevDay() {
        const prevDay = getPrevDay(currentYear, currentMonth, currentDay);
        setCurrentYear(prevDay.year);
        setCurrentMonth(prevDay.month);
        setCurrentDay(prevDay.day);
    }

    function handleNextDay() {
        const nextDay = getNextDay(currentYear, currentMonth, currentDay);
        setCurrentYear(nextDay.year);
        setCurrentMonth(nextDay.month);
        setCurrentDay(nextDay.day);
    }

    return (
        <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevDay} className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400">&lt;</button>
            <div className="text-center">
                <span className="font-bold text-lg block">
                    {formatDate(currentYear, currentMonth, currentDay)}
                </span>
            </div>
            <button onClick={handleNextDay} className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400">&gt;</button>
        </div>
    )
}
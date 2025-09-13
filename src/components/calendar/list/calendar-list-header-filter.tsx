import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarListHeaderFilterProps {
    currentDay: number, 
    currentMonth: number, 
    currentYear: number, 
    setCurrentDay: (day: number) => void, 
    setCurrentMonth: (month: number) => void, 
    setCurrentYear: (year: number) => void,
    timeInterval: 5 | 15 | 30,
    setTimeInterval: (interval: 5 | 15 | 30) => void
}

export function CalendarListHeaderFilter({currentDay, currentMonth, currentYear, setCurrentDay, setCurrentMonth, setCurrentYear, timeInterval, setTimeInterval}: CalendarListHeaderFilterProps) {
    // Função para formatar a data
    function formatDate(year: number, month: number, day: number): { weekday: string; date: string } {
        const date = new Date(year, month - 1, day);
        
        // Formatar dia da semana
        const weekdayOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
        const weekday = date.toLocaleDateString('pt-PT', weekdayOptions);
        
        // Formatar data completa
        const dateOptions: Intl.DateTimeFormatOptions = { 
            day: 'numeric',
            month: 'long', 
            year: 'numeric' 
        };
        const dateString = date.toLocaleDateString('pt-PT', dateOptions);
        
        return { weekday, date: dateString };
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

    // Função para ir para hoje
    function goToToday() {
        const today = new Date();
        setCurrentYear(today.getFullYear());
        setCurrentMonth(today.getMonth() + 1);
        setCurrentDay(today.getDate());
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
            {/* Botão Hoje "Navega até ao dia atual" */}
            <div className="flex-1">
                <button 
                    onClick={goToToday} 
                    className="p-0 rounded bg-gray-300 hover:bg-gray-400 transition-colors font-medium h-[40px] flex items-center justify-center"
                >
                    Hoje
                </button>
            </div>

            {/* Navegação de data */}
            <div className="flex items-center justify-center flex-1">
                <button onClick={handlePrevDay} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors flex items-center h-[40px]">
                    <ChevronLeft size={16} />
                </button>
                <div className="text-center mx-4">
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-600 capitalize">
                            {formatDate(currentYear, currentMonth, currentDay).weekday}
                        </span>
                        <span className="font-bold text-md w-[200px] text-center">    
                            {formatDate(currentYear, currentMonth, currentDay).date}
                        </span>
                    </div>
                </div>
                <button onClick={handleNextDay} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors flex items-center h-[40px]">
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Filtro de intervalo "5,15,30" */}
            <div className="flex-1 flex justify-end">
                <div className="flex items-center space-x-2">
                    <span className="text-md text-gray-600 font-medium">Intervalo:</span>
                    <select 
                        value={timeInterval} 
                        onChange={(e) => setTimeInterval(Number(e.target.value) as 5 | 15 | 30)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value={5}>5 minutos</option>
                        <option value={15}>15 minutos</option>
                        <option value={30}>30 minutos</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
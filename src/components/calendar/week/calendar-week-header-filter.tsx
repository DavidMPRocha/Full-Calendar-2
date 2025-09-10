import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarWeekHeaderFilterProps {
    currentWeek: number;
    currentYear: number;
    setCurrentWeek: (week: number) => void;
    setCurrentYear: (year: number) => void;
    timeInterval: 5 | 15 | 30;
    setTimeInterval: (interval: 5 | 15 | 30) => void;
}

export function CalendarWeekHeaderFilter({currentWeek, currentYear, setCurrentWeek, setCurrentYear, timeInterval, setTimeInterval}: CalendarWeekHeaderFilterProps) {
    // Função para calcular o range de datas da semana
    function getWeekDateRange(year: number, week: number): { start: string, end: string } {
        const firstDayOfYear = new Date(year, 0, 1);
        const dayOfWeek = firstDayOfYear.getDay();
        
        // Calcular o primeiro dia da semana
        const daysToAdd = (week - 1) * 7 - dayOfWeek;
        const startDate = new Date(year, 0, 1 + daysToAdd);
        
        // Calcular o último dia da semana (sábado)
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        
        // Formatar as datas
        const formatDate = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        return {
            start: formatDate(startDate),
            end: formatDate(endDate)
        };
    }

    // Função para calcular a semana baseada em uma data
    function getWeekFromDate(date: Date): { year: number, week: number } {
        const year = date.getFullYear();
        const firstDayOfYear = new Date(year, 0, 1);
        const dayOfWeek = firstDayOfYear.getDay();
        
        // Calcular dias desde o início do ano
        const daysSinceStart = Math.floor((date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24));
        
        // Calcular a semana
        const week = Math.ceil((daysSinceStart + dayOfWeek) / 7);
        
        return { year, week };
    }

    // Função para navegar para a próxima semana
    function getNextWeek(currentYear: number, currentWeek: number): { year: number, week: number } {
        const currentDate = getWeekDateRange(currentYear, currentWeek).start;
        
        // Usar o meio da semana atual (quarta-feira) para calcular a próxima semana
        const midWeekDate = new Date(currentDate);
        midWeekDate.setDate(midWeekDate.getDate() + 3); // Quarta-feira
        
        const nextDate = new Date(midWeekDate);
        nextDate.setDate(nextDate.getDate() + 7);
        return getWeekFromDate(nextDate);
    }

    // Função para navegar para a semana anterior
    function getPrevWeek(currentYear: number, currentWeek: number): { year: number, week: number } {
        const currentDate = getWeekDateRange(currentYear, currentWeek).start;
        
        // Usar o meio da semana atual (quarta-feira) para calcular a semana anterior
        const midWeekDate = new Date(currentDate);
        midWeekDate.setDate(midWeekDate.getDate() + 3); // Quarta-feira
        
        const prevDate = new Date(midWeekDate);
        prevDate.setDate(prevDate.getDate() - 7);
        return getWeekFromDate(prevDate);
    }

    // Função para ir para a semana atual
    function goToCurrentWeek() {
        const today = new Date();
        const currentWeekInfo = getWeekFromDate(today);
        setCurrentYear(currentWeekInfo.year);
        setCurrentWeek(currentWeekInfo.week);
    }

    function handlePrevWeek() {
        const prevWeek = getPrevWeek(currentYear, currentWeek);
        setCurrentYear(prevWeek.year);
        setCurrentWeek(prevWeek.week);
    }

    function handleNextWeek() {
        const nextWeek = getNextWeek(currentYear, currentWeek);
        setCurrentYear(nextWeek.year);
        setCurrentWeek(nextWeek.week);
    }

    return (
        <div className="flex items-center justify-between mb-4">
            {/* Botão Hoje "Navega até ao dia atual" */}
            <div className="flex-1">
                <button 
                    onClick={goToCurrentWeek} 
                    className="p-0 rounded bg-gray-300 hover:bg-gray-400 transition-colors font-medium h-[40px] flex items-center justify-center"
                >
                    Hoje
                </button>
            </div>

            {/* Navegação de semana */}
            <div className="flex items-center justify-center flex-1">
                <button onClick={handlePrevWeek} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors flex items-center h-[40px]">
                    <ChevronLeft size={16} />
                </button>
                <div className="text-center mx-4">
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-600">
                            Semana {currentWeek}
                        </span>
                        <span className="font-bold text-md w-[220px] text-center">
                            {getWeekDateRange(currentYear, currentWeek).start} | {getWeekDateRange(currentYear, currentWeek).end}
                        </span>
                    </div>
                </div>
                <button onClick={handleNextWeek} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors flex items-center h-[40px]">
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
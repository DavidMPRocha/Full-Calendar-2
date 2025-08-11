export function CalendarWeekHeaderFilter({currentWeek, currentYear, setCurrentWeek, setCurrentYear}: {currentWeek: number, currentYear: number, setCurrentWeek: (week: number) => void, setCurrentYear: (year: number) => void}) {
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
            <button onClick={handlePrevWeek} className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400">&lt;</button>
            <div className="text-center">
                <span className="font-bold text-lg block">
                    Semana {currentWeek}
                </span>
                <span className="text-sm text-gray-600">
                    {getWeekDateRange(currentYear, currentWeek).start} - {getWeekDateRange(currentYear, currentWeek).end}
                </span>
            </div>
            <button onClick={handleNextWeek} className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400">&gt;</button>
        </div>
    )
}
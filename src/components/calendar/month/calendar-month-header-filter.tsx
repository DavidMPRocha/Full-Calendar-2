import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthNames } from "./hooks";

export function CalendarMonthHeaderFilter({currentMonth, currentYear, setCurrentMonth, setCurrentYear}: {currentMonth: number, currentYear: number, setCurrentMonth: (month: number) => void, setCurrentYear: (year: number) => void}) {
  function handlePrevMonth() {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <button onClick={handlePrevMonth} className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400">
        <ChevronLeft size={16} />
      </button>
      <span className="font-bold text-lg">
        {monthNames[currentMonth - 1]} {currentYear}
      </span>
      <button onClick={handleNextMonth} className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400">
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
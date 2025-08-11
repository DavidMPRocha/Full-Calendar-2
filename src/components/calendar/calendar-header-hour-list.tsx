export function CalendarHeaderHourList({listTime}: {listTime: string[]}) {
  return (
    <div className="border-r border-r-gray-300">
      {listTime.map((time, index) => (
        <div key={index} className="h-5 text-right mr-1 flex items-center justify-end border-t border-dashed border-t-gray-400">
          {!time.includes(":00") ? `:${time.split(":")[1]}` : time}
        </div>
      ))}
    </div>
  )
} 
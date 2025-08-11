interface CalendarListHeaderProps {
    listList: string[];
}

export function CalendarListHeader({listList}: CalendarListHeaderProps) {
    return (
        <div className={`grid grid-cols-${listList.length} gap-2 mb-2 h-5`}>
            {
                listList.map((list, index) => (
                    <div key={index} className={`font-bold text-center`}>{list}</div>
                ))
            }
        </div>
    )
}
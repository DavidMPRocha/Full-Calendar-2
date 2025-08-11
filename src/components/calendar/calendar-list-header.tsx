interface CalendarListHeaderProps {
    listList: string[];
}

export function CalendarListHeader({listList}: CalendarListHeaderProps) {
    const getGridColsClass = (count: number) => {
        const gridColsMap: { [key: number]: string } = {
            1: 'grid-cols-1',
            2: 'grid-cols-2',
            3: 'grid-cols-3',
            4: 'grid-cols-4',
            5: 'grid-cols-5',
            6: 'grid-cols-6',
            7: 'grid-cols-7',
            8: 'grid-cols-8',
            9: 'grid-cols-9',
            10: 'grid-cols-10',
            11: 'grid-cols-11',
            12: 'grid-cols-12',
        };
        return gridColsMap[count] || 'grid-cols-1';
    };

    return (
        <div className={`grid ${getGridColsClass(listList.length)} gap-2 mb-2 h-5`}>
            {
                listList.map((list, index) => (
                    <div key={index} className={`font-bold text-center`}>{list}</div>
                ))
            }
        </div>
    )
}
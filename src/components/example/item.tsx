import { Trash2 } from "lucide-react";
import type { CalendarEventList } from "../calendar/calendar";

interface ItemProps {
  item: CalendarEventList;
  onDelete: (item: CalendarEventList) => void;
  onEdit: (item: CalendarEventList) => void;
}

export function Item({ item, onDelete, onEdit }: ItemProps) {
  return (
    <div onClick={() => onEdit(item)} className={`flex p-1 mt-2 flex-col border border-gray-500 rounded-md cursor-pointer hover:bg-gray-100 hover:shadow-md hover:border-gray-900 hover:scale-102 transition-all duration-200`} style={{ backgroundColor: item.color || '#5abff2' }}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold">{item.title} - <span className="text-xs text-gray-700">{item.list}</span></p>
          <p>{item.date} (<span className="text-xs text-gray-700">{item.dateStart} - {item.dateEnd}</span>)</p>
        </div>
        <button className="text-sm text-gray-700" onClick={(e) => {onDelete(item); e.stopPropagation();}}>
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
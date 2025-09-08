export function SelectCalendar({ type, setType }: { type: 'month' | 'week' | 'list', setType: (type: 'month' | 'week' | 'list') => void }) {
  return (
    <div className="flex gap-4 mb-4 w-full justify-center">
      <button onClick={() => setType('month')} className={type === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}>Visualização Mensal</button>
      <button onClick={() => setType('week')} className={type === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}>Visualização Semanal</button>
      <button onClick={() => setType('list')} className={type === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}>Visualização Lista</button>
    </div>
  )
}
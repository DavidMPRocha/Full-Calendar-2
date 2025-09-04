import { useState } from 'react';
import './App.css'
import { Calendar, type CalendarEvent, type CalendarEventList, type CalendarEventWeek } from './components/calendar/calendar'

// Componente de tooltip customizado - apenas recebe o event
// function CustomTooltip({ event }: TooltipComponentProps) {
//   return (
//     <>
//     </>
//   );
// }

// Componente de event customizado
// function CustomEvent({ event }: EventComponentProps) {
//   return (
//     <>
//       <div className="bg-red-500 w-full h-full">
//         <p>{event.title}</p>
//       </div>
//     </>
//   );
// }

function App() {  
  const [dataMonth] = useState<CalendarEvent[]>([
    {
      title: 'Reunião 1', 
      date: '2025-09-04', 
      color: '#eb2',
    },
    {
      title: 'Reunião 2', 
      date: '2025-09-04', 
      color: '#68d959',
    },
    {
      title: 'Reunião 3', 
      date: '2025-09-04', 
      color: '#525ceb',
    },
    {
      title: 'Reunião 4', 
      date: '2025-09-04', 
      color: '#44cfac',
    },
    {
      title: 'Reunião 3', 
      date: '2025-09-01', 
      color: '#03a5fc',
    },
    {
      title: 'Reunião 4', 
      date: '2025-09-02', 
      color: '#ff03ee',
    },
    {
      title: 'Reunião 5', 
      date: '2025-09-03', 
      color: '#f25529',
    },
    {
      title: 'Reunião 6', 
      date: '2025-09-04', 
      color: '#f25529',
    },
  ]);
  const [dataWeek] = useState<CalendarEventWeek[]>([
    {
      title: 'Reunião 1', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 00:10', 
      dateEnd: '2025-08-01 02:10', 
      color: '#eb2',
    },
    {
      title: 'Reunião 2', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 00:20', 
      dateEnd: '2025-08-01 01:10', 
      color: '#68d959',
    },
    {
      title: 'Reunião 3', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 01:10', 
      dateEnd: '2025-08-01 01:30', 
      color: '#03a5fc',
    },
    {
      title: 'Reunião 4', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 03:00', 
      dateEnd: '2025-08-01 04:00', 
      color: '#ff03ee',
    },
    {
      title: 'Reunião 5', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 02:00', 
      dateEnd: '2025-08-01 03:30', 
      color: '#f25529',
    },
  ]);
  const [dataList] = useState<CalendarEventList[]>([
    {
      title: 'Reunião 1', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 00:10', 
      dateEnd: '2025-08-01 02:10', 
      color: '#eb2',
      list: 'Colaborador 1',
    },
    {
      title: 'Reunião 2', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 00:20', 
      dateEnd: '2025-08-01 01:10', 
      color: '#68d959',
      list: 'Colaborador 4',
    },
    {
      title: 'Reunião 3', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 01:10', 
      dateEnd: '2025-08-01 01:30', 
      color: '#03a5fc',
      list: 'Colaborador 2',
    },
    {
      title: 'Reunião 4', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 03:00', 
      dateEnd: '2025-08-01 04:00', 
      color: '#ff03ee',
      list: 'Colaborador 2',
    },
    {
      title: 'Reunião 5', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 02:00', 
      dateEnd: '2025-08-01 03:30', 
      color: '#f25529',
      list: 'Colaborador 2',
    },
    {
      title: 'Reunião 1', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 00:10', 
      dateEnd: '2025-08-01 01:10', 
      color: '#525ceb',
      list: 'Colaborador 3',
    },
    {
      title: 'Reunião 2', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 01:20', 
      dateEnd: '2025-08-01 01:50', 
      color: '#68d959',
      list: 'Colaborador 3',
    },
    {
      title: 'Reunião 3', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 00:25', 
      dateEnd: '2025-08-01 01:30', 
      color: '#44cfac',
      list: 'Colaborador 3',
    },
  ]);

  function eventClick(event: CalendarEvent | CalendarEventWeek | CalendarEventList) {
    console.log('Evento clicado:', event);
  }

  function dateClick(date: string, time?: string, list?: string) {
    console.log(date, time, list);
  }

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen p-4 md:p-8">
      <div className="w-full max-w-4xl mb-8 md:mb-20">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
          Calendário React - Demonstração
        </h1>
        <div className="w-full h-auto min-h-[500px]">
          <Calendar 
            type="month"
            year={2025}
            month={9}
            events={dataMonth}
            eventClick={eventClick}
            dateClick={dateClick}
            // eventComponent={CustomEvent}
            // tooltipComponent={CustomTooltip}
          />
        </div>
      </div>
      <div className="w-full max-w-5xl h-auto min-h-[400px] md:h-[700px] mb-8 md:mb-20">
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-4 text-gray-700">
          Visualização Semanal
        </h2>
        <Calendar 
          type="week"
          year={2025}
          week={31}
          events={dataWeek}
          eventClick={eventClick}
          dateClick={dateClick}
          timeInterval={5}
          // eventComponent={CustomEvent}
          // tooltipComponent={CustomTooltip}
        />
      </div>
      <div className="w-full max-w-5xl h-auto min-h-[400px] md:h-[700px] mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-4 text-gray-700">
          Visualização Lista
        </h2>
        <Calendar 
          type="list"
          year={2025}
          month={8}
          day={1}
          events={dataList}
          eventClick={eventClick}
          dateClick={dateClick}
          timeInterval={5}
          // eventComponent={CustomEvent}
          // tooltipComponent={CustomTooltip}
        />
      </div>
    </div>
  )
}

export default App

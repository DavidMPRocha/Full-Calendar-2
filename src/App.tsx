import { useState } from 'react';
import './App.css'
import { Calendar, type CalendarEvent, type CalendarEventList, type CalendarEventWeek, type EventComponentProps, type TooltipComponentProps } from './components/calendar/calendar'

// Componente de tooltip customizado - apenas recebe o event
function CustomTooltip({ event }: TooltipComponentProps) {
  return (
    <>
    </>
  );
}

// Componente de event customizado
function CustomEvent({ event }: EventComponentProps) {
  return (
    <>
      <div className="bg-red-500 w-full h-full">
        <p>{event.title}</p>
      </div>
    </>
  );
}

function App() {  
  const [dataMonth, setDataMonth] = useState<CalendarEvent[]>([
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
  const [dataWeek, setDataWeek] = useState<CalendarEventWeek[]>([
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
      dateStart: '2025-08-01 02:0', 
      dateEnd: '2025-08-01 3:30', 
      color: '#f25529',
    },
  ]);
  const [dataList, setDataList] = useState<CalendarEventList[]>([
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
      dateStart: '2025-08-01 02:0', 
      dateEnd: '2025-08-01 3:30', 
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

  function eventClick(event: any) {
    console.log('Evento clicado:', event);
  }

  function dateClick(date: string, time?: string, list?: string) {
    console.log(date, time, list);
  }

  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      width: '100vw',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{width: '900px', marginBottom: '5rem'}}>
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
      <div style={{width: '1000px', height: '700px', marginBottom: '10rem'}}>
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
      <div style={{width: '1000px', height: '700px', marginBottom: '5rem'}}>
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

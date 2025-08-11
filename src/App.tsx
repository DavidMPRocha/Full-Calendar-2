import { useState } from 'react';
import './App.css'
import { Calendar, type CalendarEvent, type CalendarEventList, type CalendarEventWeek, type TooltipComponentProps } from './components/calendar/calendar'

// Componente de tooltip customizado - apenas recebe o event
function CustomTooltip({ event }: TooltipComponentProps) {
  console.log(event);
  return (
    <>
    </>
  );
}

function App() {  
  const [dataMonth, setDataMonth] = useState<CalendarEvent[]>([
    {
      title: 'Reunião 1', 
      date: '2025-08-01', 
      color: '#eb2',
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
  ]);
  const [dataList, setDataList] = useState<CalendarEventList[]>([
    {
      title: 'Reunião 1', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 00:10', 
      dateEnd: '2025-08-01 02:10', 
      list: 'list1',
      color: '#eb2',
    },
    {
      title: 'Reunião 1', 
      date: '2025-08-01', 
      dateStart: '2025-08-01 01:10', 
      dateEnd: '2025-08-01 02:10', 
      list: 'list1',
      color: '#eb2',
    },
  ]);

  const [data, setData] = useState<CalendarEvent[]>([
    {
      title: 'Reunião de Equipe 22', 
      date: '2025-08-03', 
      dateStart: '2025-08-03 07:00', 
      dateEnd: '2025-08-03 09:10', 
      color: '#eb2',
      list: 'list1',
      description: 'Reunião importante com toda a equipe para discutir os próximos passos do projeto.',
    },
    {
      title: 'Reunião de Equipe', 
      date: '2025-08-03', 
      dateStart: '2025-08-03 09:00', 
      dateEnd: '2025-08-03 09:55', 
      color: '#ef4444',
      list: 'list1',
      description: 'Reunião semanal de alinhamento.',
    },
    {
      title: 'Apresentação de Projeto', 
      date: '2025-08-03', 
      dateStart: '2025-08-03 09:00', 
      dateEnd: '2025-08-03 10:25', 
      color: '#3b82f6',
      list: 'list1',
      description: 'Apresentação do novo projeto para os stakeholders.',
    },
    {
      title: 'Coffee Break', 
      date: '2025-08-03', 
      dateStart: '2025-08-03 09:10', 
      dateEnd: '2025-08-03 09:25', 
      color: '#22c55e',
      list: 'list1',
    },
    {
      title: 'Workshop de Treinamento', 
      date: '2025-08-03', 
      dateStart: '2025-08-03 10:15', 
      dateEnd: '2025-08-03 10:50', 
      color: '#a855f7',
      list: 'list1',
      description: 'Workshop sobre as novas tecnologias da empresa.',
    },
    {
      title: 'Almoço Executivo', 
      date: '2025-08-03', 
      dateStart: '2025-08-03 10:50', 
      dateEnd: '2025-08-03 11:00', 
      color: '#f97316',
      list: 'list1',
    },
    {
      title: 'Sessão de Planejamento', 
      date: '2025-08-03', 
      dateStart: '2025-08-03 09:25', 
      dateEnd: '2025-08-03 11:00', 
      color: '#a0522d',
      list: 'list1',
      description: 'Sessão estratégica de planejamento trimestral.',
    },
    {
      title: 'Reunião de Encerramento', 
      date: '2025-08-03', 
      dateStart: '2025-08-03 11:50', 
      dateEnd: '2025-08-03 12:00', 
      color: '#ec4899',
      list: 'list1',
      description: 'Reunião final para fechar o dia.',
    },
    {
      title: 'Reunião de Equipe 222', 
      date: '2025-08-04', 
      dateStart: '2025-08-04 09:00', 
      dateEnd: '2025-08-04 09:55', 
      color: '#ef4444',
      list: 'list2',
      description: 'Reunião da equipe 2.',
    },
  ]);

  function eventClick(event: any) {
    console.log('Evento clicado:', event);
  }

  function dateClick(date: string, time?: string, list?: string) {
    console.log(date, time, list);
  }

  return (
    <div style={{justifyContent: 'center', alignItems: 'center', width: '100vw'}}>
      <div style={{width: '1500px', marginTop: '2rem'}}>
        <Calendar 
          type="list"
          year={2025}
          month={8}
          day={1}
          events={dataList}
          eventClick={eventClick}
          dateClick={dateClick}
          // tooltipComponent={CustomTooltip}
        />
      </div>
      <div style={{width: '1500px', marginTop: '2rem'}}>
        <Calendar 
          type="week"
          year={2025}
          week={31}
          events={dataWeek}
          eventClick={eventClick}
          dateClick={dateClick}
          // tooltipComponent={CustomTooltip}
        />
      </div>
      <div style={{width: '1500px', marginTop: '2rem'}}>
        <Calendar 
          type="month"
          year={2025}
          month={8}
          events={dataMonth}
          eventClick={eventClick}
          dateClick={dateClick}
          // tooltipComponent={CustomTooltip}
        />
      </div>
    </div>
  )
}

export default App

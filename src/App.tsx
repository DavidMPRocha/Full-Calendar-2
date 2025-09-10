import { useState } from 'react';
import './App.css'
import { Calendar, type CalendarEvent, type CalendarEventList, type CalendarEventWeek } from './components/calendar/calendar'
import { SelectCalendar } from './components/example/select-calendar';
import { Item } from './components/example/item';
import { FormAddEvent } from './components/example/form-add-event';
import { Modal, useModal } from './components/example/Modal';
import { getWeekNumberSundayStart } from './components/calendar/calendar-month';
import { mockEvents } from './data/mockEvents';

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
  const [type, setType] = useState<'month' | 'week' | 'list'>('month');
  const modalFormAddEvent = useModal();
  const [dataList, setDataList] = useState<CalendarEventList[]>(mockEvents);
  const [dataListSeletect, setDataListSeletect] = useState<CalendarEventList | null>(null); // Para editar o evento

  function eventClick(event: CalendarEvent | CalendarEventWeek | CalendarEventList) {
    console.log('Evento clicado:', event);
    setDataListSeletect(event as CalendarEventList);
    modalFormAddEvent.open();
  }

  function dateClick(date: string, time?: string, list?: string) {
    console.log(date, time, list);
    setDataListSeletect({
      id: undefined,
      title: '',
      color: '#5abff2',
      date: date,
      dateStart: time ? date + ' ' + time : '',
      dateEnd: time ? date + ' ' + time : '',
      list: list || ''
    });
    modalFormAddEvent.open();
  }

  function onDelete(event: CalendarEvent) {
    setDataList(dataList.filter((item) => item.id !== event.id));
  }

  function onSubmitForm(newEvent: CalendarEventList) {
    if (newEvent.id) {
      setDataList(dataList.map((item) => item.id === newEvent.id ? newEvent : item));
    } else {
      setDataList([...dataList, {...newEvent, id: new Date().getTime().toString()}]);
    }
    modalFormAddEvent.close();
  }


  return (
    <div className="flex flex-col md:flex-row min-w-screen">
      {/* Events */}
      <div className="gap-4 w-full md:w-[25%] overflow-y-auto p-2">
        <div className="flex gap-2 justify-between items-center">
          <p className="text-xl text-gray-800 font-bold">Eventos</p>
          <button className="border bg-gray-500 text-white border-gray-600 rounded-md p-2" onClick={modalFormAddEvent.open}>Adicionar Evento</button>
        </div>
        {
          dataList.map((item) => (
            <Item key={item.id} item={item} onDelete={onDelete} onEdit={(item) => {setDataListSeletect(item); modalFormAddEvent.open();}} />
          ))
        }
      </div>

      {/* Calendar */}
      <div className="flex-1 justify-center items-center min-h-screen p-4">
        <SelectCalendar type={type} setType={setType} />
        {type === 'month' && (
        <div className="w-full max-w-5xl h-auto min-h-[400px] md:h-[700px]">
          <Calendar 
            type="month"
            year={new Date().getFullYear()}
            month={new Date().getMonth()+1}
            events={dataList}
            eventClick={eventClick}
            dateClick={dateClick}
            // eventComponent={CustomEvent}
            // tooltipComponent={CustomTooltip}
          />
        </div>
        )}
        {type === 'week' && (
        <div className="w-full max-w-5xl h-auto min-h-[400px] md:h-[700px]">
          <Calendar 
            type="week"
            year={new Date().getFullYear()}
            week={getWeekNumberSundayStart(new Date())-1}
            events={dataList}
            eventClick={eventClick}
            dateClick={dateClick}
            timeInterval={5}
            // eventComponent={CustomEvent}
            // tooltipComponent={CustomTooltip}
          />
        </div>
        )}
        {type === 'list' && (
        <div className="w-full max-w-5xl h-auto min-h-[400px] md:h-[700px]">
          <Calendar 
            type="list"
            year={new Date().getFullYear()}
            month={new Date().getMonth()+1}
            day={new Date().getDate()}
            events={dataList}
            eventClick={eventClick}
            dateClick={dateClick}
            timeInterval={5}
            // eventComponent={CustomEvent}
            // tooltipComponent={CustomTooltip}
          />
        </div>
        )}
      </div>

      {/* Docs */}
      <div className="flex flex-col gap-4 w-full md:w-[25%] p-2">
        <p className="text-xl text-gray-800 font-bold">📚 Docs</p>
        In progress...
      </div>
      
      {/* Modal para adicionar/editar evento */}
      <Modal
        isOpen={modalFormAddEvent.isOpen}
        onClose={() => {modalFormAddEvent.close(); setDataListSeletect(null);}}
        title={dataListSeletect !== null ? "Editar Evento" : "Adicionar Novo Evento"}
        size="lg"
      >
        <FormAddEvent 
          defaultValues={dataListSeletect || {
            id: undefined,
            title: '',
            color: '#5abff2',
            date: '',
            dateStart: '',
            dateEnd: '',
            list: ''
          }}
          onSubmitForm={onSubmitForm}
        />
      </Modal>
    </div>
  )
}

export default App



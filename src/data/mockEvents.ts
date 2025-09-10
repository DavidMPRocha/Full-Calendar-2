import type { CalendarEventList } from '../components/calendar/calendar';

const dateNow = new Date().toISOString().split('T')[0];

export const mockEvents: CalendarEventList[] = [
  {
    id: '1',
    title: 'Reunião 1', 
    date: dateNow, 
    dateStart: dateNow + ' 00:10', 
    dateEnd: '2025-08-01 02:10', 
    color: '#eb2',
    list: 'Colaborador 1',
  },
  {
    id: '2',
    title: 'Reunião 2', 
    date: dateNow, 
    dateStart: dateNow + ' 00:20', 
    dateEnd: dateNow + ' 01:10', 
    color: '#68d959',
    list: 'Colaborador 4',
  },
  {
    id: '3',
    title: 'Reunião 3', 
    date: dateNow, 
    dateStart: dateNow + ' 01:10', 
    dateEnd: dateNow + ' 01:30', 
    color: '#03a5fc',
    list: 'Colaborador 2',
  },
  {
    id: '4',
    title: 'Reunião 4', 
    date: dateNow, 
    dateStart: dateNow + ' 03:00', 
    dateEnd: dateNow + ' 04:00', 
    color: '#ff03ee',
    list: 'Colaborador 2',
  },
  {
    id: '5',
    title: 'Reunião 5', 
    date: dateNow, 
    dateStart: dateNow + ' 02:00', 
    dateEnd: dateNow + ' 03:30', 
    color: '#f25529',
    list: 'Colaborador 2',
  },
  {
    id: '6',
    title: 'Reunião 1', 
    date: dateNow, 
    dateStart: dateNow + ' 00:10', 
    dateEnd: dateNow + ' 01:10', 
    color: '#525ceb',
    list: 'Colaborador 3',
  },
  {
    id: '7',
    title: 'Reunião 2', 
    date: dateNow, 
    dateStart: dateNow + ' 01:20', 
    dateEnd: dateNow + ' 01:50', 
    color: '#68d959',
    list: 'Colaborador 3',
  },
  {
    id: '8',
    title: 'Reunião 3', 
    date: dateNow, 
    dateStart: dateNow + ' 00:25', 
    dateEnd: dateNow + ' 01:30', 
    color: '#44cfac',
    list: 'Colaborador 3',
  }
];

export const mockCollaborators = [
  'Colaborador 1',
  'Colaborador 2', 
  'Colaborador 3',
  'Colaborador 4'
];

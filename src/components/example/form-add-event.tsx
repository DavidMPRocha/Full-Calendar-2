import { useForm } from "react-hook-form";
import type { CalendarEventList } from "../calendar/calendar";


interface FormAddEventProps {
  defaultValues: CalendarEventList;
  onSubmitForm: (data: CalendarEventList) => void;
}

export function FormAddEvent({defaultValues, onSubmitForm}: FormAddEventProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CalendarEventList>({
    defaultValues: {
      id: defaultValues.id,
      title: defaultValues.title,
      color: defaultValues.color,
      date: defaultValues.date,
      dateStart: defaultValues.dateStart != '' ? defaultValues.dateStart.split(' ')[1] : '',
      dateEnd: defaultValues.dateEnd != '' ? defaultValues.dateEnd.split(' ')[1] : '',
      list: defaultValues.list
    }
  });

  const onSubmit = (data: CalendarEventList) => {
    onSubmitForm({
      id: data.id,
      title: data.title,
      color: data.color,
      date: data.date,
      dateStart: data.date + ' ' + data.dateStart,
      dateEnd: data.date + ' ' + data.dateEnd,
      list: data.list
    });
  }; 

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label className="text-gray-800 font-bold">Título* (title)</label>
        <input type="text" {...register('title', { required: true })} className="border border-gray-300 rounded-md p-2" />
        {errors.title && <span className="text-red-500">Título é obrigatório</span>}
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-1/2">
            <label className="text-gray-800 font-bold">Cor (color)</label>  
            <input type="color" {...register('color')} className="border border-gray-300 rounded-md p-2 w-full h-10" />
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <label className="text-gray-800 font-bold">Data* (date)</label>
            <input type="date" {...register('date', { required: true })} className="border border-gray-300 rounded-md p-2" />
            {errors.date && <span className="text-red-500">Data é obrigatória</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-1/2">
            <label className="text-gray-800 font-bold">Hora Início* (dateStart)</label>
            <input type="time" {...register('dateStart', { required: true })} className="border border-gray-300 rounded-md p-2" />
            {errors.dateStart && <span className="text-red-500">Hora Início é obrigatória</span>}
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <label className="text-gray-800 font-bold">Hora Fim* (dateEnd)</label>
            <input type="time" {...register('dateEnd', { required: true })} className="border border-gray-300 rounded-md p-2" />
            {errors.dateEnd && <span className="text-red-500">Hora Fim é obrigatória</span>}
          </div>
        </div>
        <label className="text-gray-800 font-bold">Colaborador (list)</label>
        <select {...register("list")} className="border border-gray-300 rounded-md p-2 w-full h-10">
          <option value="">Selecione um colaborador</option>
          <option value="Colaborador 1">Colaborador 1</option>
          <option value="Colaborador 2">Colaborador 2</option>
          <option value="Colaborador 3">Colaborador 3</option>
          <option value="Colaborador 4">Colaborador 4</option>
        </select>
        <input type="submit" className="border border-gray-300 rounded-md p-2" value={defaultValues?.id ? 'Editar' : 'Adicionar'} />
      </div>
    </form>
  );
}
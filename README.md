# 📅 Calendário React - Componente Flexível

Um componente de calendário React moderno e flexível, desenvolvido com TypeScript e Tailwind CSS, que oferece três visualizações distintas para gestão de eventos e agendamentos.

## 🚀 Características Principais

- **Três Visualizações**: Mês, Semana e Lista
- **Totalmente Responsivo**: Adapta-se a diferentes tamanhos de ecrã
- **TypeScript**: Tipagem completa para melhor desenvolvimento
- **Tailwind CSS**: Estilização moderna e customizável
- **Eventos Interativos**: Suporte para cliques em eventos e datas
- **Tooltips Customizáveis**: Possibilidade de tooltips personalizados
- **Navegação Intuitiva**: Filtros e navegação entre períodos

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/DavidMPRocha/Full-Calendar-2.git
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra o browser em `http://localhost:5173`

## 📊 Tipos de Calendário

### 1. 📅 Visualização Mensal (`type="month"`)

A visualização mensal apresenta uma vista tradicional de calendário, mostrando todos os dias do mês selecionado organizados em semanas.

<img width="853" height="805" alt="image" src="https://github.com/user-attachments/assets/d359227b-7722-4353-8587-1a81944052a4" />


#### Características:
- **Layout**: Grid (dias da semana x semanas)
- **Navegação**: Filtros para alterar mês e ano
- **Eventos**: Exibidos como indicadores visuais nos dias correspondentes
- **Interação**: Clique em dias para criar eventos, clique em eventos para detalhes
- **Dias Externos**: Dias de outros meses são visíveis mas destacados diferentemente


#### Propriedades:
```typescript
{
  type: 'month',
  year: number,
  month: number,
  events: CalendarEvent[],
  eventClick?: (event: CalendarEvent) => void,
  dateClick?: (date: string) => void,
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode
}
```

#### Exemplo de Utilização:
```tsx
<Calendar 
  type="month"
  year={2025}
  month={8}
  events={eventosMensais}
  eventClick={handleEventClick}
  dateClick={handleDateClick}
/>
```

### 2. 📅 Visualização Semanal (`type="week"`)

A visualização semanal oferece uma vista detalhada de uma semana específica, com horários organizados verticalmente e dias da semana horizontalmente.

<img width="978" height="808" alt="image" src="https://github.com/user-attachments/assets/40ddaed5-01ce-4356-bff4-69b1e7a4507e" />


#### Características:
- **Layout**: Grid temporal (horários x dias da semana)
- **Precisão**: Intervalos de 5 minutos para agendamentos precisos
- **Eventos**: Posicionados temporalmente com duração visual
- **Sobreposição**: Gestão automática de eventos sobrepostos
- **Navegação**: Filtros para alterar semana e ano
- **Horários**: Das 00:00 às 23:55

#### Propriedades:
```typescript
{
  type: 'week',
  year: number,
  week: number, // Número da semana do ano
  events: CalendarEventWeek[],
  eventClick?: (event: CalendarEventWeek) => void,
  dateClick?: (date: string, time: string) => void,
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode
}
```

#### Exemplo de Utilização:
```tsx
<Calendar 
  type="week"
  year={2025}
  week={31}
  events={eventosSemanais}
  eventClick={handleEventClick}
  dateClick={handleDateTimeClick}
/>
```

### 3. 📅 Visualização Lista (`type="list"`)

A visualização lista apresenta uma vista de agenda para um dia específico, organizando eventos por listas/categorias e horários.

<img width="914" height="787" alt="image" src="https://github.com/user-attachments/assets/47d00375-209b-482c-9cb2-c4ffb329e966" />


#### Características:
- **Layout**: Lista temporal com múltiplas colunas (listas)
- **Organização**: Eventos agrupados por categorias/listas
- **Precisão**: Intervalos de 5 minutos
- **Flexibilidade**: Suporte a múltiplas listas simultâneas
- **Navegação**: Filtros para alterar dia, mês e ano
- **Horários**: Das 00:00 às 23:55

#### Propriedades:
```typescript
{
  type: 'list',
  year: number,
  month: number,
  day: number,
  events: CalendarEventList[],
  eventClick?: (event: CalendarEventList) => void,
  dateClick?: (date: string, time: string, list: string) => void,
  tooltipComponent?: (props: TooltipComponentProps) => ReactNode
}
```

#### Exemplo de Utilização:
```tsx
<Calendar 
  type="list"
  year={2025}
  month={8}
  day={1}
  events={eventosLista}
  eventClick={handleEventClick}
  dateClick={handleDateTimeListClick}
/>
```

## 🖱️ Callbacks de Interação

### eventClick
Callback executado quando um evento é clicado. Recebe o evento completo como parâmetro.

```typescript
// Para visualização mensal
eventClick?: (event: CalendarEvent) => void

// Para visualização semanal
eventClick?: (event: CalendarEventWeek) => void

// Para visualização lista
eventClick?: (event: CalendarEventList) => void
```

**Exemplo de utilização:**
```tsx
const handleEventClick = (event: CalendarEvent) => {
  console.log('Evento clicado:', event.title);
  // Abrir modal de detalhes, editar evento, etc.
};

<Calendar 
  type="month"
  year={2025}
  month={8}
  events={eventos}
  eventClick={handleEventClick}
/>
```

### dateClick
Callback executado quando uma data/hora é clicada. Permite criar novos eventos ou navegar para detalhes.

```typescript
// Para visualização mensal
dateClick?: (date: string) => void

// Para visualização semanal
dateClick?: (date: string, time: string) => void

// Para visualização lista
dateClick?: (date: string, time: string, list: string) => void
```

**Exemplo de utilização:**
```tsx
// Visualização mensal
const handleDateClick = (date: string) => {
  console.log('Data clicada:', date); // formato: "YYYY-MM-DD"
  // Abrir formulário para criar novo evento
};

// Visualização semanal/lista
const handleDateTimeClick = (date: string, time: string) => {
  console.log('Data/Hora clicada:', date, time); // formato: "YYYY-MM-DD", "HH:MM"
  // Abrir formulário para criar novo evento na hora específica
};

// Visualização lista (com lista específica)
const handleDateTimeListClick = (date: string, time: string, list: string) => {
  console.log('Data/Hora/Lista clicada:', date, time, list);
  // Criar evento na lista específica
};
```

## 🎯 Estrutura de Eventos

### CalendarEvent (Mensal)
```typescript
interface CalendarEvent {
  title: string;
  date: string; // formato: "YYYY-MM-DD"
  color?: string;
  [key: string]: any;
}
```

### CalendarEventWeek (Semanal)
```typescript
interface CalendarEventWeek {
  title: string;
  date: string; // formato: "YYYY-MM-DD"
  dateStart: string; // formato: "YYYY-MM-DD HH:MM"
  dateEnd: string; // formato: "YYYY-MM-DD HH:MM"
  color?: string;
  [key: string]: any;
}
```

### CalendarEventList (Lista)
```typescript
interface CalendarEventList {
  title: string;
  date: string; // formato: "YYYY-MM-DD"
  dateStart: string; // formato: "YYYY-MM-DD HH:MM"
  dateEnd: string; // formato: "YYYY-MM-DD HH:MM"
  color?: string;
  list: string; // identificador da lista/categoria
  description?: string;
  [key: string]: any;
}
```

## 🎨 Customização

### Tooltips Personalizados
Pode criar tooltips customizados passando um componente:

```tsx
function CustomTooltip({ event }: TooltipComponentProps) {
  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h3 className="font-bold">{event.title}</h3>
      <p className="text-sm text-gray-600">{event.description}</p>
    </div>
  );
}

<Calendar 
  type="month"
  year={2025}
  month={8}
  events={eventos}
  tooltipComponent={CustomTooltip}
/>
```

### Estilos com Tailwind CSS
O componente utiliza classes Tailwind CSS que podem ser customizadas através de:
- Classes CSS personalizadas
- Configuração do Tailwind
- Props de estilo adicionais

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento

## 🛠️ Tecnologias Utilizadas

- **React 19.1.0** - Framework principal
- **TypeScript 5.8.3** - Tipagem estática
- **Tailwind CSS 4.1.11** - Framework de estilos
- **Vite 7.0.4** - Build tool e dev server
- **ESLint** - Linting de código

## 📁 Estrutura do Projeto

```
src/
├── components/
│   └── calendar/
│       ├── calendar.tsx              # Componente principal
│       ├── calendar-month.tsx        # Visualização mensal
│       ├── calendar-week.tsx         # Visualização semanal
│       ├── calendar-list.tsx         # Visualização lista
│       ├── calendar-header-*.tsx     # Componentes de cabeçalho
│       ├── calendar-*-row.tsx        # Componentes de linha
│       ├── calendar-*-item.tsx       # Componentes de item
│       └── calendar-*-filter.tsx     # Componentes de filtro
├── App.tsx                           # Aplicação principal
└── main.tsx                          # Ponto de entrada
```
---

**Desenvolvido com ❤️ usando React, TypeScript e Tailwind CSS**

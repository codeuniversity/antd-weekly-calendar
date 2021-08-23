export interface GenericEvent {
  eventId: string
  startTime: Date
  endTime: Date
  title?: string | undefined | null
  location?: string | undefined | null
  allDay?: boolean
  textColor?: string | undefined
  backgroundColor?: string | undefined
}

export interface CalendarProps<T> {
  onEventClick?: (e: T) => any | undefined
  onSelectDate?: (e: Date) => any | undefined
  weekends?: boolean
  eventTextColor?: string
  eventBackgroundColor?: string
}

export interface CalendarContainerProps<T> extends CalendarProps<T> {
  events: T[]
  value?: Date
}

export interface CalendarBodyProps<T> extends CalendarProps<T> {
  weekDates: GetWeekDates
  getDayEvents: WeekObject<T> | undefined
}

export type WeekObject<T> = {
  sunday: T[]
  monday: T[]
  tuesday: T[]
  wednesday: T[]
  thursday: T[]
  friday: T[]
  saturday: T[]
}

export interface EventBlockProps<T> {
  event: T
  index: number
  hour: Date
  events: number
  onEventClick?: (e: T) => any | undefined
}

export type ColumnNode<T> = T[] | string

export type EventsObject<T> = {
  id: number
  hourObject: Date
  hour: string
  Monday: T[] | undefined
  Tuesday: T[] | undefined
  Wednesday: T[] | undefined
  Thursday: T[] | undefined
  Friday: T[] | undefined
  Saturday: T[] | undefined
  Sunday: T[] | undefined
}

export interface GetWeekDates {
  startDate: Date
  endDate: Date
}

export type DayName = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

export interface CalendarHeaderProps {
  startWeek: Date
  setStartWeek: React.Dispatch<React.SetStateAction<Date>>
}

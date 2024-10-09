import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { startOfWeek, endOfWeek } from 'date-fns';

import Calendar from './components/CalendarBody';
import { CalendarHeader } from './components/CalendarHeader';
import { GenericEvent, CalendarContainerProps } from './components/types';
import { daysToWeekObject } from './components/utils';

export function WeeklyCalendar<T extends GenericEvent>({
  events,
  onEventClick,
  onSelectDate,
  weekends = false,
  currentDate,
  value
}: CalendarContainerProps<T>) {
  const dateToUse = currentDate || value;

  const [startWeek, setStartWeek] = useState(startOfWeek(dateToUse || new Date(), { weekStartsOn: 0 }));
  const weekPeriod = {
    startDate: startWeek,
    endDate: endOfWeek(startWeek),
  };

  useEffect(() => {
    if (dateToUse && startOfWeek(dateToUse).getTime() !== startWeek.getTime()) {
      setStartWeek(dateToUse);
    }
  }, [dateToUse]);

  useEffect(() => {
    onSelectDate && onSelectDate(startWeek);
  }, [startWeek]);

  const weekObject = daysToWeekObject(events, startWeek);

  return (
    <Card>
      <CalendarHeader startWeek={startWeek} setStartWeek={setStartWeek} />
      <Calendar
        weekDatesRange={weekPeriod}
        getDayEvents={weekObject}
        onEventClick={onEventClick as (e: GenericEvent) => any}
        weekends={weekends}
      />
    </Card>
  );
}

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
}: CalendarContainerProps<T>) {
  const [startWeek, setStartWeek] = useState(startOfWeek(currentDate || new Date(), { weekStartsOn: 0 }));
  const weekPeriod = {
    startDate: startWeek,
    endDate: endOfWeek(startWeek),
  };

  useEffect(() => {
    if (currentDate && startOfWeek(currentDate).getTime() !== startWeek.getTime()) {
      setStartWeek(currentDate);
    }
  }, [currentDate]);

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

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
  value,
}: CalendarContainerProps<T>) {
  const [startWeek, setStartWeek] = useState(startOfWeek(value || new Date()));
  const weekPeriod = {
    startDate: startWeek,
    endDate: endOfWeek(startWeek),
  };

  useEffect(() => {
    if (value && startOfWeek(value).getTime() !== startWeek.getTime()) {
      setStartWeek(value);
    }
  }, [value]);

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

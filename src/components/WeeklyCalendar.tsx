import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { startOfWeek, endOfWeek } from 'date-fns';

import Calendar from './CalendarBody';
import { CalendarHeader } from './CalendarHeader';
import { GenericEvent, CalendarContainerProps } from './types';
import { daysToWeekObject } from './utils';

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
        weekDates={weekPeriod}
        getDayEvents={weekObject}
        onEventClick={onEventClick}
        weekends={weekends}
      />
    </Card>
  );
}

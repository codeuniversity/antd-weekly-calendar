import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import {
  getDay,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameWeek,
} from 'date-fns';

import Calendar from './CalendarBody';
import { CalendarHeader } from './CalendarHeader';

import {
  GenericEvent,
  CalendarContainerProps,
  WeekObject,
  DayName,
} from './types';

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

  const daysToWeekObject = <T extends GenericEvent>(events: T[]) => {
    const dayNames: DayName[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    const weekObject: WeekObject<T> = {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    };

    if (events == null) {
      return weekObject;
    }

    for (const googleEventIndex in events) {
      const eventStartTimeDay = events[googleEventIndex].startTime;
      const eventEndTimeDay = events[googleEventIndex].endTime;

      if (!isSameDay(eventStartTimeDay, eventEndTimeDay)) {
        const result = eachDayOfInterval({
          start: eventStartTimeDay,
          end: eventEndTimeDay,
        });
        for (const dayInterval in result) {
          const splitedEvent = { ...events[googleEventIndex] };
          splitedEvent.startTime = result[dayInterval];
          splitedEvent.endTime = result[dayInterval];
          const weekObjectKey: DayName =
            dayNames[getDay(new Date(result[dayInterval]))];
          isSameWeek(startWeek, splitedEvent.startTime) &&
            weekObject[weekObjectKey].push(splitedEvent);
        }
      } else {
        const weekObjectKey: DayName = dayNames[getDay(eventStartTimeDay)];
        weekObject[weekObjectKey].push(events[googleEventIndex]);
      }
    }

    return weekObject;
  };
  const weekObject = daysToWeekObject(events);

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

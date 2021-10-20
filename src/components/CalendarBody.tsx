import React from 'react';
import {
  add,
  isSameHour,
  addHours,
  startOfDay,
  startOfWeek,
  format,
  getDay,
  setDay,
  differenceInMinutes,
} from 'date-fns';
import { Table } from 'antd';

import {
  GenericEvent,
  WeekObject,
  CalendarBodyProps,
  EventsObject,
  EventBlockProps,
  ColumnNode,
  GetWeekDates,
} from './types';

const BOX_POSITION_OFFSET = 26;
const HOUR_TO_DECIMAL = 1.666666667;
const MIN_BOX_SIZE = 40;
const TURQUOISE = '#36CFC9';
const ALL_DAY_ROW = 0;

const EventBlock = <T extends GenericEvent>({
  event,
  index,
  hour,
  events,
  onEventClick,
}: EventBlockProps<T>) => {
  const getEventDay = getDay(new Date(event.endTime));
  const fitHourToDate = setDay(hour, getEventDay);

  const boxStyle = event.allDay
    ? { boxSize: MIN_BOX_SIZE, boxPosition: index * BOX_POSITION_OFFSET }
    : sizeEventBox(event, fitHourToDate);
  const boxLeftPosition = event.allDay ? 0 : BOX_POSITION_OFFSET * index;

  return (
    <div
      style={{
        display:
          !event.allDay &&
          differenceInMinutes(new Date(event.endTime), fitHourToDate) === 0
            ? 'none'
            : 'block',
        height: boxStyle.boxSize + '%',
        width: event.allDay ? 80 + '%' : 80 / events + '%',
        position: 'absolute',
        top: boxStyle.boxPosition + '%',
        left: boxLeftPosition + '%',
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: '0.01rem',
        borderRadius: '5px',
        backgroundColor: event.backgroundColor
          ? event.backgroundColor
          : TURQUOISE,
        zIndex: 1,
      }}
      onClick={onEventClick ? () => onEventClick(event) : undefined}
      key={index}
    >
      <p style={{ color: 'white', fontSize: '12px', paddingLeft: '5px' }}>
        {event.title}
      </p>
    </div>
  );
};

function Calendar<T extends GenericEvent>({
  weekDates,
  getDayEvents,
  onEventClick,
  weekends,
}: CalendarBodyProps<T>) {
  const getDayHoursEvents = (
    value: GetWeekDates,
    weekObject: WeekObject<T> | undefined
  ) => {
    const ALL_DAY_EVENT = 0;
    const events: EventsObject<T>[] = [];

    for (let i = 0; i < 26; i++) {
      const startDate = add(startOfDay(startOfWeek(value.startDate)), {
        days: 1,
      });
      const hour = addHours(startDate, i - 1);

      events.push({
        id: i,
        hourObject: hour,
        hour: i != ALL_DAY_EVENT ? format(hour, 'hh a') : 'all-day',
        Monday:
          weekObject?.monday &&
          weekObject?.monday.filter(e => {
            return e.allDay
              ? i === ALL_DAY_EVENT
              : isSameHour(e.startTime, hour);
          }),
        Tuesday:
          weekObject?.tuesday &&
          weekObject?.tuesday.filter(e => {
            return e.allDay
              ? i === ALL_DAY_EVENT
              : isSameHour(e.startTime, add(hour, { days: 1 }));
          }),
        Wednesday:
          weekObject?.wednesday &&
          weekObject?.wednesday.filter(e => {
            return e.allDay
              ? i === ALL_DAY_EVENT
              : isSameHour(e.startTime, add(hour, { days: 2 }));
          }),
        Thursday:
          weekObject?.thursday &&
          weekObject?.thursday.filter(e => {
            return e.allDay
              ? i === ALL_DAY_EVENT
              : isSameHour(e.startTime, add(hour, { days: 3 }));
          }),
        Friday:
          weekObject?.friday &&
          weekObject?.friday.filter(e => {
            return e.allDay
              ? i === ALL_DAY_EVENT
              : isSameHour(e.startTime, add(hour, { days: 4 }));
          }),
        Saturday:
          weekObject?.saturday &&
          weekObject?.saturday.filter(e => {
            return e.allDay
              ? i === ALL_DAY_EVENT
              : isSameHour(e.startTime, add(hour, { days: 5 }));
          }),
        Sunday:
          weekObject?.sunday &&
          weekObject?.sunday.filter(e => {
            return e.allDay
              ? i === ALL_DAY_EVENT
              : isSameHour(e.startTime, add(hour, { days: 6 }));
          }),
      });
    }

    return events;
  };

  const dayList = weekends
    ? [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ]
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const dayColumns = dayList.map((day, counter) => {
    const columnDate = add(new Date(weekDates.startDate), {
      days: 1 + counter,
    });
    const formattedDayandMonth =
      format(columnDate, 'iii') + ' ' + format(columnDate, 'dd');
    return {
      title: formattedDayandMonth,
      dataIndex: day,
      key: day,
      width: 2,
      render: function(
        events: ColumnNode<T>,
        row: EventsObject<T>
      ): React.ReactNode | undefined {
        if (events && events.length > 0 && events instanceof Array) {
          const eventsBlock = events.map(function(
            event,
            index: number
          ): React.ReactNode {
            return (
              <EventBlock
                key={event.eventId}
                event={event}
                index={index}
                hour={row.hourObject}
                events={events.length}
                onEventClick={onEventClick}
              />
            );
          });

          return {
            props: {
              style: { position: 'relative', padding: '0' },
            },
            children: <>{eventsBlock}</>,
          };
        }
        return undefined;
      },
    };
  });
  const hourColumn = {
    title: 'Hours',
    dataIndex: 'hour',
    key: 'hour',
    width: 1,
    render: (hour: ColumnNode<T>) => {
      return {
        props: {
          style: { width: '10%' },
        },
        children: <div>{hour}</div>,
      };
    },
  };
  const tableColumns = [hourColumn, ...dayColumns];

  return (
    <div className="dayViewContainer">
      <Table
        rowKey={record => record.id}
        dataSource={getDayHoursEvents(weekDates, getDayEvents)}
        columns={tableColumns}
        pagination={false}
        bordered={true}
        showHeader={true}
        onRow={(_, rowIndex) => {
          if (rowIndex === ALL_DAY_ROW) {
            return {
              style: {
                backgroundColor: 'white',
                position: 'sticky',
                boxShadow: 'rgba(0, 0, 0, 0.05) -1px 4px 4px ',
                zIndex: 1,
                top: 0,
              },
            };
          }
          return {};
        }}
        scroll={{
          y: 1000,
        }}
      />
    </div>
  );
}

const sizeEventBox = <T extends GenericEvent>(event: T, hour: Date) => {
  const eventStartTime = new Date(event.startTime);
  const eventEndTime = new Date(event.endTime);
  const boxSize =
    Math.floor(
      differenceInMinutes(eventEndTime, eventStartTime) * HOUR_TO_DECIMAL
    ) < MIN_BOX_SIZE
      ? MIN_BOX_SIZE
      : Math.floor(
          differenceInMinutes(eventEndTime, eventStartTime) * HOUR_TO_DECIMAL
        );
  const boxPosition =
    differenceInMinutes(hour, eventStartTime) * HOUR_TO_DECIMAL > 100
      ? 0
      : differenceInMinutes(eventStartTime, hour) * HOUR_TO_DECIMAL;

  return { boxPosition: boxPosition, boxSize: boxSize };
};

export default Calendar;

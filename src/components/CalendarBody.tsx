import React, { useEffect, useRef } from 'react';
import { add, format, getDay, setDay, differenceInMinutes } from 'date-fns';
import { Table } from 'antd';

import {
  GenericEvent,
  CalendarBodyProps,
  EventsObject,
  EventBlockProps,
  ColumnNode,
} from './types';
import { getDayHoursEvents, sizeEventBox, MIN_BOX_SIZE } from './utils';

const BOX_POSITION_OFFSET = 26;
const SCROLL_TO_ROW = 19;
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
  const rowRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    if (rowRef.current) {
      rowRef.current?.scrollIntoView();
    }
  }, [rowRef]);

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
    render: (hour: ColumnNode<T>, {}, id: number) => {
      return {
        props: {
          style: { width: '10%' },
        },
        children:
          SCROLL_TO_ROW === id ? (
            <div ref={rowRef}>{hour}</div>
          ) : (
            <div>{hour}</div>
          ),
      };
    },
  };
  const tableColumns = [hourColumn, ...dayColumns];

  return (
    <div>
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

export default Calendar;

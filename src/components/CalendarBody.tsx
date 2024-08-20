import React, { useEffect, useRef } from 'react';
import { Table } from 'antd';

import {
  GenericEvent,
  CalendarBodyProps,

  ColumnNode,
} from './types';
import { getDayHoursEvents } from './utils';
import { createDayColumns, SCROLL_TO_ROW } from './columns';

const ALL_DAY_ROW = 0;


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
  const dayColumns = createDayColumns(weekDates, weekends, onEventClick)

  const hourColumn = {
    title: 'Hours',
    dataIndex: 'hour',
    key: 'hour',
    width: 1,
    render: (hour: ColumnNode<T>, { }, id: number) => {
      return {
        props: {
          style: { width: '10%' },
        },
        children:
          SCROLL_TO_ROW === id ? (

            // @ts-ignore
            <div ref={rowRef}>{hour}</div>
          ) : (
              // @ts-ignore
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

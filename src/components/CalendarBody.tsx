import React, { useEffect, useRef } from 'react';
import { Table, Grid } from 'antd';

import {
  GenericEvent,
  CalendarBodyProps,
} from './types';
import { getDayHoursEvents } from './utils';
import { createDayColumns, SCROLL_TO_ROW } from './columns';

const ALL_DAY_ROW = 0;
const { useBreakpoint } = Grid;

function Calendar<T extends GenericEvent>({
  weekDatesRange,
  getDayEvents,
  onEventClick,
  weekends,
}: CalendarBodyProps<T>) {
  const rowRef = useRef<null | HTMLDivElement>(null);
  const screens = useBreakpoint();

  useEffect(() => {
    if (rowRef.current) {
      rowRef.current.scrollIntoView();
    }
  }, [rowRef]);

  const fontSize = screens.xs ? '12px' : '14px'
  const hourColumn = {
    title: <div style={{ fontSize: screens.xs ? '14px' : '16px', textAlign: 'center', padding: '8px 0' }}>Hours</div>,
    dataIndex: 'hour',
    key: 'hour',
    width: screens.xs ? 50 : 1,
    render: (hour: string, { }, id: number) => {
      return {
        props: {
          style: {
            width: screens.xs ? '30%' : '10%',
            fontSize: fontSize
          },
        },
        children: SCROLL_TO_ROW === id ? (
          <div ref={rowRef}>{hour}</div>
        ) : (
          <div>{hour}</div>
        ),
      };
    },
  };

  const dayColumns = createDayColumns(weekDatesRange, weekends, onEventClick).map((col) => ({
    ...col,
    title: (
      <div
        style={{
          whiteSpace: 'nowrap',
          fontSize: fontSize
        }}
      >
        {/*  @ts-ignore */}
        {col.title}
      </div>
    ),
  }));

  const tableColumns = [hourColumn, ...dayColumns];

  return (
    <div style={{ overflowX: 'scroll' }}>
      <Table
        rowKey={record => record.id}
        dataSource={getDayHoursEvents(weekDatesRange, getDayEvents)}
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
                padding: '8px 0',
              },
            };
          }
          return {
            style: {
              padding: '8px 0', // Add padding for each row
            },
          };
        }}
        scroll={{
          y: screens.xs ? 300 : 1000,
          x: 'max-content',
        }}
      />
    </div>
  );
}

export default Calendar;

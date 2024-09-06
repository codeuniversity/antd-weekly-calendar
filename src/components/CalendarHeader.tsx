import React from 'react';
import { Button, Row, Col, Tag, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {
  addWeeks,
  startOfWeek,
  endOfWeek,
  getMonth,
  format,
  getWeek,
} from 'date-fns';

import DatePicker from './DatePicker';

import { CalendarHeaderProps } from './types';

interface MonthNameProps {
  startWeek: Date;
}

const MonthName: React.FunctionComponent<MonthNameProps> = ({ startWeek }) => {
  const getMonthName = () => {
    const endOfWeekDate = endOfWeek(startWeek);

    if (getMonth(endOfWeekDate) == getMonth(startWeek)) {
      return format(startWeek, 'MMM');
    }

    return format(startWeek, 'MMM') + '-' + format(endOfWeekDate, 'MMM');
  };

  const belowButtonPadding = "4px 15px"

  return (
    <div style={{ display: 'flex', alignItems: 'center', maxHeight: '25px' }}>
      <div
        style={{
          fontSize: "16px",
          fontWeight: 500,
          marginBottom: 0,
          marginRight: '10px',
          padding: belowButtonPadding
        }}
      >
        {getMonthName()}
      </div>
      <Tag>Week {getWeek(new Date(addWeeks(startWeek, -1)))}</Tag>
    </div>
  );
};

export const CalendarHeader: React.FunctionComponent<CalendarHeaderProps> = ({
  startWeek,
  setStartWeek,
}) => {
  return (
    <>
      <Row style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ alignSelf: 'center' }}>
          <MonthName startWeek={startWeek} />
        </div>
      </Row>
      <Row justify="space-between" style={{ marginBottom: '20px' }}>
        <Col
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', marginRight: '20px' }}>
            <Button onClick={() => setStartWeek(startOfWeek(new Date()))}>
              Today
            </Button>
            <div style={{ display: 'flex', padding: '0 10px' }}>
              <Button
                style={{ margin: '0 5px' }}
                onClick={() => setStartWeek(addWeeks(startWeek, -1))}
              >
                <LeftOutlined />
              </Button>
              <Button
                style={{ margin: '0 5px' }}
                onClick={() => setStartWeek(addWeeks(startWeek, 1))}
              >
                <RightOutlined />
              </Button>
            </div>
          </div>

        </Col>
        <Col>
          <DatePicker
            onChange={date => {
              if (date) {
                setStartWeek(startOfWeek(new Date(date)));
              }
            }}
            picker="week"
            defaultValue={startOfWeek(new Date())}
          />
        </Col>
      </Row>
    </>
  );
};

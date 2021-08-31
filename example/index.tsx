import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WeeklyCalendar } from '../.';
// import { WeeklyCalendar } from 'antd-weekly-calendar';

import { Card, PageHeader } from 'antd';
import './index.less';

const App = () => {
  const event = {
    eventId: '12',
    startTime: new Date(),
    endTime: new Date(),
    title: 'test',
  };
  return (
    <div>
      {/* <Calendar /> */}
      <Card>
        <WeeklyCalendar
          events={[event]}
          weekends={true}
          onEventClick={event => console.log(event)}
        />{' '}
      </Card>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

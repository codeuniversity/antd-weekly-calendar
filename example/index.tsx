import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { add } from 'date-fns';
import { WeeklyCalendar } from '../.';

import { Card } from 'antd';
import './index.less';

const App = () => {
  const event = {
    eventId: '12',
    startTime: new Date(),
    endTime: add(new Date(), { hours: 1 }),
    title: 'test event',
  };

  const coloredEvent = {
    eventId: '123',
    startTime: add(new Date(), { days: 1 }),
    endTime: add(new Date(), { days: 1, hours: 2 }),
    title: 'another test event',
    backgroundColor: 'green',
  };

  return (
    <div>
      <Card>
        <WeeklyCalendar
          events={[event, coloredEvent]}
          weekends={true}
          onEventClick={event => console.log(event)}
        />{' '}
      </Card>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

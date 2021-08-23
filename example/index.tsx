import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WeeklyCalendar } from '../.';

const App = () => {
  const event = {
    eventId: '12',
    startTime: new Date(),
    endTime: new Date(),
  };
  return (
    <div>
      <WeeklyCalendar
        events={[event]}
        onEventClick={event => console.log(event)}
      />{' '}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

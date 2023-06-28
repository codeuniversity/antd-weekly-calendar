# Antd Weekly Calendar

A weekly calendar component for antd.

![Selection_839](https://i.im.ge/2022/12/18/dnPCy8.image.png)

- [Antd Weekly Calendar](#antd-weekly-calendar)
  - [Getting Started](#getting-started)
  - [Example](#example)
  - [Api](#api)
    - [`<WeeklyCalendar />`](#weeklycalendar-)
    - [Event Api](#event-api)
  - [Contributing](#contributing)

## Getting Started


```
npm install antd-weekly-calendar
```

## Example

This is a basic example, check out the `example` folder for a complete Chakra UI example!

```tsx
import {
  WeeklyCalendar,
} from 'antd-weekly-calendar';

const events = [
  { startTime: new Date(2021, 3, 21, 12, 0, 0), endTime: new Date(2021, 3, 21, 14, 30, 0), title: 'Ap. 1', backgroundColor: 'red' },
  { startTime: new Date(2021, 3, 25, 10, 0, 0), endTime: new Date(2021, 3, 25, 17, 15, 0), title: 'Ap. 1' },
];

function MyCalendar() {
  return (
      <>
        <WeeklyCalendar
            events={events}
            onEventClick={(event) => console.log(event)}
            onSelectDate={(date) => console.log(date)}
        />
      </>
  );
}


```

## Api

### `<WeeklyCalendar />`



| Property     | Type | Default      | Description                                                                      |
| ------------ | ------- | ------------ | -------------------------------------------------------------------------------- |
| onEventClick | `(event) => void`        |   -    | Callback for when an event is being clicked                                       |
| onSelectDate |  `(date) => void`     | -| Callback for when a date is selected                   |
| weekends?     | `boolean` | `false`| Display weekend on the calendar    |

### Event Api


| Value      | Type      | Default   | Description                                                |
| ---------- | ---------- | ---------------------- | ---------------------------------------------------------- |
| eventId | `string`         | -                          | EventId |
| startTime | `Date`       | -                   | event start time                     |
| endTime | `Date`   | -     | event end time |
| title | `string`  | - | event title           |
| location?  |    `string`    | -           | event location |
| allDay?  |   `boolean`   | `false`   | is the event a full day event?                                                          |
| textColor? |  `string`       |       `white` | You can use any of the CSS color formats such `#f00`, `#ff0000`, `rgb(255,0,0)`, or `red`.|
| backgroundColor?| `string`   | `#36CFC9`     | You can use any of the CSS color formats such `#f00`, `#ff0000`, `rgb(255,0,0)`, or `red`.|




## Contributing

This is my first open source project.  Please feel free to contribute in any way you want.

Contributing can be as simple as giving feedback in the issues, updating documentation or writing your own posts, that can be linked in the README.
Of course you are also welcome to propose changes via the issues or pull requests.

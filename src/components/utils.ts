import {
  add,
  isSameHour,
  isSameDay,
  addHours,
  eachDayOfInterval,
  startOfDay,
  getDay,
  isSameWeek,
  startOfWeek,
  format,
  differenceInMinutes,
} from 'date-fns';

import {
  WeekObject,
  EventsObject,
  WeekDateRange,
  GenericEvent,
  DayName,
} from './types';


/**
 * Converts an array of events into a structured object representing the events of a specific week.
 *
 * This function processes a list of events and organizes them into a week object, where each day of the week (Sunday to Saturday)
 * contains an array of events that occur on that day. The function handles events that span multiple days by splitting them
 * into separate events for each day they cover.
 *
 * @template T - The type of the event objects in the events array. This should extend the GenericEvent interface.
 * @param {T[]} events - The array of event objects to be processed. Each event object must have a `startTime` and `endTime`.
 * @param {Date} startWeek - The start date of the week for which the events should be organized.
 * @returns {WeekObject<T>} An object representing the week, where each key is a day of the week ('sunday', 'monday', etc.),
 * and the value is an array of events that occur on that day.
 * // weekObject will contain events organized by day for the specified week
 */
export const daysToWeekObject = <T extends GenericEvent>(
  events: T[],
  startWeek: Date
) => {

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
  for (const eventListIndex in events) {
    const eventStartTimeDay = events[eventListIndex].startTime;
    const eventEndTimeDay = events[eventListIndex].endTime;

    if (!isSameWeek(eventStartTimeDay, startWeek)) {
      continue;
    }
    if (!isSameDay(eventStartTimeDay, eventEndTimeDay)) {
      const result = eachDayOfInterval({
        start: eventStartTimeDay,
        end: eventEndTimeDay,
      });
      for (const dayInterval in result) {
        const splitedEvent = { ...events[eventListIndex] };
        splitedEvent.startTime = result[dayInterval];
        splitedEvent.endTime = result[dayInterval];
        const weekObjectKey: DayName =
          dayNames[getDay(new Date(result[dayInterval]))];
        isSameWeek(startWeek, splitedEvent.startTime) &&
          weekObject[weekObjectKey].push(splitedEvent);
      }
    } else {
      const weekObjectKey: DayName = dayNames[getDay(eventStartTimeDay)];
      weekObject[weekObjectKey].push(events[eventListIndex]);
    }
  }
  return weekObject;
};

/**
 *
 * This function processes a week's worth of events, grouping them by hour for each day of the week.
 * It creates an array of objects representing each hour slot. Each object contains a list of events that occur within that hour on each day.
 * The first row represents all-day events, followed by 24 hourly rows.
 *
 * @template T - The type of the event objects. This should extend the GenericEvent interface.
 * @param {WeekDateRange} weekRange - The start and end dates for the week being processed.
 * @param {WeekObject<T>} [weekObject] - An object containing arrays of events for each day of the week.
 * @returns {EventsObject<T>[]} An array of event objects, grouped by hour, to be used in a calendar table.
 *
 * @remarks
 * - The function generates 26 rows: 1 for all-day events, 24 for each hour of the day, and 1 header row.
 * - Each day of the week is processed, and events are filtered to determine whether they occur within the
 *   corresponding hour slot. The `isSameHour` function ensures that events are accurately placed.
 * - The generated array can be used to populate an Ant Design Table component, aligning events with their
 *   corresponding hour and day.
 *
 * @see createDayColumns
 */

export const getDayHoursEvents = <T extends GenericEvent>(
  weekRange: WeekDateRange,
  weekObject: WeekObject<T> | undefined
) => {
  const ALL_DAY_EVENT = 0;
  const ROW_AMOUNT = 26

  const events: EventsObject<T>[] = [];
  for (let i = 0; i < ROW_AMOUNT; i++) {
    const startDate = startOfDay(startOfWeek(weekRange.startDate))
    const hour = addHours(startDate, i);

    events.push({
      id: i,
      hourObject: hour,
      hour: i != ALL_DAY_EVENT ? format(hour, 'hh a') : 'all-day',
      Sunday:
        weekObject?.sunday &&
        weekObject?.sunday.filter(e => {

          return e.allDay
            ? i === ALL_DAY_EVENT
            : isSameHour(e.startTime, add(hour, { days: 0 }));
        }),
      Monday:
        weekObject?.monday &&
        weekObject?.monday.filter(e => {
          return e.allDay ? i === ALL_DAY_EVENT : isSameHour(e.startTime, add(hour, { days: 1 }));
        }),
      Tuesday:
        weekObject?.tuesday &&
        weekObject?.tuesday.filter(e => {
          return e.allDay
            ? i === ALL_DAY_EVENT
            : isSameHour(e.startTime, add(hour, { days: 2 }));
        }),
      Wednesday:
        weekObject?.wednesday &&
        weekObject?.wednesday.filter(e => {
          return e.allDay
            ? i === ALL_DAY_EVENT
            : isSameHour(e.startTime, add(hour, { days: 3 }));
        }),
      Thursday:
        weekObject?.thursday &&
        weekObject?.thursday.filter(e => {
          return e.allDay
            ? i === ALL_DAY_EVENT
            : isSameHour(e.startTime, add(hour, { days: 4 }));
        }),
      Friday:
        weekObject?.friday &&
        weekObject?.friday.filter(e => {
          return e.allDay
            ? i === ALL_DAY_EVENT
            : isSameHour(e.startTime, add(hour, { days: 5 }));
        }),
      Saturday:
        weekObject?.saturday &&
        weekObject?.saturday.filter(e => {
          return e.allDay
            ? i === ALL_DAY_EVENT
            : isSameHour(e.startTime, add(hour, { days: 6 }));
        })

    });
  }
  return events;
};

const HOUR_TO_DECIMAL = 1.666666667;
export const MIN_BOX_SIZE = 40;

// make sure that the hour and the daya are the same
export const sizeEventBox = <T extends GenericEvent>(event: T, hour: Date) => {
  const eventStartTime = new Date(event.startTime);
  const eventEndTime = new Date(event.endTime);
  console.log(eventStartTime, eventEndTime, "the event time!")
  console.log(hour, "the given hour!")

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
  console.log("box position claculation:", differenceInMinutes(eventStartTime, hour), hour, eventStartTime)
  console.log({ boxPosition: boxPosition, boxSize: boxSize }, "the box size!")
  return { boxPosition: boxPosition, boxSize: boxSize };
};

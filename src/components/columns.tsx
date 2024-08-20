
import React from 'react';
import { add, format } from 'date-fns';
import { ColumnProps } from 'antd/es/table';

import {
    GenericEvent,
    EventsObject,
    ColumnNode,
} from './types';
import { EventBlock } from './Event';

export const SCROLL_TO_ROW = 19;



export function createDayColumns<T extends GenericEvent>(
    weekDates: { startDate: Date; endDate: Date },
    weekends: boolean,
    onEventClick?: (e: T) => any | undefined,
): ColumnProps<EventsObject<T>>[] {
    const dayList = weekends
        ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return dayList.map((day, counter) => {
        const columnDate = add(new Date(weekDates.startDate), {
            days: 1 + counter,  // Keep this as is since it works in your original code
        });
        const formattedDayandMonth =
            format(columnDate, 'iii') + ' ' + format(columnDate, 'dd');

        return {
            title: formattedDayandMonth,
            dataIndex: day,
            key: day,
            width: 2,
            render: function (
                events: ColumnNode<T>,
                row: EventsObject<T>
            ): React.ReactNode | undefined {
                if (events && events.length > 0 && events instanceof Array) {
                    const eventsBlock = events.map(function (
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
                    return (<>{eventsBlock}</>)

                }
                return undefined;
            },
        } as ColumnProps<EventsObject<T>>;
    });
}
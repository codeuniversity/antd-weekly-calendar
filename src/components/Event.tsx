import React, { useEffect, useRef } from 'react';
import { add, format, getDay, setDay, differenceInMinutes } from 'date-fns';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

import {
    GenericEvent,
    CalendarBodyProps,
    EventsObject,
    EventBlockProps,
    ColumnNode,
} from './types';
import { getDayHoursEvents, sizeEventBox, MIN_BOX_SIZE } from './utils';

const BOX_POSITION_OFFSET = 26;
const TURQUOISE = '#36CFC9';


export const EventBlock = <T extends GenericEvent>({
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


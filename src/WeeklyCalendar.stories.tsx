import React from 'react';
import { Meta, StoryFn } from '@storybook/react/types-6-0';
import { add, sub } from 'date-fns';
import { WeeklyCalendar } from './WeeklyCalendar';
import { GenericEvent } from './components/types';

export default {
    title: 'Components/WeeklyCalendar',
    component: WeeklyCalendar,
} as Meta;

const Template: StoryFn = (args: any) => <WeeklyCalendar {...args} />;

// Mock events for the story
const mockEvents: GenericEvent[] = [
    {
        eventId: '1',
        startTime: new Date(),
        endTime: add(new Date(), { hours: 1 }),
        title: 'Event 1',
    },
    {
        eventId: '2',
        startTime: sub(new Date(), { days: 1, hours: 2 }),
        endTime: sub(new Date(), { days: 1, hours: 1 }),
        title: 'Event 2',
        backgroundColor: 'red',
    },
    {
        eventId: '3',
        startTime: add(new Date(), { days: 2 }),
        endTime: add(new Date(), { days: 2, hours: 2 }),
        title: 'Event 3',
        backgroundColor: 'blue',
    },
];

export const Default = Template.bind({});
Default.args = {
    events: mockEvents,
    weekends: true,
    onEventClick: (event: GenericEvent) => alert(`Clicked on event: ${event.title}`),
    onSelectDate: (date: Date) => console.log(`Selected date: ${date}`),
    value: new Date(),
};

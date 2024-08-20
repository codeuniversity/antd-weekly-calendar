import React from 'react';
import { render } from '@testing-library/react';
import CalendarBody from '../CalendarBody';
import { GenericEvent, WeekObject, CalendarBodyProps } from '../types';
import '@testing-library/jest-dom';
// import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import userEvent from '@testing-library/user-event';


// Setup for the tests
beforeAll(() => {
    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }));

    // Optional: Mock scrollIntoView if your tests trigger this function
    Element.prototype.scrollIntoView = vi.fn();
});



describe('Calendar Component', () => {
    const mockWeekDates = {
        startDate: new Date('2023-01-01T00:00:00Z'), // This is a Sunday
        endDate: new Date('2023-01-07T23:59:59Z'),
    };

    const mockEvents: GenericEvent[] = [
        {
            eventId: '1',
            startTime: new Date('2023-01-02T10:00:00Z'),
            endTime: new Date('2023-01-02T11:00:00Z'),
            title: 'Test Event 1'
        },
        {
            eventId: '2',
            startTime: new Date('2023-01-03T14:00:00Z'),
            endTime: new Date('2023-01-03T15:00:00Z'),
            title: 'Test Event 2'
        },
    ];

    const mockGetDayEvents: WeekObject<GenericEvent> = {
        sunday: [],
        monday: [mockEvents[0]],
        tuesday: [mockEvents[1]],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
    };

    const defaultProps: CalendarBodyProps<GenericEvent> = {
        weekDatesRange: mockWeekDates,
        getDayEvents: mockGetDayEvents,
        onEventClick: vi.fn(),
        weekends: false,
    };

    it('renders without errors', () => {
        const { getByRole } = render(<CalendarBody {...defaultProps} />);
        expect(getByRole('table')).toBeInTheDocument();
    });

    it('renders correct date labels', () => {
        const { getByText } = render(<CalendarBody {...defaultProps} weekends={true} />);
        const expectedLabels = ['Hours', 'Mon 02', 'Tue 03', 'Wed 04', 'Thu 05', 'Fri 06', 'Sat 07', 'Sun 08'];
        expectedLabels.forEach(label => {
            expect(getByText(label)).toBeInTheDocument();
        });
    });
    // currenly this is test is not catching the error
    it('renders events when provided', () => {
        const { getByText } = render(<CalendarBody {...defaultProps} />);
        expect(getByText('Test Event 1')).toBeInTheDocument();
        expect(getByText('Test Event 2')).toBeInTheDocument();
    });

    it('renders events when provided', () => {
        const { queryByText } = render(<CalendarBody {...defaultProps} />);

        // Check that the events are rendered
        expect(queryByText('Test Event 1')).toBeInTheDocument();
        expect(queryByText('Test Event 2')).toBeInTheDocument();

        // Negative test: Ensure the event elements are not absent
        expect(queryByText('Nonexistent Event')).not.toBeInTheDocument();
    });

    it('calls onEventClick when an event is clicked', async () => {
        const user = userEvent.setup();
        const onEventClick = vi.fn();  // Use `vi.fn()` instead of `jest.fn()`

        const { getByText } = render(<CalendarBody {...defaultProps} onEventClick={onEventClick} />);

        const event = getByText('Test Event 1');
        await user.click(event);

        expect(onEventClick).toHaveBeenCalledWith(mockEvents[0]);
    });

});

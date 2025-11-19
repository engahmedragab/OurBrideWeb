import React, { useState, useEffect } from 'react';
import { plannerService } from '@/services/plannerService';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';

interface CalendarEvent {
  id: number;
  name?: string;
  nameEn?: string;
  time?: string;
  duration?: string;
  [key: string]: any;
}

export default function PlannerCalendar() {
  const [eventLines, setEventLines] = useState<CalendarEvent[]>([]);
  const [occasionLines, setOccasionLines] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        setLoading(true);

        // Initialize event book if needed
        try {
          const eventBook = await plannerService.eventBooks.getBook();
          if (!eventBook || (eventBook.isBookInit !== undefined && !eventBook.isBookInit)) {
            await plannerService.eventBooks.init();
          }
        } catch (err) {
          await plannerService.eventBooks.init();
        }

        // Initialize occasion book if needed
        try {
          const occasionBook = await plannerService.occasionBooks.getBook();
          if (!occasionBook || (occasionBook.isBookInit !== undefined && !occasionBook.isBookInit)) {
            await plannerService.occasionBooks.init();
          }
        } catch (err) {
          await plannerService.occasionBooks.init();
        }

        await loadCalendarData();
      } catch (err: any) {
        setError(err.message || 'Failed to initialize calendar');
      } finally {
        setLoading(false);
      }
    };

    initializeAndLoad();
  }, [currentDate]);

  const loadCalendarData = async () => {
    try {
      // Load event lines (timeline events)
      const events = await plannerService.eventBooks.getAll() || [];
      setEventLines(events.filter((e: CalendarEvent) => !e.isDeleted));

      // Load occasion lines
      const occasions = await plannerService.occasionBooks.getAll() || [];
      setOccasionLines(occasions.filter((o: CalendarEvent) => !o.isDeleted));
    } catch (err: any) {
      setError(err.message || 'Failed to load calendar data');
    }
  };

  const getAllEvents = () => {
    return [...eventLines, ...occasionLines].filter((e: CalendarEvent) => {
      if (!e.time) return false;
      const eventDate = new Date(e.time);
      const year = eventDate.getFullYear();
      const month = eventDate.getMonth();
      return year === currentDate.getFullYear() && month === currentDate.getMonth();
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getEventsForDay = (day: number) => {
    if (!day) return [];
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return getAllEvents().filter((e: CalendarEvent) => {
      if (!e.time) return false;
      const eventDate = new Date(e.time);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth();

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Wedding Calendar</h2>
        <div className="btn-group">
          <button
            className={`btn btn-outline-primary ${view === 'month' ? 'active' : ''}`}
            onClick={() => setView('month')}
          >
            Month
          </button>
          <button
            className={`btn btn-outline-primary ${view === 'week' ? 'active' : ''}`}
            onClick={() => setView('week')}
          >
            Week
          </button>
          <button
            className={`btn btn-outline-primary ${view === 'day' ? 'active' : ''}`}
            onClick={() => setView('day')}
          >
            Day
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigateMonth('prev')}
        >
          <i className="fas fa-chevron-left"></i> Previous
        </button>
        <h3 className="mb-0">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigateMonth('next')}
        >
          Next <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        <div className="row g-0 border">
          {/* Day Headers */}
          {dayNames.map((day) => (
            <div key={day} className="col border-end p-2 bg-light text-center fw-bold">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="row g-0 border-top">
          {days.map((day, index) => (
            <div
              key={index}
              className="col border-end border-bottom p-2"
              style={{ minHeight: '100px' }}
            >
              {day && (
                <>
                  <div className="fw-bold mb-1">{day}</div>
                  <div className="small">
                    {getEventsForDay(day).slice(0, 3).map((event: CalendarEvent, idx: number) => (
                      <div
                        key={idx}
                        className="badge bg-primary mb-1 d-block text-truncate"
                        title={event.name || event.nameEn || 'Event'}
                      >
                        {formatTime(event.time)} {event.name || event.nameEn || 'Event'}
                      </div>
                    ))}
                    {getEventsForDay(day).length > 3 && (
                      <div className="text-muted small">
                        +{getEventsForDay(day).length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Event Summary */}
      <div className="mt-4">
        <h4>Upcoming Events</h4>
        <div className="list-group">
          {getAllEvents()
            .sort((a, b) => {
              if (!a.time || !b.time) return 0;
              return new Date(a.time).getTime() - new Date(b.time).getTime();
            })
            .slice(0, 10)
            .map((event: CalendarEvent) => (
              <div key={event.id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="mb-1">{event.name || event.nameEn || 'Event'}</h6>
                    <small className="text-muted">
                      {formatDate(event.time)} {formatTime(event.time)}
                    </small>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

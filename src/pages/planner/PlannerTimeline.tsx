import React, { useState, useEffect } from 'react';
import { plannerService } from '@/services/plannerService';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';

interface EventLine {
  id: number;
  slug: string;
  isDone: boolean;
  isFavorite: boolean;
  isDeleted: boolean;
  lineCategoryId?: number;
  name?: string;
  nameAr?: string;
  nameEn?: string;
  time?: string;
  duration?: string;
  description?: string;
  [key: string]: any;
}

export default function PlannerTimeline() {
  const [eventLines, setEventLines] = useState<EventLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [filter, setFilter] = useState<'all' | 'done' | 'notDone' | 'favorite'>('all');

  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        setLoading(true);
        try {
          const book = await plannerService.eventBooks.getBook();

          if (!book || (book.isBookInit !== undefined && !book.isBookInit)) {
            await plannerService.eventBooks.init();
          }
        } catch (err) {
          await plannerService.eventBooks.init();
        }
        setIsInitialized(true);

        await loadEventLines();
      } catch (err: any) {
        setError(err.message || 'Failed to initialize timeline');
      } finally {
        setLoading(false);
      }
    };

    initializeAndLoad();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      loadEventLines();
    }
  }, [filter, isInitialized]);

  const loadEventLines = async () => {
    try {
      let data: EventLine[] = [];

      switch (filter) {
        case 'done':
          data = await plannerService.eventBooks.getDone() || [];
          break;
        case 'notDone':
          data = await plannerService.eventBooks.getNotDone() || [];
          break;
        case 'favorite':
          data = await plannerService.eventBooks.getFavorite() || [];
          break;
        default:
          data = await plannerService.eventBooks.getAll() || [];
      }

      // Sort by time if available
      const sorted = data
        .filter((line: EventLine) => !line.isDeleted)
        .sort((a, b) => {
          if (a.time && b.time) {
            return new Date(a.time).getTime() - new Date(b.time).getTime();
          }
          return 0;
        });

      setEventLines(sorted);
    } catch (err: any) {
      setError(err.message || 'Failed to load timeline events');
    }
  };

  const handleToggleDone = async (eventLine: EventLine) => {
    try {
      await plannerService.eventBooks.markDone(eventLine.id, eventLine.slug);
      await loadEventLines();
    } catch (err: any) {
      alert(err.message || 'Failed to update event');
    }
  };

  const handleToggleFavorite = async (eventLine: EventLine) => {
    try {
      await plannerService.eventBooks.markFavorite(eventLine.id, eventLine.slug);
      await loadEventLines();
    } catch (err: any) {
      alert(err.message || 'Failed to update event');
    }
  };

  const handleDelete = async (eventLine: EventLine) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await plannerService.eventBooks.delete(eventLine.id, eventLine.slug);
        await loadEventLines();
      } catch (err: any) {
        alert(err.message || 'Failed to delete event');
      }
    }
  };

  const handleCreate = async () => {
    const name = prompt('Enter event name:');
    const time = prompt('Enter event time (YYYY-MM-DD HH:mm):');
    const description = prompt('Enter event description (optional):');

    if (name && time) {
      try {
        await plannerService.eventBooks.create({
          name: name,
          nameAr: name,
          nameEn: name,
          time: new Date(time).toISOString(),
          description: description || undefined,
          descriptionAr: description || undefined,
          descriptionEn: description || undefined,
        });
        await loadEventLines();
      } catch (err: any) {
        alert(err.message || 'Failed to create event');
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date set';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
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

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Wedding Timeline</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="fas fa-plus me-2"></i>Add Event
        </button>
      </div>

      {/* Filter Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({eventLines.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'notDone' ? 'active' : ''}`}
            onClick={() => setFilter('notDone')}
          >
            Upcoming
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'done' ? 'active' : ''}`}
            onClick={() => setFilter('done')}
          >
            Completed
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'favorite' ? 'active' : ''}`}
            onClick={() => setFilter('favorite')}
          >
            Important
          </button>
        </li>
      </ul>

      {/* Timeline */}
      {eventLines.length === 0 ? (
        <div className="alert alert-info">
          <p>No timeline events yet. Click "Add Event" to get started!</p>
        </div>
      ) : (
        <div className="timeline">
          {eventLines.map((event, index) => (
            <div key={event.id} className="card mb-3">
              <div className={`card-body ${event.isDone ? 'bg-light' : ''}`}>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input me-3"
                        checked={event.isDone}
                        onChange={() => handleToggleDone(event)}
                      />
                      <h5 className="card-title mb-0">
                        {event.name || event.nameEn || `Event ${event.id}`}
                      </h5>
                      {event.isFavorite && (
                        <span className="badge bg-warning ms-2">
                          <i className="fas fa-star"></i> Important
                        </span>
                      )}
                    </div>

                    {event.time && (
                      <p className="text-muted mb-2">
                        <i className="fas fa-clock me-2"></i>
                        {formatDate(event.time)}
                      </p>
                    )}

                    {event.description && (
                      <p className="card-text">{event.description}</p>
                    )}
                  </div>

                  <div className="btn-group">
                    <button
                      className={`btn btn-sm ${event.isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => handleToggleFavorite(event)}
                      title="Toggle important"
                    >
                      <i className={`fas ${event.isFavorite ? 'fa-star' : 'fa-star-o'}`}></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(event)}
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

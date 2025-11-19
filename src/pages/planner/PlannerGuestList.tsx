import React, { useState, useEffect } from 'react';
import { plannerService } from '@/services/plannerService';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';

interface GuestLine {
  id: number;
  slug: string;
  isDone: boolean;
  isFavorite: boolean;
  isDeleted: boolean;
  lineCategoryId?: number;
  name?: string;
  nameAr?: string;
  nameEn?: string;
  email?: string;
  phoneNumber?: string;
  [key: string]: any;
}

export default function PlannerGuestList() {
  const [guestLines, setGuestLines] = useState<GuestLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [filter, setFilter] = useState<'all' | 'done' | 'notDone' | 'favorite'>('all');

  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        setLoading(true);
        try {
          const book = await plannerService.guestBooks.getBook();
          
          if (!book || (book.isBookInit !== undefined && !book.isBookInit)) {
            await plannerService.guestBooks.init();
          }
        } catch (err) {
          await plannerService.guestBooks.init();
        }
        setIsInitialized(true);
        
        await loadGuestLines();
      } catch (err: any) {
        setError(err.message || 'Failed to initialize guest list');
      } finally {
        setLoading(false);
      }
    };

    initializeAndLoad();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      loadGuestLines();
    }
  }, [filter, isInitialized]);

  const loadGuestLines = async () => {
    try {
      let data: GuestLine[] = [];
      
      switch (filter) {
        case 'done':
          data = await plannerService.guestBooks.getDone() || [];
          break;
        case 'notDone':
          data = await plannerService.guestBooks.getNotDone() || [];
          break;
        case 'favorite':
          data = await plannerService.guestBooks.getFavorite() || [];
          break;
        default:
          data = await plannerService.guestBooks.getAll() || [];
      }
      
      setGuestLines(data.filter((line: GuestLine) => !line.isDeleted));
    } catch (err: any) {
      setError(err.message || 'Failed to load guest list');
    }
  };

  const handleToggleDone = async (guestLine: GuestLine) => {
    try {
      await plannerService.guestBooks.markDone(guestLine.id, guestLine.slug);
      await loadGuestLines();
    } catch (err: any) {
      alert(err.message || 'Failed to update guest');
    }
  };

  const handleToggleFavorite = async (guestLine: GuestLine) => {
    try {
      await plannerService.guestBooks.markFavorite(guestLine.id, guestLine.slug);
      await loadGuestLines();
    } catch (err: any) {
      alert(err.message || 'Failed to update guest');
    }
  };

  const handleDelete = async (guestLine: GuestLine) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await plannerService.guestBooks.delete(guestLine.id, guestLine.slug);
        await loadGuestLines();
      } catch (err: any) {
        alert(err.message || 'Failed to delete guest');
      }
    }
  };

  const handleCreate = async () => {
    const name = prompt('Enter guest name:');
    const email = prompt('Enter guest email (optional):');
    const phone = prompt('Enter guest phone (optional):');
    
    if (name) {
      try {
        await plannerService.guestBooks.create({
          name: name,
          nameAr: name,
          nameEn: name,
          email: email || undefined,
          phoneNumber: phone || undefined,
        });
        await loadGuestLines();
      } catch (err: any) {
        alert(err.message || 'Failed to create guest');
      }
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
        <div>
          <h2>Guest List</h2>
          <p className="text-muted mb-0">Total Guests: <strong>{guestLines.length}</strong></p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="fas fa-plus me-2"></i>Add Guest
        </button>
      </div>

      {/* Filter Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({guestLines.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'notDone' ? 'active' : ''}`}
            onClick={() => setFilter('notDone')}
          >
            Pending
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'done' ? 'active' : ''}`}
            onClick={() => setFilter('done')}
          >
            Confirmed
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'favorite' ? 'active' : ''}`}
            onClick={() => setFilter('favorite')}
          >
            VIP
          </button>
        </li>
      </ul>

      {/* Guest List */}
      {guestLines.length === 0 ? (
        <div className="alert alert-info">
          <p>No guests yet. Click "Add Guest" to get started!</p>
        </div>
      ) : (
        <div className="row">
          {guestLines.map((guest) => (
            <div key={guest.id} className="col-md-6 col-lg-4 mb-3">
              <div className={`card ${guest.isDone ? 'border-success' : ''}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">
                      {guest.name || guest.nameEn || `Guest ${guest.id}`}
                    </h5>
                    <div className="btn-group btn-group-sm">
                      <button
                        className={`btn ${guest.isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={() => handleToggleFavorite(guest)}
                        title="Toggle VIP"
                      >
                        <i className={`fas ${guest.isFavorite ? 'fa-star' : 'fa-star-o'}`}></i>
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(guest)}
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  
                  {guest.email && (
                    <p className="card-text small mb-1">
                      <i className="fas fa-envelope me-2"></i>{guest.email}
                    </p>
                  )}
                  {guest.phoneNumber && (
                    <p className="card-text small mb-2">
                      <i className="fas fa-phone me-2"></i>{guest.phoneNumber}
                    </p>
                  )}
                  
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={guest.isDone}
                      onChange={() => handleToggleDone(guest)}
                      id={`guest-${guest.id}`}
                    />
                    <label className="form-check-label" htmlFor={`guest-${guest.id}`}>
                      {guest.isDone ? 'Confirmed' : 'Pending Confirmation'}
                    </label>
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

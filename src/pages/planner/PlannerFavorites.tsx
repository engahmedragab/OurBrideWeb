import React, { useState, useEffect } from 'react';
import { plannerService } from '@/services/plannerService';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';

interface FavoriteItem {
  id: number;
  slug: string;
  bookType: 'todo' | 'budget' | 'guest' | 'event' | 'item' | 'note' | 'service' | 'occasion';
  name?: string;
  nameEn?: string;
  nameAr?: string;
  [key: string]: any;
}

export default function PlannerFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'todo' | 'budget' | 'guest' | 'event' | 'item' | 'note' | 'service' | 'occasion'>('all');

  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        setLoading(true);

        // Initialize all books if needed
        const books = [
          { service: plannerService.todoBooks, name: 'todo' },
          { service: plannerService.budgetBooks, name: 'budget' },
          { service: plannerService.guestBooks, name: 'guest' },
          { service: plannerService.eventBooks, name: 'event' },
          { service: plannerService.itemBooks, name: 'item' },
          { service: plannerService.noteBooks, name: 'note' },
          { service: plannerService.serviceBooks, name: 'service' },
          { service: plannerService.occasionBooks, name: 'occasion' },
        ];

        for (const book of books) {
          try {
            const bookData = await book.service.getBook();
            if (!bookData || (bookData.isBookInit !== undefined && !bookData.isBookInit)) {
              await book.service.init();
            }
          } catch (err) {
            // If book doesn't exist, try to initialize it
            try {
              await book.service.init();
            } catch (initErr) {
              // Continue if initialization fails
              console.warn(`Failed to initialize ${book.name} book:`, initErr);
            }
          }
        }

        await loadFavorites();
      } catch (err: any) {
        setError(err.message || 'Failed to initialize favorites');
      } finally {
        setLoading(false);
      }
    };

    initializeAndLoad();
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [filter]);

  const loadFavorites = async () => {
    try {
      const allFavorites: FavoriteItem[] = [];

      // Load favorites from each book type
      if (filter === 'all' || filter === 'todo') {
        const todos = await plannerService.todoBooks.getFavorite() || [];
        todos.forEach((item: any) => {
          allFavorites.push({ ...item, bookType: 'todo' });
        });
      }

      if (filter === 'all' || filter === 'budget') {
        const budgets = await plannerService.budgetBooks.getFavorite() || [];
        budgets.forEach((item: any) => {
          allFavorites.push({ ...item, bookType: 'budget' });
        });
      }

      if (filter === 'all' || filter === 'guest') {
        const guests = await plannerService.guestBooks.getFavorite() || [];
        guests.forEach((item: any) => {
          allFavorites.push({ ...item, bookType: 'guest' });
        });
      }

      if (filter === 'all' || filter === 'event') {
        const events = await plannerService.eventBooks.getFavorite() || [];
        events.forEach((item: any) => {
          allFavorites.push({ ...item, bookType: 'event' });
        });
      }

      if (filter === 'all' || filter === 'item') {
        const items = await plannerService.itemBooks.getFavorite() || [];
        items.forEach((item: any) => {
          allFavorites.push({ ...item, bookType: 'item' });
        });
      }

      if (filter === 'all' || filter === 'note') {
        const notes = await plannerService.noteBooks.getFavorite() || [];
        notes.forEach((item: any) => {
          allFavorites.push({ ...item, bookType: 'note' });
        });
      }

      if (filter === 'all' || filter === 'service') {
        const services = await plannerService.serviceBooks.getFavorite() || [];
        services.forEach((item: any) => {
          allFavorites.push({ ...item, bookType: 'service' });
        });
      }

      if (filter === 'all' || filter === 'occasion') {
        const occasions = await plannerService.occasionBooks.getFavorite() || [];
        occasions.forEach((item: any) => {
          allFavorites.push({ ...item, bookType: 'occasion' });
        });
      }

      setFavorites(allFavorites.filter((item: FavoriteItem) => !item.isDeleted));
    } catch (err: any) {
      setError(err.message || 'Failed to load favorites');
    }
  };

  const handleUnfavorite = async (item: FavoriteItem) => {
    try {
      switch (item.bookType) {
        case 'todo':
          await plannerService.todoBooks.markFavorite(item.id, item.slug);
          break;
        case 'budget':
          await plannerService.budgetBooks.markFavorite(item.id, item.slug);
          break;
        case 'guest':
          await plannerService.guestBooks.markFavorite(item.id, item.slug);
          break;
        case 'event':
          await plannerService.eventBooks.markFavorite(item.id, item.slug);
          break;
        case 'item':
          await plannerService.itemBooks.markFavorite(item.id, item.slug);
          break;
        case 'note':
          await plannerService.noteBooks.markFavorite(item.id, item.slug);
          break;
        case 'service':
          await plannerService.serviceBooks.markFavorite(item.id, item.slug);
          break;
        case 'occasion':
          await plannerService.occasionBooks.markFavorite(item.id, item.slug);
          break;
      }
      await loadFavorites();
    } catch (err: any) {
      alert(err.message || 'Failed to remove from favorites');
    }
  };

  const getBookTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      todo: 'Checklist',
      budget: 'Budget',
      guest: 'Guest',
      event: 'Timeline',
      item: 'Item',
      note: 'Note',
      service: 'Service',
      occasion: 'Occasion',
    };
    return labels[type] || type;
  };

  const getBookTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      todo: 'primary',
      budget: 'success',
      guest: 'info',
      event: 'warning',
      item: 'secondary',
      note: 'dark',
      service: 'danger',
      occasion: 'purple',
    };
    return colors[type] || 'secondary';
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
        <h2>My Favorites</h2>
        <p className="text-muted mb-0">Total: <strong>{favorites.length}</strong> favorites</p>
      </div>

      {/* Filter Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({favorites.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'todo' ? 'active' : ''}`}
            onClick={() => setFilter('todo')}
          >
            Checklist
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'budget' ? 'active' : ''}`}
            onClick={() => setFilter('budget')}
          >
            Budget
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'guest' ? 'active' : ''}`}
            onClick={() => setFilter('guest')}
          >
            Guests
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'event' ? 'active' : ''}`}
            onClick={() => setFilter('event')}
          >
            Events
          </button>
        </li>
      </ul>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <div className="alert alert-info">
          <p>No favorites yet. Mark items as favorites in other planner sections to see them here!</p>
        </div>
      ) : (
        <div className="row">
          {favorites.map((item) => (
            <div key={`${item.bookType}-${item.id}`} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className={`badge bg-${getBookTypeColor(item.bookType)}`}>
                      {getBookTypeLabel(item.bookType)}
                    </span>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleUnfavorite(item)}
                      title="Remove from favorites"
                    >
                      <i className="fas fa-star"></i>
                    </button>
                  </div>

                  <h5 className="card-title">
                    {item.name || item.nameEn || item.nameAr || `${getBookTypeLabel(item.bookType)} Item ${item.id}`}
                  </h5>

                  {item.description && (
                    <p className="card-text small text-muted">{item.description}</p>
                  )}

                  {item.time && (
                    <p className="card-text small">
                      <i className="fas fa-clock me-2"></i>
                      {new Date(item.time).toLocaleString()}
                    </p>
                  )}

                  {item.amount && (
                    <p className="card-text small">
                      <strong>{item.amount.toFixed(2)} EGP</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

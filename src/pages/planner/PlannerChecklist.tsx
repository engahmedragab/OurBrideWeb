import React, { useState, useEffect } from 'react';
import { plannerService } from '@/services/plannerService';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';

interface TodoLine {
  id: number;
  slug: string;
  isDone: boolean;
  isFavorite: boolean;
  isDeleted: boolean;
  lineCategoryId?: number;
  [key: string]: any;
}

export default function PlannerChecklist() {
  const [todoLines, setTodoLines] = useState<TodoLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [filter, setFilter] = useState<'all' | 'done' | 'notDone' | 'favorite'>('all');

  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        setLoading(true);
        // Check if book is initialized by trying to get it
        try {
          const book = await plannerService.todoBooks.getBook();

          if (!book || (book.isBookInit !== undefined && !book.isBookInit)) {
            // Initialize the book if not initialized
            await plannerService.todoBooks.init();
          }
        } catch (err) {
          // If book doesn't exist, initialize it
          await plannerService.todoBooks.init();
        }
        setIsInitialized(true);

        // Load todo lines based on filter
        await loadTodoLines();
      } catch (err: any) {
        setError(err.message || 'Failed to initialize checklist');
      } finally {
        setLoading(false);
      }
    };

    initializeAndLoad();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      loadTodoLines();
    }
  }, [filter, isInitialized]);

  const loadTodoLines = async () => {
    try {
      let data: TodoLine[] = [];

      switch (filter) {
        case 'done':
          data = await plannerService.todoBooks.getDone() || [];
          break;
        case 'notDone':
          data = await plannerService.todoBooks.getNotDone() || [];
          break;
        case 'favorite':
          data = await plannerService.todoBooks.getFavorite() || [];
          break;
        default:
          data = await plannerService.todoBooks.getAll() || [];
      }

      // Filter out deleted items
      setTodoLines(data.filter((line: TodoLine) => !line.isDeleted));
    } catch (err: any) {
      setError(err.message || 'Failed to load checklist items');
    }
  };

  const handleToggleDone = async (todoLine: TodoLine) => {
    try {
      await plannerService.todoBooks.markDone(todoLine.id, todoLine.slug);
      await loadTodoLines();
    } catch (err: any) {
      alert(err.message || 'Failed to update item');
    }
  };

  const handleToggleFavorite = async (todoLine: TodoLine) => {
    try {
      await plannerService.todoBooks.markFavorite(todoLine.id, todoLine.slug);
      await loadTodoLines();
    } catch (err: any) {
      alert(err.message || 'Failed to update item');
    }
  };

  const handleDelete = async (todoLine: TodoLine) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await plannerService.todoBooks.delete(todoLine.id, todoLine.slug);
        await loadTodoLines();
      } catch (err: any) {
        alert(err.message || 'Failed to delete item');
      }
    }
  };

  const handleCreate = async () => {
    const title = prompt('Enter checklist item title:');
    if (title) {
      try {
        await plannerService.todoBooks.create({
          // Add required fields based on API
          name: title,
          nameAr: title,
          nameEn: title,
        });
        await loadTodoLines();
      } catch (err: any) {
        alert(err.message || 'Failed to create item');
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
        <h2>Wedding Checklist</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="fas fa-plus me-2"></i>Add Item
        </button>
      </div>

      {/* Filter Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({todoLines.length})
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
            Completed
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'favorite' ? 'active' : ''}`}
            onClick={() => setFilter('favorite')}
          >
            Favorites
          </button>
        </li>
      </ul>

      {/* Todo List */}
      {todoLines.length === 0 ? (
        <div className="alert alert-info">
          <p>No checklist items yet. Click "Add Item" to get started!</p>
        </div>
      ) : (
        <div className="list-group">
          {todoLines.map((todo) => (
            <div
              key={todo.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${todo.isDone ? 'bg-light' : ''
                }`}
            >
              <div className="d-flex align-items-center flex-grow-1">
                <input
                  type="checkbox"
                  className="form-check-input me-3"
                  checked={todo.isDone}
                  onChange={() => handleToggleDone(todo)}
                />
                <div className="flex-grow-1">
                  <h5 className="mb-1">{todo.name || todo.nameEn || `Item ${todo.id}`}</h5>
                  {todo.description && (
                    <p className="mb-0 text-muted small">{todo.description}</p>
                  )}
                </div>
              </div>
              <div className="btn-group">
                <button
                  className={`btn btn-sm ${todo.isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => handleToggleFavorite(todo)}
                  title="Toggle favorite"
                >
                  <i className={`fas ${todo.isFavorite ? 'fa-star' : 'fa-star-o'}`}></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(todo)}
                  title="Delete"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

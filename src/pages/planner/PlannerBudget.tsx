import React, { useState, useEffect } from 'react';
import { plannerService } from '@/services/plannerService';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';

interface BudgetLine {
  id: number;
  slug: string;
  isDone: boolean;
  isFavorite: boolean;
  isDeleted: boolean;
  lineCategoryId?: number;
  amount?: number;
  estimatedAmount?: number;
  actualAmount?: number;
  [key: string]: any;
}

export default function PlannerBudget() {
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [filter, setFilter] = useState<'all' | 'done' | 'notDone' | 'favorite'>('all');

  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        setLoading(true);
        try {
          const book = await plannerService.budgetBooks.getBook();

          if (!book || (book.isBookInit !== undefined && !book.isBookInit)) {
            await plannerService.budgetBooks.init();
          }
        } catch (err) {
          await plannerService.budgetBooks.init();
        }
        setIsInitialized(true);

        await loadBudgetLines();
      } catch (err: any) {
        setError(err.message || 'Failed to initialize budget');
      } finally {
        setLoading(false);
      }
    };

    initializeAndLoad();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      loadBudgetLines();
    }
  }, [filter, isInitialized]);

  const loadBudgetLines = async () => {
    try {
      let data: BudgetLine[] = [];

      switch (filter) {
        case 'done':
          data = await plannerService.budgetBooks.getDone() || [];
          break;
        case 'notDone':
          data = await plannerService.budgetBooks.getNotDone() || [];
          break;
        case 'favorite':
          data = await plannerService.budgetBooks.getFavorite() || [];
          break;
        default:
          data = await plannerService.budgetBooks.getAll() || [];
      }

      setBudgetLines(data.filter((line: BudgetLine) => !line.isDeleted));
    } catch (err: any) {
      setError(err.message || 'Failed to load budget items');
    }
  };

  const handleToggleDone = async (budgetLine: BudgetLine) => {
    try {
      await plannerService.budgetBooks.markDone(budgetLine.id, budgetLine.slug);
      await loadBudgetLines();
    } catch (err: any) {
      alert(err.message || 'Failed to update item');
    }
  };

  const handleToggleFavorite = async (budgetLine: BudgetLine) => {
    try {
      await plannerService.budgetBooks.markFavorite(budgetLine.id, budgetLine.slug);
      await loadBudgetLines();
    } catch (err: any) {
      alert(err.message || 'Failed to update item');
    }
  };

  const handleDelete = async (budgetLine: BudgetLine) => {
    if (window.confirm('Are you sure you want to delete this budget item?')) {
      try {
        await plannerService.budgetBooks.delete(budgetLine.id, budgetLine.slug);
        await loadBudgetLines();
      } catch (err: any) {
        alert(err.message || 'Failed to delete item');
      }
    }
  };

  const handleCreate = async () => {
    const name = prompt('Enter budget item name:');
    const amount = prompt('Enter estimated amount:');

    if (name && amount) {
      try {
        await plannerService.budgetBooks.create({
          name: name,
          nameAr: name,
          nameEn: name,
          estimatedAmount: parseFloat(amount),
        });
        await loadBudgetLines();
      } catch (err: any) {
        alert(err.message || 'Failed to create item');
      }
    }
  };

  const calculateTotal = () => {
    return budgetLines.reduce((sum, line) => {
      return sum + (line.estimatedAmount || line.amount || 0);
    }, 0);
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
          <h2>Budget Planner</h2>
          <p className="text-muted mb-0">Total Budget: <strong>{calculateTotal().toFixed(2)} EGP</strong></p>
        </div>
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
            All ({budgetLines.length})
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

      {/* Budget List */}
      {budgetLines.length === 0 ? (
        <div className="alert alert-info">
          <p>No budget items yet. Click "Add Item" to get started!</p>
        </div>
      ) : (
        <div className="list-group">
          {budgetLines.map((budget) => (
            <div
              key={budget.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${budget.isDone ? 'bg-light' : ''
                }`}
            >
              <div className="d-flex align-items-center flex-grow-1">
                <input
                  type="checkbox"
                  className="form-check-input me-3"
                  checked={budget.isDone}
                  onChange={() => handleToggleDone(budget)}
                />
                <div className="flex-grow-1">
                  <h5 className="mb-1">{budget.name || budget.nameEn || `Budget Item ${budget.id}`}</h5>
                  <div className="d-flex gap-3">
                    <span className="text-muted">
                      Estimated: <strong>{(budget.estimatedAmount || budget.amount || 0).toFixed(2)} EGP</strong>
                    </span>
                    {budget.actualAmount && (
                      <span className="text-muted">
                        Actual: <strong>{budget.actualAmount.toFixed(2)} EGP</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="btn-group">
                <button
                  className={`btn btn-sm ${budget.isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => handleToggleFavorite(budget)}
                  title="Toggle favorite"
                >
                  <i className={`fas ${budget.isFavorite ? 'fa-star' : 'fa-star-o'}`}></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(budget)}
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

import { useState } from 'react';
import { useTodos } from '../context/TodoContext';

export default function TodoItem({ todo, onEdit }) {
  const { updateTodo, deleteTodo } = useTodos();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isOverdue = new Date(todo.due_date) < new Date() && todo.status !== 'completed';
  const isCompleted = todo.status === 'completed';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if today
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    // Check if tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    // Otherwise show full date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const due = new Date(todo.due_date);
    const diff = due - now;

    if (diff < 0) {
      const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
      if (hours < 24) return `${hours}h overdue`;
      const days = Math.floor(hours / 24);
      return `${days}d overdue`;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h left`;
    const days = Math.floor(hours / 24);
    return `${days}d left`;
  };

  const handleToggleComplete = async () => {
    const newStatus = isCompleted ? 'pending' : 'completed';
    await updateTodo(todo.id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this todo?')) {
      setIsDeleting(true);
      try {
        await deleteTodo(todo.id);
      } catch (err) {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div 
      className={`todo-item ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="todo-checkbox">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggleComplete}
          id={`todo-${todo.id}`}
        />
        <label htmlFor={`todo-${todo.id}`} className="checkbox-label"></label>
      </div>

      <div className="todo-content">
        <div className="todo-header">
          <h4 className="todo-title">{todo.title}</h4>
          <span className={`priority-badge priority-${todo.priority}`}>
            {todo.priority}
          </span>
        </div>

        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}

        <div className="todo-meta">
          <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
            📅 {formatDate(todo.due_date)}
          </span>
          {!isCompleted && (
            <span className={`time-remaining ${isOverdue ? 'overdue' : ''}`}>
              ({getTimeRemaining()})
            </span>
          )}
          <span className={`status-badge status-${todo.status}`}>
            {todo.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className={`todo-actions ${showActions ? 'visible' : ''}`}>
        <button 
          className="btn-icon-action" 
          onClick={() => onEdit(todo)}
          title="Edit"
        >
          ✏️
        </button>
        <button 
          className="btn-icon-action delete" 
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

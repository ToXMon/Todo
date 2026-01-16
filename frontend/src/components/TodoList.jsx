import { useTodos } from '../context/TodoContext';
import TodoItem from './TodoItem';

export default function TodoList({ onEdit }) {
  const { filteredTodos, loading, error } = useTodos();

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📝</span>
        <h3>No todos yet</h3>
        <p>Add your first todo to get started!</p>
      </div>
    );
  }

  // Group todos by date/status
  const overdue = filteredTodos.filter(
    todo => new Date(todo.due_date) < new Date() && todo.status !== 'completed'
  );
  const upcoming = filteredTodos.filter(
    todo => new Date(todo.due_date) >= new Date() && todo.status !== 'completed'
  );
  const completed = filteredTodos.filter(todo => todo.status === 'completed');

  return (
    <div className="todo-list">
      {overdue.length > 0 && (
        <div className="todo-section">
          <h3 className="section-title overdue">
            <span>🚨</span> Overdue ({overdue.length})
          </h3>
          <div className="todo-items">
            {overdue.map(todo => (
              <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="todo-section">
          <h3 className="section-title upcoming">
            <span>📅</span> Upcoming ({upcoming.length})
          </h3>
          <div className="todo-items">
            {upcoming.map(todo => (
              <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div className="todo-section">
          <h3 className="section-title completed">
            <span>✅</span> Completed ({completed.length})
          </h3>
          <div className="todo-items">
            {completed.map(todo => (
              <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

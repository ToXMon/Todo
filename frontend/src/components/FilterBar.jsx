import { useTodos } from '../context/TodoContext';

export default function FilterBar() {
  const { filter, setFilter } = useTodos();

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={filter.status}
          onChange={(e) => setFilter({ status: e.target.value })}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="priority-filter">Priority</label>
        <select
          id="priority-filter"
          value={filter.priority}
          onChange={(e) => setFilter({ priority: e.target.value })}
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-filter">Sort By</label>
        <select
          id="sort-filter"
          value={filter.sortBy}
          onChange={(e) => setFilter({ sortBy: e.target.value })}
        >
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
          <option value="created_at">Created</option>
        </select>
      </div>
    </div>
  );
}

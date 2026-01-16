import { useState } from 'react';
import { useTodos } from './context/TodoContext';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';
import UserLogin from './components/UserLogin';

function App() {
  const { user } = useTodos();
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  if (!user) {
    return <UserLogin />;
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <div className="toolbar">
            <FilterBar />
            <button 
              className="btn btn-primary add-btn"
              onClick={() => setShowForm(true)}
            >
              <span className="btn-icon">+</span>
              <span className="btn-text">Add Todo</span>
            </button>
          </div>

          <TodoList onEdit={handleEdit} />
        </div>
      </main>

      {showForm && (
        <TodoForm 
          todo={editingTodo} 
          onClose={handleCloseForm} 
        />
      )}
    </div>
  );
}

export default App;

import { useTodos } from '../context/TodoContext';

export default function Header() {
  const { user, logout } = useTodos();

  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">
          <span className="logo-icon">📋</span>
          <h1 className="logo-text">Todo App</h1>
        </div>
        
        {user && (
          <div className="user-menu">
            <span className="user-email">{user.email}</span>
            <button className="btn btn-ghost" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

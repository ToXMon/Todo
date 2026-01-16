import { useState } from 'react';
import { useTodos } from '../context/TodoContext';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useTodos();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await login(email.trim(), name.trim());
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">📋</span>
          <h1>Todo App</h1>
          <p>Track your tasks and never miss a deadline</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoFocus
            />
            <span className="form-hint">We'll send deadline reminders to this email</span>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name (optional)</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Getting Started...' : 'Get Started'}
          </button>
        </form>

        <div className="login-features">
          <div className="feature">
            <span>✓</span> Create and manage tasks
          </div>
          <div className="feature">
            <span>✓</span> Set deadlines and priorities
          </div>
          <div className="feature">
            <span>✓</span> Email reminders for deadlines
          </div>
        </div>
      </div>
    </div>
  );
}

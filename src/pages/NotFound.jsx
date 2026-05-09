import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="page-header">
      <h1>404</h1>
      <p className="muted">Page not found.</p>
      <Link className="btn btn-primary" to="/dashboard">
        Go to Dashboard
      </Link>
    </section>
  );
}

export default NotFound;

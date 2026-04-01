import { useNavigate } from 'react-router-dom';

const adminNavigationItems = [
  { key: 'users', label: 'Users List', path: '/admin/users' },
  { key: 'ghost-lec', label: 'Ghost-Lec Requests', path: '/admin/ghost-lec' },
  { key: 'lost-found', label: 'Lost and Found', path: '/admin/lost-found' },
  { key: 'payments', label: 'Check Payments', path: '/admin/payments' },
];

function AdminDashHeader({ user }) {
  const navigate = useNavigate();

  return (
    <section className="admin-stats">
      {adminNavigationItems.map((item) => (
        <button
          key={item.key}
          type="button"
          className="admin-stat-card"
          onClick={() =>
            navigate(item.path, user ? { state: { user } } : undefined)
          }
        >
          <p>{item.label}</p>
        </button>
      ))}
    </section>
  );
}

export default AdminDashHeader;

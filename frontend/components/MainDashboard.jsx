import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from './Dashboard';
import { getUser, clearUser } from '../src/auth';

// ── Toggle role here to switch between views ───────────────────────────────
const MOCK_USER = {
  name:   'Alex Johnson',
  email:  'alex@university.edu',
  avatar: 'A',
  role:   'admin',   // 'student' | 'admin'
};
// ──────────────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'overview',  icon: '📊', label: 'System Overview'          },
  { id: 'users',     icon: '👥', label: 'User Management'          },
  { id: 'lostfound', icon: '🔍', label: 'Lost & Found Moderation'  },
  { id: 'logs',      icon: '📋', label: 'Transaction Logs'         },
];

// ── Panels ─────────────────────────────────────────────────────────────────

function OverviewPanel() {
  const stats = [
    { icon: '👥', label: 'Total Users',   value: '2,418', note: '+12 today',    up: true  },
    { icon: '📦', label: 'Open Reports',  value: '35',    note: '−4 resolved',  up: true  },
    { icon: '📚', label: 'Active Kuppis', value: '37',    note: '+5 new',       up: true  },
    { icon: '⚠️', label: 'Flagged Items', value: '6',     note: 'Needs review', up: false },
  ];

  const activity = [
    { type: 'user',  action: 'New user registered',      actor: 'saman.k@uni.edu',  time: '2m ago'  },
    { type: 'lost',  action: 'Lost item reported',        actor: 'dilini.s@uni.edu', time: '15m ago' },
    { type: 'kuppi', action: 'Kuppi session created',     actor: 'nimal.p@uni.edu',  time: '1h ago'  },
    { type: 'flag',  action: 'Item flagged for review',   actor: 'kasun.m@uni.edu',  time: '2h ago'  },
    { type: 'admin', action: 'User account deactivated',  actor: 'admin@uni.edu',    time: '5h ago'  },
  ];

  const typeIcon = { user: '👤', lost: '🔍', kuppi: '📚', flag: '⚠️', admin: '🛡️' };

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-6">System Overview</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className="text-2xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</div>
            <div className={`text-xs font-semibold mt-2 ${s.up ? 'text-emerald-500' : 'text-amber-500'}`}>{s.note}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-700">Recent Activity</div>
        <div className="divide-y divide-gray-50">
          {activity.map((row, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/40 transition-colors">
              <span className="text-xl w-7 text-center">{typeIcon[row.type]}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800">{row.action}</div>
                <div className="text-xs text-gray-400">{row.actor}</div>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">{row.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersPanel() {
  const users = [
    { name: 'Saman Kumara', email: 'saman.k@uni.edu',  role: 'student', status: 'active',   joined: 'Jan 12' },
    { name: 'Dilini Silva',  email: 'dilini.s@uni.edu', role: 'student', status: 'active',   joined: 'Jan 18' },
    { name: 'Nimal Perera',  email: 'nimal.p@uni.edu',  role: 'student', status: 'inactive', joined: 'Feb 2'  },
    { name: 'Kasun Mendis',  email: 'kasun.m@uni.edu',  role: 'student', status: 'active',   joined: 'Feb 10' },
    { name: 'Admin User',    email: 'admin@uni.edu',    role: 'admin',   status: 'active',   joined: 'Dec 1'  },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-900">User Management</h2>
        <button className="px-4 py-2 bg-gradient-to-r from-[#f97316] to-[#fdba74] text-white text-sm font-bold rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:-translate-y-0.5 transition-all border-none cursor-pointer">
          + Add User
        </button>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.email} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{u.name}</td>
                  <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-orange-100 text-[#f97316]' : 'bg-blue-50 text-blue-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">{u.joined}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <button className="px-3 py-1 text-xs font-bold text-[#f97316] border border-[#f97316]/30 rounded-lg hover:bg-[#fff7ed] transition-all cursor-pointer bg-transparent">Edit</button>
                      <button className="px-3 py-1 text-xs font-bold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-all cursor-pointer bg-transparent">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LostFoundPanel() {
  const items = [
    { id: 'LF-001', title: 'iPhone 14 Pro (Black)',     reporter: 'saman.k',  date: 'Feb 20', status: 'open',     flagged: false },
    { id: 'LF-002', title: '5-Star Notebook',            reporter: 'dilini.s', date: 'Feb 21', status: 'matched',  flagged: false },
    { id: 'LF-003', title: 'Blue JanSport Backpack',     reporter: 'nimal.p',  date: 'Feb 22', status: 'open',     flagged: true  },
    { id: 'LF-004', title: 'Set of Keys (3 keys)',       reporter: 'kasun.m',  date: 'Feb 23', status: 'resolved', flagged: false },
    { id: 'LF-005', title: 'Calculator (CASIO fx-991)',  reporter: 'unknown',  date: 'Feb 24', status: 'open',     flagged: true  },
  ];

  const statusStyle = {
    open:     'bg-blue-50 text-blue-600',
    matched:  'bg-amber-50 text-amber-600',
    resolved: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-900">Lost &amp; Found Moderation</h2>
        <div className="flex gap-2">
          {['All', 'Open', 'Flagged'].map(f => (
            <button key={f} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-500 hover:border-[#f97316] hover:text-[#f97316] transition-all bg-white cursor-pointer">{f}</button>
          ))}
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['ID', 'Item', 'Reporter', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(item => (
                <tr key={item.id} className={`hover:bg-gray-50/50 transition-colors ${item.flagged ? 'bg-red-50/30' : ''}`}>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{item.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{item.title}</span>
                      {item.flagged && (
                        <span className="text-[10px] font-bold bg-red-100 text-red-500 px-2 py-0.5 rounded-full">⚠️ Flagged</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{item.reporter}</td>
                  <td className="px-5 py-3.5 text-gray-400">{item.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle[item.status]}`}>{item.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <button className="px-3 py-1 text-xs font-bold text-[#f97316] border border-[#f97316]/30 rounded-lg hover:bg-[#fff7ed] transition-all cursor-pointer bg-transparent">Review</button>
                      {item.flagged && (
                        <button className="px-3 py-1 text-xs font-bold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-all cursor-pointer bg-transparent">Remove</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LogsPanel() {
  const logs = [
    { id: 'TXN-0041', event: 'User Login',            actor: 'saman.k@uni.edu',  ip: '192.168.1.5',  time: '2026-02-24 14:05', severity: 'info'     },
    { id: 'TXN-0040', event: 'Item Report Created',   actor: 'dilini.s@uni.edu', ip: '192.168.1.22', time: '2026-02-24 13:47', severity: 'info'     },
    { id: 'TXN-0039', event: 'Failed Login Attempt',  actor: 'unknown',          ip: '10.0.0.44',    time: '2026-02-24 12:30', severity: 'warn'     },
    { id: 'TXN-0038', event: 'Account Deactivated',   actor: 'admin@uni.edu',    ip: '192.168.1.1',  time: '2026-02-24 10:15', severity: 'critical' },
    { id: 'TXN-0037', event: 'Kuppi Session Opened',  actor: 'nimal.p@uni.edu',  ip: '192.168.1.8',  time: '2026-02-24 09:00', severity: 'info'     },
    { id: 'TXN-0036', event: 'Item Flagged',          actor: 'admin@uni.edu',    ip: '192.168.1.1',  time: '2026-02-23 18:40', severity: 'warn'     },
  ];

  const sevStyle = {
    info:     'bg-blue-50 text-blue-500',
    warn:     'bg-amber-50 text-amber-600',
    critical: 'bg-red-50 text-red-500',
  };

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-6">Transaction Logs</h2>
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['TX ID', 'Event', 'Actor', 'IP Address', 'Timestamp', 'Severity'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{log.id}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{log.event}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{log.actor}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{log.ip}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{log.time}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${sevStyle[log.severity]}`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Admin shell ─────────────────────────────────────────────────────────────

function AdminDashboard({ user, onLogout }) {
  const [active, setActive] = useState('overview');

  const panelMap = {
    overview:  <OverviewPanel />,
    users:     <UsersPanel />,
    lostfound: <LostFoundPanel />,
    logs:      <LogsPanel />,
  };

  return (
    <div className="min-h-screen bg-[#f6f5f3] font-sans flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">🎓</span>
            <span className="text-xl font-black bg-gradient-to-r from-[#f97316] to-[#fdba74] bg-clip-text text-transparent">
              UniConnect
            </span>
            <span className="text-xs font-bold bg-[#f97316]/10 text-[#f97316] px-2.5 py-1 rounded-full ml-1">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              Signed in as <span className="font-semibold text-gray-800">{user.name}</span>
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#f97316] to-[#fdba74] text-white text-sm font-bold rounded-full border-none cursor-pointer shadow-sm hover:-translate-y-px transition-all"
            >
              Sign Out →
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col py-6 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-7 mb-3">Navigation</p>

          <nav className="flex flex-col gap-1 px-4 flex-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all border-none cursor-pointer w-full ${
                  active === item.id
                    ? 'bg-gradient-to-r from-[#f97316] to-[#fdba74] text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)]'
                    : 'text-gray-500 bg-transparent hover:bg-[#fff7ed] hover:text-[#f97316]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sidebar user badge */}
          <div className="px-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[#f97316] to-[#fdba74] rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                {user.avatar}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-gray-800 truncate">{user.name}</div>
                <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8">
          {panelMap[active]}
        </main>
      </div>
    </div>
  );
}

// ── Role-based entry point ──────────────────────────────────────────────────

export default function MainDashboard({ role }) {
  const navigate = useNavigate();
  const onLogout = () => { clearUser(); navigate('/'); };

  // Use the real logged-in user (fallback to MOCK_USER for dev convenience)
  const authUser  = getUser() ?? MOCK_USER;
  const effectiveRole = role ?? authUser.role ?? MOCK_USER.role;

  if (effectiveRole === 'student') {
    return <StudentDashboard user={{ ...authUser, role: 'student' }} onLogout={onLogout} />;
  }

  return <AdminDashboard user={{ ...authUser, role: 'admin' }} onLogout={onLogout} />;
}

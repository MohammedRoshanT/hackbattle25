import React, { useEffect, useState } from 'react';
import { Shield, Users, Settings, Database, CheckCircle2, XCircle } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  admins: number;
  last7Days: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [tab, setTab] = useState<'submitted' | 'approved' | 'rejected'>('submitted');

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch('/api/admin/stats', { credentials: 'include' }),
          fetch('/api/admin/users', { credentials: 'include' })
        ]);
        if (!statsRes.ok || !usersRes.ok) {
          const err = (!statsRes.ok ? await statsRes.json() : await usersRes.json());
          throw new Error(err?.message || 'Failed to load admin data');
        }
        const statsJson = await statsRes.json();
        const usersJson = await usersRes.json();
        setStats(statsJson);
        setUsers(usersJson.users);
      } catch (e: any) {
        setError(e?.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/submissions?status=${tab}`, { credentials: 'include' });
        if (res.ok) {
          const json = await res.json();
          setSubmissions(json.submissions || []);
        }
      } catch {}
    })();
  }, [tab]);

  const handleVerify = async (id: string, approve: boolean) => {
    const dropsAward = approve ? (Number(prompt('Drops to award:', '50')) || 0) : 0;
    const res = await fetch(`/api/admin/submissions/${id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ approve, dropsAward })
    });
    if (res.ok) {
      // refresh list
      const list = await fetch(`/api/admin/submissions?status=${tab}`, { credentials: 'include' });
      if (list.ok) {
        const json = await list.json();
        setSubmissions(json.submissions || []);
      }
      alert(approve ? 'Submission approved' : 'Submission rejected');
    } else {
      alert('Failed to verify submission');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
          <Shield className="w-6 h-6 text-emerald-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-600">Manage users, content, and platform settings</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-600">Loading…</div>
      ) : (
        <>
          {/* Submissions moderation */}
          <div className="rounded-xl border bg-white mb-6">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Task Submissions</h2>
              <div className="space-x-2">
                {(['submitted','approved','rejected'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setTab(s)}
                    className={`px-3 py-1 rounded ${tab === s ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 overflow-x-auto">
              {submissions.length === 0 ? (
                <div className="text-sm text-gray-500">No submissions</div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="py-2 pr-6">User</th>
                      <th className="py-2 pr-6">Challenge</th>
                      <th className="py-2 pr-6">File</th>
                      <th className="py-2 pr-6">Status</th>
                      <th className="py-2 pr-6">Drops</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map(s => (
                      <tr key={s._id} className="border-t">
                        <td className="py-2 pr-6">{s.userName}</td>
                        <td className="py-2 pr-6">{s.challengeTitle || s.challengeId}</td>
                        <td className="py-2 pr-6">
                          {s.fileUrl ? (
                            <a href={s.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{s.filename || 'Open file'}</a>
                          ) : (
                            s.filename || '-'
                          )}
                        </td>
                        <td className="py-2 pr-6">{s.status}</td>
                        <td className="py-2 pr-6">{s.dropsAwarded || 0}</td>
                        <td className="py-2 space-x-2">
                          {tab === 'submitted' ? (
                            <>
                              <button onClick={() => handleVerify(s._id, true)} className="inline-flex items-center px-3 py-1 rounded bg-emerald-600 text-white"><CheckCircle2 className="w-4 h-4 mr-1"/>Approve</button>
                              <button onClick={() => handleVerify(s._id, false)} className="inline-flex items-center px-3 py-1 rounded bg-red-600 text-white"><XCircle className="w-4 h-4 mr-1"/>Reject</button>
                            </>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl border bg-white p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Users</div>
                  <div className="text-lg font-semibold">{stats?.totalUsers ?? 0}</div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Database className="w-6 h-6 text-purple-700" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Admins</div>
                  <div className="text-lg font-semibold">{stats?.admins ?? 0}</div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">New in 7 days</div>
                  <div className="text-lg font-semibold">{stats?.last7Days ?? 0}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Recent Users</h2>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-6">Name</th>
                    <th className="py-2 pr-6">Email</th>
                    <th className="py-2 pr-6">Role</th>
                    <th className="py-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-t">
                      <td className="py-2 pr-6">{u.name}</td>
                      <td className="py-2 pr-6">{u.email}</td>
                      <td className="py-2 pr-6"><span className={`px-2 py-1 rounded ${u.role === 'admin' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                      <td className="py-2">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;

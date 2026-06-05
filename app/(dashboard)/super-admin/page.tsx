'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Users, Mail, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Workspace {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    users: number;
    posts: number;
    socialAccounts: number;
  };
}

export default function SuperAdminPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  async function fetchWorkspaces() {
    try {
      const res = await fetch('/api/super-admin/workspaces');
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data.workspaces || []);
      }
    } catch {
      console.error('Failed to fetch workspaces');
    } finally {
      setLoading(false);
    }
  }

  async function createWorkspace(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !adminEmail.trim()) return;

    setAdding(true);
    try {
      const res = await fetch('/api/super-admin/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), adminEmail: adminEmail.trim().toLowerCase() }),
      });

      if (res.ok) {
        toast.success(`Workspace ${name} created`);
        setName('');
        setAdminEmail('');
        fetchWorkspaces();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to create workspace');
      }
    } catch {
      toast.error('Failed to create workspace');
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="max-w-[960px] mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-purple-600">Super Admin</h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">
          Manage tenants and workspaces.
        </p>
      </div>

      <div className="card-apple p-6 border-purple-100">
        <h2 className="text-[17px] font-semibold mb-1">Create New Client Workspace</h2>
        <p className="text-[13px] text-[var(--color-muted-foreground)] mb-4">
          Provision a new isolated workspace and assign an Admin email.
        </p>
        <form onSubmit={createWorkspace} className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Company Name"
              className="input-apple !pl-10"
              required
              disabled={adding}
            />
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@company.com"
              className="input-apple !pl-10"
              required
              disabled={adding}
            />
          </div>
          <button
            type="submit"
            disabled={adding || !name.trim() || !adminEmail.trim()}
            className="btn-primary bg-purple-600 hover:bg-purple-700 text-white inline-flex items-center gap-2 text-[14px] whitespace-nowrap"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Create Tenant
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-[17px] font-semibold mb-3">Workspaces</h2>
        <div className="card-apple overflow-hidden">
          {loading ? (
            <div className="p-6">Loading workspaces...</div>
          ) : workspaces.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No workspaces found</div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {workspaces.map((ws) => (
                <div key={ws.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-medium text-[15px]">{ws.name}</h3>
                    <p className="text-[12px] text-gray-500 mt-1">
                      Created {format(new Date(ws.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-4 text-[13px] text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {ws._count.users} Users
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" /> {ws._count.socialAccounts} Accounts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

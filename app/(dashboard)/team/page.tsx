'use client';

import { useState, useEffect } from 'react';
import {
  UserPlus,
  Trash2,
  Users,
  Mail,
  Loader2,
  Shield,
  Clock,
  Link2,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  invitedBy: { name: string | null; email: string };
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch {
      console.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  }

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setAdding(true);
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (res.ok) {
        toast.success(`Added ${email} to the team`);
        setEmail('');
        fetchMembers();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to add member');
      }
    } catch {
      toast.error('Failed to add member');
    } finally {
      setAdding(false);
    }
  }

  async function removeMember(id: string, memberEmail: string) {
    if (!confirm(`Remove ${memberEmail} from the team?`)) return;

    try {
      const res = await fetch(`/api/team?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(`Removed ${memberEmail}`);
        setMembers((prev) => prev.filter((m) => m.id !== id));
      } else {
        toast.error('Failed to remove member');
      }
    } catch {
      toast.error('Failed to remove member');
    }
  }

  async function updateMemberRole(id: string, newRole: string) {
    setUpdating(id);
    try {
      const res = await fetch('/api/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole }),
      });
      
      if (res.ok) {
        toast.success(`Role updated to ${newRole}`);
        setMembers((prev) =>
          prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
        );
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to update role');
      }
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdating(null);
    }
  }

  async function generateMagicLink(memberEmail: string) {
    setGenerating(memberEmail);
    try {
      const res = await fetch('/api/team/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: memberEmail }),
      });
      const data = await res.json();
      if (res.ok && data.link) {
        await navigator.clipboard.writeText(data.link);
        toast.success('Magic link copied to clipboard!');
      } else {
        toast.error(data.error || 'Failed to generate link');
      }
    } catch {
      toast.error('Failed to generate link');
    } finally {
      setGenerating(null);
    }
  }

  return (
    <div className="max-w-[720px] mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight">Team</h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">
          Manage who can access AutoReel Lite
        </p>
      </div>

      {/* Add Member */}
      <div className="card-apple p-6">
        <h2 className="text-[17px] font-semibold mb-1">Add team member</h2>
        <p className="text-[13px] text-[var(--color-muted-foreground)] mb-4">
          Add an email address to allow a new staff member to sign in.
        </p>
        <form onSubmit={addMember} className="flex gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="input-apple !pl-10"
              required
              disabled={adding}
            />
          </div>
          <button
            type="submit"
            disabled={adding || !email.trim()}
            className="btn-primary inline-flex items-center gap-2 text-[14px] whitespace-nowrap"
          >
            {adding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            Add Member
          </button>
        </form>
      </div>

      {/* Members List */}
      <div>
        <h2 className="text-[17px] font-semibold mb-3">Team members</h2>
        <div className="card-apple overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton w-40 h-4 rounded" />
                    <div className="skeleton w-24 h-3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-[var(--color-muted-foreground)] mx-auto mb-3 opacity-30" />
              <p className="text-[15px] font-medium">No team members yet</p>
              <p className="text-[13px] text-[var(--color-muted-foreground)] mt-1">
                Add email addresses above to invite your team
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {member.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-medium">{member.email}</p>
                        <select
                          value={member.role}
                          onChange={(e) => updateMemberRole(member.id, e.target.value)}
                          disabled={updating === member.id}
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full outline-none cursor-pointer border ${
                            member.role === 'ADMIN'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          } ${updating === member.id ? 'opacity-50' : ''}`}
                        >
                          <option value="STAFF">Staff</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                      <p className="text-[12px] text-[var(--color-muted-foreground)] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        Added {format(new Date(member.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => generateMagicLink(member.email)}
                      disabled={generating === member.email}
                      className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-[var(--color-muted-foreground)] hover:text-blue-600 flex items-center gap-1.5"
                      title="Generate and copy login link (Bypass Email)"
                    >
                      {generating === member.email ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Link2 className="w-4 h-4" />
                      )}
                      <span className="text-[12px] font-medium hidden sm:inline">Copy Link</span>
                    </button>

                    {member.role !== 'ADMIN' && (
                      <button
                        onClick={() => removeMember(member.id, member.email)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    )}
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

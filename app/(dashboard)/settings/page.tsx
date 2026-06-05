'use client';

import { useState, useEffect } from 'react';
import {
  Link2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Unplug,
  Film,
  Key,
  Eye,
  EyeOff,
  Save,
  Shield,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface SocialConnection {
  id: string;
  provider: string;
  accountName: string | null;
  pageId: string | null;
  instagramBusinessId: string | null;
  youtubeChannelId: string | null;
  expiresAt: string | null;
  connected: boolean;
}

const PROVIDERS = [
  {
    key: 'META',
    name: 'Meta (Facebook + Instagram)',
    description: 'Publish to Facebook Reels and Instagram Reels',
    icon: '📘',
    color: '#1877F2',
    connectUrl: '/api/social/meta',
    envKeys: ['META_APP_ID', 'META_APP_SECRET'],
  },
  {
    key: 'YOUTUBE',
    name: 'YouTube',
    description: 'Publish to YouTube Shorts',
    icon: '🔴',
    color: '#FF0000',
    connectUrl: '/api/social/google?scope=youtube',
    envKeys: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
  },
  {
    key: 'GOOGLE_DRIVE',
    name: 'Google Drive',
    description: 'Import videos directly from Google Drive',
    icon: '📁',
    color: '#4285F4',
    connectUrl: '/api/social/google?scope=drive',
    envKeys: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
  },
];

const API_FIELDS = [
  {
    group: 'Meta (Facebook & Instagram)',
    icon: '📘',
    color: '#1877F2',
    fields: [
      { key: 'META_APP_ID', label: 'App ID', placeholder: 'e.g. 1234567890123456', secret: false },
      { key: 'META_APP_SECRET', label: 'App Secret', placeholder: 'e.g. abcdef1234567890abcdef1234567890', secret: true },
    ],
  },
  {
    group: 'Google (YouTube & Drive)',
    icon: '🔴',
    color: '#4285F4',
    fields: [
      { key: 'GOOGLE_CLIENT_ID', label: 'Client ID', placeholder: 'e.g. 123456789-abc.apps.googleusercontent.com', secret: false },
      { key: 'GOOGLE_CLIENT_SECRET', label: 'Client Secret', placeholder: 'e.g. GOCSPX-xxxxxxxxxxxxxxxxxx', secret: true },
    ],
  },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [envStatus, setEnvStatus] = useState<Record<string, boolean>>({});

  // API Config state
  const [apiSettings, setApiSettings] = useState<Record<string, string>>({});
  const [apiLoading, setApiLoading] = useState(true);
  const [apiSaving, setApiSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchConnections();
    fetchApiSettings();
  }, []);

  async function fetchConnections() {
    try {
      const res = await fetch('/api/social/status');
      if (res.ok) {
        const data = await res.json();
        setConnections(data.connections || []);
        setEnvStatus(data.envStatus || {});
      }
    } catch {
      console.error('Failed to fetch connections');
    } finally {
      setLoading(false);
    }
  }

  async function fetchApiSettings() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setApiSettings(data.settings || {});
      }
    } catch {
      console.error('Failed to fetch settings');
    } finally {
      setApiLoading(false);
    }
  }

  async function saveApiSettings() {
    setApiSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: apiSettings }),
      });
      if (res.ok) {
        toast.success('API credentials saved successfully');
        // Refresh connection status after saving
        fetchConnections();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save settings');
      }
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setApiSaving(false);
    }
  }

  async function disconnect(provider: string) {
    if (!confirm(`Disconnect ${provider}? You will need to reconnect to publish.`)) return;
    try {
      const res = await fetch(`/api/social/disconnect?provider=${provider}`, { method: 'POST' });
      if (res.ok) {
        toast.success(`Disconnected ${provider}`);
        fetchConnections();
      }
    } catch {
      toast.error('Failed to disconnect');
    }
  }

  function handleConnect(url: string) {
    window.location.href = url;
  }

  function toggleSecret(key: string) {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleFieldChange(key: string, value: string) {
    setApiSettings((prev) => ({ ...prev, [key]: value }));
  }

  const hasAnyCredentials = Object.values(apiSettings).some((v) => v && v.length > 0);

  return (
    <div className="max-w-[720px] mx-auto space-y-10 animate-fade-in pb-8">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight">Settings</h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">
          Manage API credentials and social media connections
        </p>
      </div>

      {/* ─── API Configuration ─── */}
      {session?.user?.role === 'SUPER_ADMIN' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Key className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-[17px] font-semibold">System API Configuration</h2>
                <p className="text-[12px] text-[var(--color-muted-foreground)]">
                  Configure OAuth client credentials globally. Only Super Admin can view this.
                </p>
              </div>
            </div>
          </div>

        <div className="space-y-5">
          {API_FIELDS.map((group) => (
            <div key={group.group} className="card-apple p-5">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${group.color}14` }}
                >
                  {group.icon}
                </div>
                <h3 className="text-[15px] font-semibold">{group.group}</h3>
              </div>

              <div className="space-y-3">
                {group.fields.map((field) => (
                  <div key={field.key}>
                    <label
                      htmlFor={`api-${field.key}`}
                      className="block text-[13px] font-medium text-[var(--color-muted-foreground)] mb-1.5"
                    >
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        id={`api-${field.key}`}
                        type={field.secret && !showSecrets[field.key] ? 'password' : 'text'}
                        value={apiSettings[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2.5 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl text-[14px] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-mono"
                        style={{ paddingRight: field.secret ? '2.75rem' : '0.75rem' }}
                        disabled={apiLoading}
                        autoComplete="off"
                      />
                      {field.secret && (
                        <button
                          type="button"
                          onClick={() => toggleSecret(field.key)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-[var(--color-border)] transition-colors"
                          tabIndex={-1}
                        >
                          {showSecrets[field.key] ? (
                            <EyeOff className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                          ) : (
                            <Eye className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-[var(--color-muted-foreground)]">
              <Shield className="w-3.5 h-3.5" />
              <span>Credentials are stored securely in your database</span>
            </div>
            <button
              onClick={saveApiSettings}
              disabled={apiSaving || apiLoading}
              className="btn-primary text-[13px] py-2.5 px-5 inline-flex items-center gap-2"
            >
              {apiSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {apiSaving ? 'Saving...' : 'Save Credentials'}
            </button>
          </div>
        </div>
      </div>
      )}

      {/* ─── Divider ─── */}
      <div className="border-t border-[var(--color-border)]" />

      {/* ─── Social Connections ─── */}
      <div>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-[17px] font-semibold">Connected Accounts</h2>
            <p className="text-[12px] text-[var(--color-muted-foreground)]">
              Link your social accounts after configuring API credentials
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {PROVIDERS.map((provider) => {
            const connection = connections.find((c) => c.provider === provider.key);
            const isConnected = !!connection?.connected;
            const hasMissingEnv = provider.envKeys.some((key) => !envStatus[key]);
            const isExpired = connection?.expiresAt
              ? new Date(connection.expiresAt) < new Date()
              : false;

            return (
              <div key={provider.key} className="card-apple p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${provider.color}14` }}
                    >
                      {provider.icon}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold">{provider.name}</h3>
                      <p className="text-[13px] text-[var(--color-muted-foreground)] mt-0.5">
                        {provider.description}
                      </p>

                      {isConnected && (
                        <div className="mt-2 space-y-1">
                          {connection?.accountName && (
                            <p className="text-[13px] text-[var(--color-foreground)]">
                              <span className="text-[var(--color-muted-foreground)]">Account:</span>{' '}
                              {connection.accountName}
                            </p>
                          )}
                          {connection?.pageId && (
                            <p className="text-[12px] text-[var(--color-muted-foreground)]">
                              Page ID: {connection.pageId}
                            </p>
                          )}
                          {connection?.youtubeChannelId && (
                            <p className="text-[12px] text-[var(--color-muted-foreground)]">
                              Channel: {connection.youtubeChannelId}
                            </p>
                          )}
                          {isExpired && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                              <span className="text-[12px] text-amber-600 dark:text-amber-400 font-medium">
                                Token expired — please reconnect
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {hasMissingEnv && !isConnected && (
                        <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                          <p className="text-[12px] text-amber-700 dark:text-amber-400">
                            Configure API credentials above to enable connection
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isConnected ? (
                      <>
                        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Connected
                        </span>
                        <button
                          onClick={() => handleConnect(provider.connectUrl)}
                          className="p-2 rounded-lg hover:bg-[var(--color-muted)] transition-colors"
                          title="Reconnect"
                        >
                          <RefreshCw className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                        </button>
                        <button
                          onClick={() => disconnect(provider.key)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Disconnect"
                        >
                          <Unplug className="w-4 h-4 text-red-400" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnect(provider.connectUrl)}
                        disabled={hasMissingEnv}
                        className="btn-primary text-[13px] py-2 px-4 inline-flex items-center gap-1.5"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mock Mode Info */}
      {process.env.NEXT_PUBLIC_USE_MOCK_PUBLISHERS === 'true' && (
        <div className="card-apple p-5 border-dashed border-2 border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <Film className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
            <div>
              <h3 className="text-[14px] font-semibold text-amber-800 dark:text-amber-400">Mock Mode Active</h3>
              <p className="text-[13px] text-amber-700 dark:text-amber-500 mt-1">
                Publishing is simulated. Set <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900/50 rounded text-[12px]">USE_MOCK_PUBLISHERS=false</code> and configure real API credentials to publish to actual platforms.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

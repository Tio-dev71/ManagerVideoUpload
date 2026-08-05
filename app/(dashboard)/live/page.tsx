'use client';

import { useState, useEffect } from 'react';
import { Play, Activity } from 'lucide-react';
import Image from 'next/image';

interface FbAccount {
  id: string;
  name: string;
  uid: string | null;
}

export default function LiveDashboardPage() {
  const [activeProfileIds, setActiveProfileIds] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<Record<string, FbAccount>>({});
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    // Fetch accounts first to map profileIds to names
    fetch('/api/facebook-accounts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const accMap = data.reduce((acc, curr) => {
            acc[curr.profileId] = curr;
            return acc;
          }, {});
          setAccounts(accMap);
        }
      });
  }, []);

  useEffect(() => {
    // Poll for active profiles every 3 seconds
    const fetchActive = async () => {
      try {
        const res = await fetch('/api/dashboard/live');
        const data = await res.json();
        if (data.activeProfiles) {
          setActiveProfileIds(data.activeProfiles);
          setTimestamp(Date.now());
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchActive();
    const interval = setInterval(fetchActive, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-500 animate-pulse" />
            Live Dashboard
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Real-time preview of all running automation browsers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeProfileIds.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <Play className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">No active tasks</h3>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">Start an automation task to see live browser previews here.</p>
          </div>
        ) : (
          activeProfileIds.map(profileId => {
            const account = accounts[profileId];
            const name = account ? account.name : `Profile ${profileId.substring(0, 8)}`;
            
            return (
              <div key={profileId} className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
                <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
                    <span className="font-semibold text-sm truncate dark:text-white">{name}</span>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-1 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 rounded">
                    RUNNING
                  </span>
                </div>
                <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center">
                  {/* We use standard img with a cache-busting query parameter to force refresh */}
                  <img 
                    src={`/screenshots/${profileId}.jpg?t=${timestamp}`} 
                    alt={`Preview for ${name}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback if image load fails
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

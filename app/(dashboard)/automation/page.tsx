'use client';

import { useState, useEffect } from 'react';
import { Play, Plus, Trash2, Link as LinkIcon, Users, MessageCircle, FileText } from 'lucide-react';

interface AutomationTask {
  id: string;
  name: string;
  type: string;
  config: any;
  profileIds: string[];
  status: string;
  createdAt: string;
}

interface FbAccount {
  id: string;
  name: string;
  uid: string | null;
  status: string;
}

export default function AutomationScriptsPage() {
  const [tasks, setTasks] = useState<AutomationTask[]>([]);
  const [accounts, setAccounts] = useState<FbAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState('fb_auto_interact');
  const [targetUrl, setTargetUrl] = useState('');
  const [actionCount, setActionCount] = useState(5);
  const [commentsStr, setCommentsStr] = useState('');
  const [useAiComment, setUseAiComment] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTasks();
    fetchAccounts();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/automation-tasks');
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/facebook-accounts');
      const data = await res.json();
      if (Array.isArray(data)) setAccounts(data);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleAccount = (id: string) => {
    const newSet = new Set(selectedAccounts);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedAccounts(newSet);
  };

  const handleCreateTask = async () => {
    if (!taskName.trim()) {
      alert('Please enter a task name.');
      return;
    }
    if (selectedAccounts.size === 0) {
      alert('Please select at least one account.');
      return;
    }

    const config = {
      targetUrl: targetUrl.trim() || undefined,
      actionCount: Number(actionCount) || 5,
      useAiComment,
      comments: commentsStr ? commentsStr.split('\n').filter(c => c.trim()) : undefined
    };

    try {
      const res = await fetch('/api/automation-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: taskName,
          type: taskType,
          config,
          profileIds: Array.from(selectedAccounts)
        })
      });

      if (res.ok) {
        setShowModal(false);
        setTaskName('');
        setTargetUrl('');
        setCommentsStr('');
        setUseAiComment(false);
        setSelectedAccounts(new Set());
        fetchTasks();
      } else {
        alert('Failed to create task');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to create task');
    }
  };

  const handleStopTask = async (task: any) => {
    try {
      const res = await fetch('/api/automation/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id })
      });
      if (res.ok) {
        fetchTasks();
      } else {
        alert('Failed to stop task');
      }
    } catch (e) {
      console.error(e);
      alert('Error stopping task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`/api/automation-tasks/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartTask = async (task: AutomationTask) => {
    try {
      // Optistic status update locally
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'RUNNING' } : t));
      
      const res = await fetch('/api/automation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountIds: task.profileIds,
          config: { type: task.type, ...task.config },
          taskId: task.id
        })
      });

      if (res.ok) {
        fetchTasks();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'Failed to start task');
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
      alert('Error starting task');
      fetchTasks();
    }
  };

  const formatTaskType = (type: string) => {
    switch (type) {
      case 'fb_auto_interact': return 'Auto Interact (News Feed)';
      case 'fb_buff_post': return 'Buff Bài Viết';
      case 'fb_farm_reels': return 'Farm Reels (Fanpage / Feed)';
      case 'fb_add_friends_group': return 'Add Friends';
      case 'fb_invite_to_group': return 'Invite Group';
      default: return type;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Play className="w-6 h-6 text-[var(--color-primary)]" />
            Automation Scripts
          </h1>
          <p className="page-subtitle">Manage and run automated tasks across your profiles.</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 text-[14px]"
        >
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      <div className="card-apple overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] text-[var(--color-foreground)]">
            <thead className="bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 font-medium">Task Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Profiles</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No automation tasks found. Click "+ New Task" to create one.
                  </td>
                </tr>
              ) : (
                tasks.map(task => (
                  <tr key={task.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-neutral-200">
                      {task.name}
                    </td>
                    <td className="px-6 py-4">
                      {formatTaskType(task.type)}
                    </td>
                    <td className="px-6 py-4">
                      {task.profileIds?.length || 0} profiles
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        task.status === 'RUNNING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                        task.status === 'DONE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                        'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleStartTask(task)}
                          disabled={task.status === 'RUNNING'}
                          className="text-sm font-medium text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 disabled:opacity-50 transition-colors"
                        >
                          Start
                        </button>
                        {task.status === 'RUNNING' && (
                          <button 
                            onClick={() => handleStopTask(task)}
                            className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                          >
                            Stop
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-sm font-medium text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card-apple w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl scale-100">
            <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-muted)]">
              <h3 className="text-[16px] font-semibold text-[var(--color-foreground)]">Create New Automation Task</h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
              <div>
                <label className="block text-[12px] font-semibold mb-2 text-[var(--color-muted-foreground)] tracking-wider uppercase flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Task Name
                </label>
                <input
                  type="text"
                  value={taskName}
                  onChange={e => setTaskName(e.target.value)}
                  placeholder="e.g. Test, Farm Reel Morning..."
                  className="input-apple w-full"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold mb-2 text-[var(--color-muted-foreground)] tracking-wider uppercase">Task Type</label>
                <select
                  value={taskType}
                  onChange={e => setTaskType(e.target.value)}
                  className="input-apple w-full cursor-pointer"
                >
                  <option value="fb_auto_interact">Auto Interact (News Feed)</option>
                  <option value="fb_buff_post">Buff Bài Viết (Like & Comment 1 Link)</option>
                  <option value="fb_farm_reels">Farm Reels (Fanpage / Feed)</option>
                  <option value="fb_add_friends_group">Auto Kết Bạn (Thành viên nhóm)</option>
                  <option value="fb_invite_to_group">Auto Mời Bạn Bè (Vào nhóm mình)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[12px] font-semibold mb-2 text-[var(--color-muted-foreground)] tracking-wider uppercase flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5" /> {taskType === 'fb_buff_post' ? 'Link Bài Viết (Post URL)' : 'Target URL (Fanpage, Group... Leave empty for generic feed)'}
                  </label>
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={e => setTargetUrl(e.target.value)}
                    placeholder="https://www.facebook.com/groups/..."
                    className="input-apple w-full"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] font-semibold mb-2 text-[var(--color-muted-foreground)] tracking-wider uppercase flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> Action Count
                  </label>
                  <input
                    type="number"
                    value={actionCount}
                    onChange={e => setActionCount(parseInt(e.target.value))}
                    className="input-apple w-full"
                  />
                </div>
              </div>

              {(taskType === 'fb_auto_interact' || taskType === 'fb_farm_reels' || taskType === 'fb_buff_post') && (
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-[var(--color-primary)] border-opacity-30 rounded-xl bg-[var(--color-primary-soft)] hover:border-opacity-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={useAiComment} 
                      onChange={e => setUseAiComment(e.target.checked)} 
                      className="w-5 h-5 text-[var(--color-primary)] rounded border-neutral-300 focus:ring-[var(--color-primary)]"
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[var(--color-primary)]">Tự động bình luận thông minh bằng AI (Gemini)</span>
                      <span className="text-[12px] text-[var(--color-muted-foreground)] mt-0.5">Sử dụng AI đọc bài viết và tự sinh bình luận tự nhiên theo ngữ cảnh (Cần cấu hình DEEPSEEK_API_KEY hoặc GEMINI_API_KEY trong DB)</span>
                    </div>
                  </label>

                  {!useAiComment && (
                    <div>
                      <label className="block text-[12px] font-semibold mb-2 text-[var(--color-muted-foreground)] tracking-wider uppercase flex items-center gap-2">
                        <MessageCircle className="w-3.5 h-3.5" /> Hoặc Bình Luận Theo Mẫu Nhập Sẵn (Mỗi câu 1 dòng)
                      </label>
                      <textarea
                        value={commentsStr}
                        onChange={e => setCommentsStr(e.target.value)}
                        placeholder="Thật tuyệt vời!&#10;Hay quá bạn ơi&#10;Quá đỉnh"
                        className="input-apple w-full h-24 resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-[12px] font-semibold mb-2 text-[var(--color-muted-foreground)] tracking-wider uppercase">Select Profiles to Run</label>
                <div className="bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl p-2 max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                  {accounts.length === 0 ? (
                    <div className="p-2 text-[13px] text-[var(--color-muted-foreground)] text-center">No profiles available.</div>
                  ) : (
                    accounts.map(acc => (
                      <label key={acc.id} className="flex items-center gap-3 p-2.5 hover:bg-[var(--color-card)] rounded-lg cursor-pointer transition-colors border border-transparent hover:border-[var(--color-border)]">
                        <input
                          type="checkbox"
                          checked={selectedAccounts.has(acc.id)}
                          onChange={() => toggleAccount(acc.id)}
                          className="w-4 h-4 text-[var(--color-primary)] rounded border-[var(--color-border)] focus:ring-[var(--color-primary)]"
                        />
                        <span className="text-[13px] font-medium text-[var(--color-foreground)]">{acc.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[var(--color-border)] flex justify-end gap-3 bg-[var(--color-muted)]">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="btn-primary"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

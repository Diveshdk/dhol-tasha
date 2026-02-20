'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, RefreshCw, BarChart3, Lock, Unlock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useAdmin } from '@/hooks/use-admin';
import { AdminPasswordDialog } from '@/components/admin-password-dialog';

interface UsageLog {
  id: string;
  date: string;
  name: string;
  items: Record<string, number>;
  created_at: string;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: 'godown' | 'ready';
}

export default function UsagePage() {
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    selectedItems: {} as Record<string, number>,
  });
  const { isAdmin, showPasswordDialog, setShowPasswordDialog, checkPassword, logout } = useAdmin();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch logs
      const { data: logsData, error: logsError } = await supabase
        .from('usage_logs')
        .select('*')
        .order('date', { ascending: false });

      if (logsError) throw logsError;
      setLogs(logsData || []);

      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name');

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || Object.keys(formData.selectedItems).length === 0) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const { error: insertError } = await supabase.from('usage_logs').insert({
        date: formData.date,
        name: formData.name,
        items: formData.selectedItems,
      });

      if (insertError) throw insertError;

      setFormData({
        date: new Date().toISOString().split('T')[0],
        name: '',
        selectedItems: {},
      });
      setShowForm(false);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create log');
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('usage_logs')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete log');
    }
  };

  const toggleItem = (itemName: string) => {
    setFormData(prev => {
      const newItems = { ...prev.selectedItems };
      if (newItems[itemName]) {
        delete newItems[itemName];
      } else {
        newItems[itemName] = 1;
      }
      return { ...prev, selectedItems: newItems };
    });
  };

  const updateItemQuantity = (itemName: string, delta: number) => {
    setFormData(prev => {
      const newItems = { ...prev.selectedItems };
      const current = newItems[itemName] || 0;
      const newValue = current + delta;
      if (newValue > 0) {
        newItems[itemName] = newValue;
      }
      return { ...prev, selectedItems: newItems };
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <AdminPasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSubmit={checkPassword}
      />
      
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center justify-center rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-6 w-6 text-foreground" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Usage Tracking</h1>
              <p className="mt-1 text-sm text-muted-foreground">Log items used for events</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {isAdmin ? (
                <>
                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                    <Unlock className="h-4 w-4 text-green-500" />
                    Admin Mode
                  </span>
                  <button
                    onClick={logout}
                    className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-secondary"
                  >
                    Lock
                  </button>
                </>
              ) : (
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  View Only
                </span>
              )}
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            disabled={!isAdmin}
            className="mb-6 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            New Usage Log
          </button>
        )}

        {showForm && (
          <div className="mb-8 rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Create New Usage Log</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Event Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Wedding, Festival"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Items Used</label>
                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-3">
                      <input
                        type="checkbox"
                        checked={!!formData.selectedItems[item.name]}
                        onChange={() => toggleItem(item.name)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="flex-1 text-sm text-foreground">{item.name}</span>
                      {formData.selectedItems[item.name] && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(item.name, -1)}
                            className="flex h-6 w-6 items-center justify-center rounded bg-background text-foreground hover:bg-background/80"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-foreground">
                            {formData.selectedItems[item.name]}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(item.name, 1)}
                            className="flex h-6 w-6 items-center justify-center rounded bg-background text-foreground hover:bg-background/80"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Save Log
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading logs...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{logs.length} usage logs recorded</p>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {logs.map(log => (
                <div
                  key={log.id}
                  className="flex items-start justify-between rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{log.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(log.date).toLocaleDateString()}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(log.items).map(([itemName, quantity]) => (
                        <span key={itemName} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {itemName} <span className="font-bold">×{quantity}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteLog(log.id)}
                    disabled={!isAdmin}
                    className="ml-4 flex items-center justify-center rounded-lg hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </button>
                </div>
              ))}
            </div>

            {logs.length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">No usage logs yet. Create your first log to get started.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: 'godown' | 'ready';
  created_at: string;
  updated_at: string;
}

export default function GodownPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('category', 'godown')
        .order('name');

      if (fetchError) throw fetchError;
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    try {
      setUpdating(id);
      const item = items.find(i => i.id === id);
      if (!item) return;

      const newQuantity = Math.max(0, item.quantity + delta);

      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      setItems(items.map(i => 
        i.id === id ? { ...i, quantity: newQuantity } : i
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center justify-center rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-6 w-6 text-foreground" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Godown Stock</h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage storage inventory</p>
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading inventory...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{items.length} items in stock</p>
              <button
                onClick={fetchItems}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            <div className="grid gap-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Last updated: {new Date(item.updated_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={updating === item.id || item.quantity === 0}
                        className="flex h-8 w-8 items-center justify-center rounded hover:bg-primary/10 disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4 text-foreground" />
                      </button>
                      <span className="w-12 text-center text-lg font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={updating === item.id}
                        className="flex h-8 w-8 items-center justify-center rounded hover:bg-primary/10 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4 text-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {items.length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">No items in godown stock</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

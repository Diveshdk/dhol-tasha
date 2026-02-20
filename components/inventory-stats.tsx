'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AlertCircle } from 'lucide-react';

interface Stat {
  category: 'godown' | 'ready';
  total: number;
  items: number;
}

export function InventoryStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await supabase
          .from('inventory_items')
          .select('category, quantity');

        if (data) {
          const grouped = data.reduce((acc, item) => {
            const existing = acc.find(s => s.category === item.category);
            if (existing) {
              existing.total += item.quantity;
              existing.items += 1;
            } else {
              acc.push({
                category: item.category,
                total: item.quantity,
                items: 1,
              });
            }
            return acc;
          }, [] as Stat[]);
          setStats(grouped);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stats.map(stat => (
        <div key={stat.category} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground capitalize">
                {stat.category === 'godown' ? 'Godown Stock' : 'Ready to Use'}
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stat.total}</p>
              <p className="text-xs text-muted-foreground">{stat.items} item types</p>
            </div>
            {stat.category === 'ready' && stat.total < 5 && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <AlertCircle className="h-5 w-5 text-accent" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

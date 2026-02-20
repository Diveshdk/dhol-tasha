import { useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface UsageLog {
  id: string;
  date: string;
  name: string;
  items: Record<string, number>;
  created_at: string;
}

export function useUsageLogs() {
  const createLog = useCallback(async (date: string, name: string, items: Record<string, number>) => {
    const { error } = await supabase.from('usage_logs').insert({
      date,
      name,
      items,
    });
    
    if (error) throw error;
  }, []);

  const fetchLogs = useCallback(async (startDate?: string, endDate?: string) => {
    let query = supabase.from('usage_logs').select('*');
    
    if (startDate) {
      query = query.gte('date', startDate);
    }
    
    if (endDate) {
      query = query.lte('date', endDate);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    if (error) throw error;
    return data as UsageLog[];
  }, []);

  const deleteLog = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('usage_logs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }, []);

  return { createLog, fetchLogs, deleteLog };
}

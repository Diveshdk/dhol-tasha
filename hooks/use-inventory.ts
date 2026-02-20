import { useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: 'godown' | 'ready';
  created_at: string;
  updated_at: string;
}

export function useInventory() {
  const fetchItems = useCallback(async (category?: 'godown' | 'ready') => {
    let query = supabase.from('inventory_items').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('name');
    if (error) throw error;
    return data as InventoryItem[];
  }, []);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    const { error } = await supabase
      .from('inventory_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  }, []);

  const getItem = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as InventoryItem;
  }, []);

  return { fetchItems, updateQuantity, getItem };
}

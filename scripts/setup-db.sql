-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  quantity INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('godown', 'ready')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create usage_logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_usage_logs_date ON usage_logs(date);

-- Insert godown stock items
INSERT INTO inventory_items (name, quantity, category) VALUES
  ('21 dhol pan', 5, 'godown'),
  ('23 dhol pan', 5, 'godown'),
  ('25 dhol pan', 5, 'godown'),
  ('27 dhol pan', 5, 'godown'),
  ('30 dhol pan', 5, 'godown'),
  ('Dhol hook', 10, 'godown'),
  ('12 chavi-paan 13*4', 8, 'godown'),
  ('10 chavi-paan 12*4', 6, 'godown'),
  ('Chakot 12*2', 4, 'godown'),
  ('Tasha sticks', 12, 'godown'),
  ('Tasha key', 8, 'godown'),
  ('Tipru', 6, 'godown'),
  ('Rassi', 20, 'godown'),
  ('Tol', 15, 'godown'),
  ('Hammer', 3, 'godown'),
  ('Shaii', 5, 'godown'),
  ('Oil', 10, 'godown'),
  ('Zalar', 8, 'godown'),
  ('Dhwaj rod', 4, 'godown'),
  ('Dhwaj vastra', 3, 'godown'),
  ('Dhwaj kalash', 2, 'godown')
ON CONFLICT (name) DO NOTHING;

-- Insert ready to use items
INSERT INTO inventory_items (name, quantity, category) VALUES
  ('18 dhol', 2, 'ready'),
  ('21 dhol', 3, 'ready'),
  ('23 dhol', 2, 'ready'),
  ('25 dhol', 2, 'ready'),
  ('27 dhol', 1, 'ready'),
  ('30 dhol', 1, 'ready'),
  ('Tasha', 5, 'ready'),
  ('Dhwaj', 2, 'ready'),
  ('Tol', 3, 'ready'),
  ('Zalar', 2, 'ready')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security (optional, can be set per table)
-- ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

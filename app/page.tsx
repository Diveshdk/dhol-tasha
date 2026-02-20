'use client';

import Link from 'next/link';
import { Music, BarChart3, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dhol Tasha Inventory</h1>
              <p className="mt-1 text-sm text-muted-foreground">Professional inventory management system</p>
            </div>
            <div className="text-4xl">🥁</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Godown Stock Card */}
          <Link href="/godown" className="group">
            <div className="flex h-full flex-col rounded-lg border border-border bg-card p-8 transition-all hover:border-primary hover:bg-card/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Godown Stock</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                Manage your storage inventory including dhols, tashas, and components
              </p>
              <div className="mt-4 flex items-center text-primary">
                <span className="text-sm font-medium">View Inventory</span>
                <span className="ml-2">→</span>
              </div>
            </div>
          </Link>

          {/* Usage Tracking Card */}
          <Link href="/usage" className="group">
            <div className="flex h-full flex-col rounded-lg border border-border bg-card p-8 transition-all hover:border-primary hover:bg-card/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Usage Tracking</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                Log usage for events and programs
              </p>
              <div className="mt-4 flex items-center text-primary">
                <span className="text-sm font-medium">Track Usage</span>
                <span className="ml-2">→</span>
              </div>
            </div>
          </Link>

          {/* Ready to Use Card */}
          <Link href="/ready" className="group">
            <div className="flex h-full flex-col rounded-lg border border-border bg-card p-8 transition-all hover:border-primary hover:bg-card/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Ready to Use</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                Track instruments ready for immediate use
              </p>
              <div className="mt-4 flex items-center text-primary">
                <span className="text-sm font-medium">View Ready Items</span>
                <span className="ml-2">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 rounded-lg border border-border bg-card p-8">
          <h3 className="text-lg font-semibold text-foreground">About This System</h3>
          <p className="mt-4 text-sm text-muted-foreground">
            This inventory management system helps you track and manage your Dhol Tasha instruments efficiently. 
            Keep track of items in storage, log usage for events, and monitor your ready-to-use inventory.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-primary/5 p-4">
              <p className="text-xs font-medium text-muted-foreground">Godown Items</p>
              <p className="mt-1 text-2xl font-bold text-foreground">21</p>
            </div>
            <div className="rounded-lg bg-primary/5 p-4">
              <p className="text-xs font-medium text-muted-foreground">Ready Items</p>
              <p className="mt-1 text-2xl font-bold text-foreground">10</p>
            </div>
            <div className="rounded-lg bg-primary/5 p-4">
              <p className="text-xs font-medium text-muted-foreground">Total SKUs</p>
              <p className="mt-1 text-2xl font-bold text-foreground">31</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

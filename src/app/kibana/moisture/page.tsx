import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity } from 'lucide-react';

export default function MoisturePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-mono">
      <Link href="/kibana/" className="inline-flex items-center space-x-2 text-xs text-[var(--neon-accent)] mb-6 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>All Dashboards</span>
      </Link>
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="w-6 h-6 text-[var(--neon-accent)]" />
        <h1 className="text-2xl font-bold text-white">pyMoisture Telemetry</h1>
      </div>
      <div className="p-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-center">
        <p className="text-sm text-[var(--text-muted)] font-sans">
          Historical Monitaur moisture sensor dashboard. External embed source: <code>greenwyvern.monitaur.net:5601</code>.
        </p>
      </div>
    </div>
  );
}

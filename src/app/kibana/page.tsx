import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Activity, Droplets, Thermometer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Monitaur Kibana Dashboards',
  description: 'Monitaur monitoring metrics and environmental dashboards.',
};

export default function KibanaPage() {
  const monitors = [
    { title: 'Humidity Monitor', href: '/kibana/humidity/', icon: Droplets, desc: 'pyHumidity sensor metric telemetry' },
    { title: 'Moisture Monitor', href: '/kibana/moisture/', icon: Activity, desc: 'Soil moisture reading visualizations' },
    { title: 'Temperature Monitor', href: '/kibana/temperature/', icon: Thermometer, desc: 'Ambient and sensor temperature trends' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-mono">
      <h1 className="text-3xl font-bold text-white mb-2">Monitaur Kibana Dashboard</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8 font-sans">
        Environmental metrics and telemetry dashboards.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {monitors.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className="p-6 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--neon-accent)] transition-colors group"
            >
              <Icon className="w-8 h-8 text-[var(--neon-accent)] mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-lg font-bold text-white group-hover:text-[var(--neon-accent)] mb-2">
                {m.title}
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-sans">
                {m.desc}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

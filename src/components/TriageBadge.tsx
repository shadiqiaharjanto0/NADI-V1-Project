import React from 'react';
import { TriageUrgency } from '../types';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface TriageBadgeProps {
  level: TriageUrgency;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export const TriageBadge: React.FC<TriageBadgeProps> = ({
  level,
  size = 'md',
  showDescription = false,
}) => {
  const configs = {
    HIJAU: {
      border: 'border-zinc-200 bg-zinc-50 text-zinc-800',
      dotColor: 'bg-emerald-500',
      icon: CheckCircle2,
      label: 'Level 1: Hijau',
      sub: 'Observasi Mandiri di Asrama (Keluhan Ringan)',
    },
    KUNING: {
      border: 'border-zinc-300 bg-zinc-50 text-zinc-900',
      dotColor: 'bg-amber-500',
      icon: AlertTriangle,
      label: 'Level 2: Kuning',
      sub: 'Perlu Penilaian Petugas UKS Hari Ini',
    },
    MERAH: {
      border: 'border-red-200 bg-red-50 text-red-700',
      dotColor: 'bg-red-600',
      icon: AlertOctagon,
      label: 'Level 3: Merah',
      sub: 'Gawat Darurat Medis: Hubungi 119 / Dampingi Segera',
    },
  };

  const c = configs[level] || configs.KUNING;
  const Icon = c.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-semibold',
  };

  if (!showDescription) {
    return (
      <span
        className={`inline-flex items-center rounded-md border font-medium ${c.border} ${sizeClasses[size]}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${c.dotColor}`}></span>
        <span>{c.label}</span>
      </span>
    );
  }

  return (
    <div className={`p-3.5 rounded-xl border ${c.border} space-y-1`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${c.dotColor}`}></span>
          {c.label}
        </span>
        <Icon className="w-4 h-4 shrink-0 text-current" />
      </div>
      <p className="text-xs text-zinc-600 leading-relaxed">{c.sub}</p>
    </div>
  );
};

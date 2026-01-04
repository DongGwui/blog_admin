'use client';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'indigo' | 'emerald' | 'purple' | 'amber' | 'pink' | 'cyan';
}

const colorConfig = {
  indigo: {
    gradient: 'from-indigo-500 to-purple-500',
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-500',
    lightBg: 'rgba(99, 102, 241, 0.05)',
  },
  emerald: {
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    lightBg: 'rgba(16, 185, 129, 0.05)',
  },
  purple: {
    gradient: 'from-purple-500 to-pink-500',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
    lightBg: 'rgba(168, 85, 247, 0.05)',
  },
  amber: {
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    lightBg: 'rgba(245, 158, 11, 0.05)',
  },
  pink: {
    gradient: 'from-pink-500 to-rose-500',
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    lightBg: 'rgba(236, 72, 153, 0.05)',
  },
  cyan: {
    gradient: 'from-cyan-500 to-blue-500',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500',
    lightBg: 'rgba(6, 182, 212, 0.05)',
  },
};

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  color = 'indigo',
}: StatsCardProps) {
  const config = colorConfig[color];

  return (
    <div
      className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-default h-full"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        minHeight: '160px',
      }}
    >
      {/* Gradient accent line at top */}
      <div
        className={`absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r ${config.gradient} opacity-80`}
      />

      {/* Content */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          {/* Title */}
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            {title}
          </p>

          {/* Value */}
          <p
            className="text-4xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {value}
          </p>

          {/* Description */}
          {description && (
            <p
              className="text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {description}
            </p>
          )}

          {/* Trend */}
          {trend && (
            <div
              className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                trend.isPositive
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'bg-red-500/10 text-red-600'
              }`}
            >
              {trend.isPositive ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              {trend.value}%
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="relative">
          {/* Glow effect on hover */}
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}
          />
          <div
            className={`relative w-14 h-14 rounded-2xl flex items-center justify-center ${config.iconBg} ${config.iconColor} transition-transform duration-300 group-hover:scale-110`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

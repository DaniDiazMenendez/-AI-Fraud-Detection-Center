import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  color?: 'blue' | 'red' | 'green' | 'orange';
  animated?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtext,
  icon,
  trend,
  color = 'blue',
  animated = false,
}) => {
  const colorClasses = {
    blue: 'border-ms-blue text-ms-blue',
    red: 'border-fraud-red text-fraud-red',
    green: 'border-safe-green text-safe-green',
    orange: 'border-warning-orange text-warning-orange',
  };

  return (
    <div
      className={`relative bg-dark-card border-l-4 p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-ms-blue/20 ${
        colorClasses[color]
      } ${animated ? 'animate-slideIn' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
          {subtext && <p className="mt-2 text-xs text-gray-500">{subtext}</p>}
        </div>
        <div className="text-4xl opacity-20">{icon}</div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1 text-xs font-semibold">
          {trend === 'up' && <span className="text-fraud-red">↑ Incrementando</span>}
          {trend === 'down' && <span className="text-safe-green">↓ Disminuyendo</span>}
          {trend === 'stable' && <span className="text-gray-400">→ Estable</span>}
        </div>
      )}
    </div>
  );
};

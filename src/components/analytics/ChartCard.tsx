import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 ${className}`}>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
};

import React from 'react';

type DashboardMetricProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description: string;
  metric: string;
  icon: React.ReactNode;
};

function DashboardMetric({
  title,
  description,
  metric,
  icon,
  className,
  ...rest
}: DashboardMetricProps) {
  return (
    <div
      className={`border-muted col-span-3 grid aspect-[4/2] flex-grow grid-cols-4 items-center gap-8 rounded-lg border p-8 ${className}`}
      {...rest}
    >
      <div className="bg-muted flex aspect-square w-full items-center justify-center rounded-full">
        {icon}
      </div>
      <div className="col-span-3">
        <p className="mb-2 text-5xl font-semibold">{metric}</p>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}

export default DashboardMetric;

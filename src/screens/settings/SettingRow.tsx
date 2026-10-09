import type { ReactNode } from "react";

interface SettingRowProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function SettingRow({ title, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
      <div className="flex min-w-0 flex-col gap-0.5">
        <h3 className="text-sm font-semibold text-primary-foreground">{title}</h3>
        {description && <p className="text-sm">{description}</p>}
      </div>
      {children}
    </div>
  );
}

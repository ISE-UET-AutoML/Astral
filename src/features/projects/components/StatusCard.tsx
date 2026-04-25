import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type StatusCardProps = {
  label: string;
  value: ReactNode;
  Icon: LucideIcon;
  color?: {
    bg: string;
    border: string;
    text: string;
  };
};

const StatusCard = ({ label, value, Icon }: StatusCardProps) => (
  <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] border-opacity-20 [background:linear-gradient(135deg,var(--hover-bg)_0%,rgba(255,255,255,0.02)_100%)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-opacity-40 hover:shadow-xl">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    <div className="relative flex items-center space-x-3 p-4 lg:p-5">
      <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-white/10 to-white/5 p-2.5 backdrop-blur-sm">
        <Icon className="text-xl text-[var(--accent-text)] transition-transform duration-300 group-hover:scale-110" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium text-[var(--secondary-text)] lg:text-sm">
          {label}
        </p>
        <p className="text-xl font-bold tracking-tight text-[var(--text)] lg:text-2xl">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default StatusCard;

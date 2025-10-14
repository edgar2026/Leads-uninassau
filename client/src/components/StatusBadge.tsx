import { Badge } from "@/components/ui/badge";

export type LeadStatus = "quente" | "morno" | "frio" | "perdido" | "matriculado";

interface StatusBadgeProps {
  status: LeadStatus;
}

const statusConfig = {
  quente: {
    label: "🔥 Quente",
    className: "bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-300",
  },
  morno: {
    label: "🟡 Morno",
    className: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-300",
  },
  frio: {
    label: "🧊 Frio",
    className: "bg-cyan-100 text-cyan-900 dark:bg-cyan-900/20 dark:text-cyan-300",
  },
  perdido: {
    label: "Perdido",
    className: "bg-muted text-muted-foreground",
  },
  matriculado: {
    label: "Matriculado",
    className: "bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-300",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge className={config.className} data-testid={`badge-status-${status}`}>
      {config.label}
    </Badge>
  );
}

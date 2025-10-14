import { Badge } from "@/components/ui/badge";

export type LeadStage = "contato" | "interesse" | "prova" | "matricula";

interface StageBadgeProps {
  stage: LeadStage;
}

const stageConfig = {
  contato: {
    label: "Contato",
    className: "border-chart-1 text-chart-1",
  },
  interesse: {
    label: "Interesse",
    className: "border-chart-2 text-chart-2",
  },
  prova: {
    label: "Prova",
    className: "border-chart-4 text-chart-4",
  },
  matricula: {
    label: "Matrícula",
    className: "border-chart-3 text-chart-3",
  },
};

export function StageBadge({ stage }: StageBadgeProps) {
  const config = stageConfig[stage];

  return (
    <Badge variant="outline" className={config.className} data-testid={`badge-stage-${stage}`}>
      {config.label}
    </Badge>
  );
}

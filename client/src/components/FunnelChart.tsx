import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FunnelStage {
  name: string;
  value: number;
  percentage: number;
}

interface FunnelChartProps {
  data: FunnelStage[];
}

export function FunnelChart({ data }: FunnelChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card data-testid="card-funnel">
      <CardHeader>
        <CardTitle>Funil de Conversão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((stage, index) => {
          const widthPercentage = (stage.value / maxValue) * 100;
          const colors = ["bg-chart-1", "bg-chart-2", "bg-chart-4", "bg-chart-3"];

          return (
            <div key={stage.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.name}</span>
                <span className="text-muted-foreground">
                  {stage.value} ({stage.percentage}%)
                </span>
              </div>
              <div className="relative h-12 bg-muted rounded-md overflow-hidden">
                <div
                  className={`h-full ${colors[index % colors.length]} flex items-center justify-center text-white font-semibold transition-all duration-500`}
                  style={{ width: `${widthPercentage}%` }}
                >
                  {widthPercentage > 20 && `${stage.percentage}%`}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

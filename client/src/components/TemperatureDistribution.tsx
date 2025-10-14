import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface TemperatureData {
  name: string;
  value: number;
  emoji: string;
}

interface TemperatureDistributionProps {
  data: TemperatureData[];
}

const COLORS = {
  Quente: "hsl(0 84% 60%)",
  Morno: "hsl(43 96% 56%)",
  Frio: "hsl(199 89% 48%)",
};

export function TemperatureDistribution({ data }: TemperatureDistributionProps) {
  return (
    <Card data-testid="card-temperature">
      <CardHeader>
        <CardTitle>Distribuição por Temperatura</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {data.map((item) => (
            <div key={item.name} className="text-center">
              <div className="text-3xl mb-1">{item.emoji}</div>
              <p className="font-semibold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

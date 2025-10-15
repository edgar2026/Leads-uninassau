import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

export interface Consultor {
  id: string;
  nome: string;
  totalLeads: number;
  conversoes: number;
  taxaConversao: number;
}

interface RankingTableProps {
  consultores: Consultor[];
}

export function RankingTable({ consultores }: RankingTableProps) {
  const sortedConsultores = [...consultores].sort((a, b) => b.taxaConversao - a.taxaConversao);

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  return (
    <Card data-testid="card-ranking">
      <CardHeader>
        <CardTitle>Ranking de Consultores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedConsultores.map((consultor, index) => (
            <div
              key={consultor.id}
              className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover-elevate"
              data-testid={`row-consultor-${index}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 text-center">
                  {getMedalIcon(index) || (
                    <span className="text-sm font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold" data-testid={`text-consultor-${consultor.id}`}>
                    {consultor.nome}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {consultor.conversoes} de {consultor.totalLeads} leads
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  {consultor.taxaConversao}%
                </p>
                <p className="text-xs text-muted-foreground">Taxa de conversão</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
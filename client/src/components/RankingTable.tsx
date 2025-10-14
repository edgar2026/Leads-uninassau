import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

export interface Vendedor {
  id: string;
  nome: string;
  totalLeads: number;
  conversoes: number;
  taxaConversao: number;
}

interface RankingTableProps {
  vendedores: Vendedor[];
}

export function RankingTable({ vendedores }: RankingTableProps) {
  const sortedVendedores = [...vendedores].sort((a, b) => b.taxaConversao - a.taxaConversao);

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  return (
    <Card data-testid="card-ranking">
      <CardHeader>
        <CardTitle>Ranking de Vendedores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedVendedores.map((vendedor, index) => (
            <div
              key={vendedor.id}
              className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover-elevate"
              data-testid={`row-vendedor-${index}`}
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
                  <p className="font-semibold" data-testid={`text-vendedor-${vendedor.id}`}>
                    {vendedor.nome}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {vendedor.conversoes} de {vendedor.totalLeads} leads
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  {vendedor.taxaConversao}%
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

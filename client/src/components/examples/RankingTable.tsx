import { RankingTable, type Vendedor } from "../RankingTable";

const mockVendedores: Vendedor[] = [
  { id: "1", nome: "Maria Costa", totalLeads: 98, conversoes: 42, taxaConversao: 42.8 },
  { id: "2", nome: "João Silva", totalLeads: 85, conversoes: 35, taxaConversao: 41.2 },
  { id: "3", nome: "Pedro Santos", totalLeads: 64, conversoes: 23, taxaConversao: 35.9 },
  { id: "4", nome: "Ana Rodrigues", totalLeads: 72, conversoes: 24, taxaConversao: 33.3 },
];

export default function RankingTableExample() {
  return (
    <div className="p-8 max-w-2xl">
      <RankingTable vendedores={mockVendedores} />
    </div>
  );
}

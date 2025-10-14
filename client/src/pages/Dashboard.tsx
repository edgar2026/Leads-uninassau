import { DashboardStat } from "@/components/DashboardStat";
import { FunnelChart } from "@/components/FunnelChart";
import { ConversionChart } from "@/components/ConversionChart";
import { RankingTable } from "@/components/RankingTable";
import { TemperatureDistribution } from "@/components/TemperatureDistribution";
import { RecentActivity } from "@/components/RecentActivity";
import { LeadsByOriginChart } from "@/components/LeadsByOriginChart";
import { Users, TrendingUp, UserCheck, Clock } from "lucide-react";

// TODO: remove mock functionality
const mockFunnelData = [
  { name: "Contato", value: 247, percentage: 100 },
  { name: "Interesse", value: 156, percentage: 63 },
  { name: "Prova", value: 98, percentage: 40 },
  { name: "Matrícula", value: 52, percentage: 21 },
];

const mockConversionData = [
  { periodo: "Sem 1", "João Silva": 12, "Maria Costa": 15, "Pedro Santos": 8 },
  { periodo: "Sem 2", "João Silva": 15, "Maria Costa": 18, "Pedro Santos": 10 },
  { periodo: "Sem 3", "João Silva": 18, "Maria Costa": 14, "Pedro Santos": 12 },
  { periodo: "Sem 4", "João Silva": 20, "Maria Costa": 20, "Pedro Santos": 15 },
];

const mockVendedores = [
  { id: "1", nome: "Maria Costa", totalLeads: 98, conversoes: 42, taxaConversao: 42.8 },
  { id: "2", nome: "João Silva", totalLeads: 85, conversoes: 35, taxaConversao: 41.2 },
  { id: "3", nome: "Pedro Santos", totalLeads: 64, conversoes: 23, taxaConversao: 35.9 },
  { id: "4", nome: "Ana Rodrigues", totalLeads: 72, conversoes: 24, taxaConversao: 33.3 },
];

const mockTempData = [
  { name: "Quente", value: 89, emoji: "🔥" },
  { name: "Morno", value: 102, emoji: "🟡" },
  { name: "Frio", value: 56, emoji: "🧊" },
];

const mockActivities = [
  { id: "1", tipo: "novo_lead" as const, descricao: "Novo lead: Ana Silva - Administração", usuario: "João Silva", tempo: "5 min" },
  { id: "2", tipo: "ligacao" as const, descricao: "Ligação com Maria Santos", usuario: "Pedro Costa", tempo: "1 hora" },
  { id: "3", tipo: "email" as const, descricao: "E-mail enviado para Carlos Oliveira", usuario: "Ana Rodrigues", tempo: "2 horas" },
  { id: "4", tipo: "reuniao" as const, descricao: "Reunião agendada com Roberto Lima", usuario: "Maria Costa", tempo: "3 horas" },
];

const mockOriginData = [
  { origem: "Site", total: 89 },
  { origem: "Feira", total: 67 },
  { origem: "Indicação", total: 45 },
  { origem: "Google Ads", total: 32 },
  { origem: "Redes Sociais", total: 14 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">Dashboard Gerencial</h1>
        <p className="text-muted-foreground mt-1">Visão geral da unidade de ensino</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStat title="Total de Leads" value={247} icon={Users} trend={{ value: 12, isPositive: true }} />
        <DashboardStat title="Leads Quentes" value={89} icon={TrendingUp} trend={{ value: 8, isPositive: true }} />
        <DashboardStat title="Taxa de Conversão" value="32%" icon={UserCheck} />
        <DashboardStat title="Tempo Médio" value="12 dias" icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FunnelChart data={mockFunnelData} />
        </div>
        <div>
          <TemperatureDistribution data={mockTempData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionChart data={mockConversionData} vendedores={["João Silva", "Maria Costa", "Pedro Santos"]} />
        <LeadsByOriginChart data={mockOriginData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RankingTable vendedores={mockVendedores} />
        </div>
        <div>
          <RecentActivity activities={mockActivities} />
        </div>
      </div>
    </div>
  );
}

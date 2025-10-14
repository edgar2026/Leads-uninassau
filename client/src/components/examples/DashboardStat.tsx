import { DashboardStat } from "../DashboardStat";
import { Users, TrendingUp, UserCheck, DollarSign } from "lucide-react";

export default function DashboardStatExample() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStat title="Total de Leads" value={247} icon={Users} trend={{ value: 12, isPositive: true }} />
        <DashboardStat title="Leads Quentes" value={89} icon={TrendingUp} trend={{ value: 8, isPositive: true }} />
        <DashboardStat title="Taxa de Conversão" value="32%" icon={UserCheck} trend={{ value: 5, isPositive: false }} />
        <DashboardStat title="Matrículas" value={52} icon={DollarSign} trend={{ value: 15, isPositive: true }} />
      </div>
    </div>
  );
}

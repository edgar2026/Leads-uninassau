import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DashboardStat } from "@/components/DashboardStat";
import { FunnelChart } from "@/components/FunnelChart";
import { ConversionChart } from "@/components/ConversionChart";
import { RankingTable } from "@/components/RankingTable";
import { TemperatureDistribution } from "@/components/TemperatureDistribution";
import { RecentActivity } from "@/components/RecentActivity";
import { LeadsByOriginChart } from "@/components/LeadsByOriginChart";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardFilters } from "@/components/DashboardFilters";
import { Users, TrendingUp, UserCheck, Clock } from "lucide-react";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [courseType, setCourseType] = useState<string>("todos");

  const {
    stats,
    funnelData,
    temperatureData,
    originData,
    rankingData,
    activityData,
    conversionData,
    isLoading,
  } = useDashboardData({ dateRange, courseType });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">Dashboard Gerencial</h1>
          <p className="text-muted-foreground mt-1">Visão geral da unidade de ensino</p>
        </div>
      </div>
      
      <DashboardFilters 
        dateRange={dateRange}
        onDateChange={setDateRange}
        courseType={courseType}
        onCourseTypeChange={setCourseType}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading || !stats ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <DashboardStat title="Total de Leads" value={stats.totalLeads} icon={Users} />
            <DashboardStat title="Leads Quentes" value={stats.hotLeads} icon={TrendingUp} />
            <DashboardStat title="Taxa de Conversão" value={stats.conversionRate} icon={UserCheck} />
            <DashboardStat title="Tempo Médio" value={stats.avgTimeToConversion} icon={Clock} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading || !funnelData ? <Skeleton className="h-[400px]" /> : <FunnelChart data={funnelData} />}
        </div>
        <div>
          {isLoading || !temperatureData ? <Skeleton className="h-[400px]" /> : <TemperatureDistribution data={temperatureData} />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading || !conversionData ? (
          <Skeleton className="h-[400px]" />
        ) : (
          <ConversionChart data={conversionData.chartData} vendedores={conversionData.vendedores} />
        )}
        {isLoading || !originData ? <Skeleton className="h-[400px]" /> : <LeadsByOriginChart data={originData} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading || !rankingData ? <Skeleton className="h-[500px]" /> : <RankingTable vendedores={rankingData} />}
        </div>
        <div>
          {isLoading || !activityData ? <Skeleton className="h-[500px]" /> : <RecentActivity activities={activityData} />}
        </div>
      </div>
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";

interface DashboardDataParams {
  dateRange?: DateRange;
  courseType: string; // Mantido para o filtro principal, mas a agregação será separada
}

const applyDateFilter = (query: any, dateRange?: DateRange) => {
  let filteredQuery = query;
  if (dateRange?.from) {
    filteredQuery = filteredQuery.gte('created_at', dateRange.from.toISOString());
  }
  if (dateRange?.to) {
    filteredQuery = filteredQuery.lte('created_at', dateRange.to.toISOString());
  }
  return filteredQuery;
};

const fetchLeadsByCourseType = async (dateRange?: DateRange) => {
    let query = supabase.from('leads').select(`
        id,
        courses (
            course_types ( name )
        )
    `);
    query = applyDateFilter(query, dateRange);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const counts = data.reduce((acc, lead) => {
        const typeName = (lead.courses as any)?.course_types?.name || 'Não definido';
        acc[typeName] = (acc[typeName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, total]) => ({ name, total }));
};


export function useDashboardData({ dateRange, courseType }: DashboardDataParams) {
    const queryKey = ['dashboardData', dateRange, courseType];

    const dashboardQuery = useQuery({
        queryKey,
        queryFn: async () => {
            // Mock data por enquanto, será substituído
            const stats = { totalLeads: 0, hotLeads: 0, conversionRate: '0%', avgTimeToConversion: '0 dias' };
            const funnelData: any[] = [];
            const temperatureData: any[] = [];
            const originData: any[] = [];
            const rankingData: any[] = [];
            const activityData: any[] = [];
            const conversionData = { chartData: [], consultores: [] };

            const leadsByCourseType = await fetchLeadsByCourseType(dateRange);

            return {
                stats,
                funnelData,
                temperatureData,
                originData,
                rankingData,
                activityData,
                conversionData,
                leadsByCourseType,
            };
        },
        placeholderData: (prev) => prev,
    });

    return {
        ...dashboardQuery.data,
        isLoading: dashboardQuery.isLoading,
    };
}
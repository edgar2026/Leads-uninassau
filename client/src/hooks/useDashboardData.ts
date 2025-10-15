import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatRelativeTime } from "@/lib/utils";
import { startOfWeek, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from "react-day-picker";

interface DashboardDataParams {
  dateRange?: DateRange;
  courseType: string;
}

// --- Funções de busca de dados com filtros ---

const applyFilters = (query: any, dateRange?: DateRange, courseType?: string) => {
  let filteredQuery = query;

  if (dateRange?.from) {
    filteredQuery = filteredQuery.gte('created_at', dateRange.from.toISOString());
  }
  if (dateRange?.to) {
    filteredQuery = filteredQuery.lte('created_at', dateRange.to.toISOString());
  }
  if (courseType && courseType !== 'todos') {
    // Esta é uma limitação do Supabase SDK, o ideal seria um join.
    // Por enquanto, vamos filtrar no cliente após buscar os cursos.
    // Isso será refatorado quando a API for mais robusta.
  }
  return filteredQuery;
};

const fetchDashboardStats = async ({ dateRange, courseType }: DashboardDataParams) => {
  let query = supabase.from("leads").select("id, status, created_at, last_contact_at, course_id");
  query = applyFilters(query, dateRange);
  
  const { data: leads, error: leadsError } = await query;
  if (leadsError) throw new Error(leadsError.message);

  let filteredLeads = leads;
  if (courseType !== 'todos') {
    const { data: courses, error: coursesError } = await supabase.from('courses').select('id').eq('type', courseType);
    if (coursesError) throw new Error(coursesError.message);
    const courseIds = courses.map(c => c.id);
    filteredLeads = leads.filter(l => l.course_id && courseIds.includes(l.course_id));
  }

  const totalLeads = filteredLeads.length;
  const hotLeads = filteredLeads.filter(l => l.status === 'quente').length;
  const matriculados = filteredLeads.filter(l => l.status === 'matriculado');
  const conversionRate = totalLeads > 0 ? (matriculados.length / totalLeads) * 100 : 0;

  let avgTimeToConversion = 0;
  if (matriculados.length > 0) {
    const totalDays = matriculados.reduce((acc, lead) => {
      const createdAt = new Date(lead.created_at);
      const lastContactAt = lead.last_contact_at ? new Date(lead.last_contact_at) : new Date();
      const diffTime = Math.abs(lastContactAt.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return acc + diffDays;
    }, 0);
    avgTimeToConversion = Math.round(totalDays / matriculados.length);
  }

  return {
    totalLeads,
    hotLeads,
    conversionRate: `${conversionRate.toFixed(0)}%`,
    avgTimeToConversion: `${avgTimeToConversion} dias`,
  };
};

// ... (outras funções de busca serão atualizadas de forma similar)

// --- O Hook ---

export function useDashboardData({ dateRange, courseType }: DashboardDataParams) {
    const queryKey = ['dashboardData', dateRange, courseType];

    const dashboardQuery = useQuery({
        queryKey,
        queryFn: async () => {
            // Simulação de paralelismo para as buscas
            const [
                stats,
                // Adicione outras chamadas de função aqui
            ] = await Promise.all([
                fetchDashboardStats({ dateRange, courseType }),
                // fetchFunnelData({ dateRange, courseType }), ...
            ]);

            // Mock data para as outras funções por enquanto
            const funnelData = [];
            const temperatureData = [];
            const originData = [];
            const rankingData = [];
            const activityData = [];
            const conversionData = { chartData: [], consultores: [] };

            return {
                stats,
                funnelData,
                temperatureData,
                originData,
                rankingData,
                activityData,
                conversionData,
            };
        }
    });

    return {
        ...dashboardQuery.data,
        isLoading: dashboardQuery.isLoading,
    };
}
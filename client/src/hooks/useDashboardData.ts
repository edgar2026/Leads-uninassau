import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatRelativeTime } from "@/lib/utils";
import { startOfWeek, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- Funções de busca de dados ---

const fetchDashboardStats = async () => {
  const { data: leads, error: leadsError } = await supabase.from("leads").select("id, status, created_at, last_contact_at");
  if (leadsError) throw new Error(leadsError.message);

  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.status === 'quente').length;
  const matriculados = leads.filter(l => l.status === 'matriculado');
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

const fetchFunnelData = async () => {
    const { data, error } = await supabase
        .from('leads')
        .select('stage')
        .in('stage', ['contato', 'interesse', 'prova', 'matricula']);

    if (error) throw new Error(error.message);

    const stageCounts = data.reduce((acc, { stage }) => {
        if (stage) acc[stage] = (acc[stage] || 0) + 1;
        return acc;
    }, { contato: 0, interesse: 0, prova: 0, matricula: 0 });

    const cumulativeCounts = {
        contato: stageCounts.contato + stageCounts.interesse + stageCounts.prova + stageCounts.matricula,
        interesse: stageCounts.interesse + stageCounts.prova + stageCounts.matricula,
        prova: stageCounts.prova + stageCounts.matricula,
        matricula: stageCounts.matricula,
    };

    const totalLeads = cumulativeCounts.contato;
    if (totalLeads === 0) return [];

    return [
        { name: "Contato", value: cumulativeCounts.contato, percentage: 100 },
        { name: "Interesse", value: cumulativeCounts.interesse, percentage: parseFloat(((cumulativeCounts.interesse / totalLeads) * 100).toFixed(1)) || 0 },
        { name: "Prova", value: cumulativeCounts.prova, percentage: parseFloat(((cumulativeCounts.prova / totalLeads) * 100).toFixed(1)) || 0 },
        { name: "Matrícula", value: cumulativeCounts.matricula, percentage: parseFloat(((cumulativeCounts.matricula / totalLeads) * 100).toFixed(1)) || 0 },
    ];
};

const fetchTemperatureData = async () => {
    const { data, error } = await supabase
        .from('leads')
        .select('status')
        .in('status', ['quente', 'morno', 'frio']);

    if (error) throw new Error(error.message);

    const tempCounts = data.reduce((acc, { status }) => {
        if (status) acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, { quente: 0, morno: 0, frio: 0 });

    return [
        { name: "Quente", value: tempCounts.quente, emoji: "🔥" },
        { name: "Morno", value: tempCounts.morno, emoji: "🟡" },
        { name: "Frio", value: tempCounts.frio, emoji: "🧊" },
    ];
};

const fetchOriginData = async () => {
    const { data, error } = await supabase.from('leads').select('origin');
    if (error) throw new Error(error.message);

    const originCounts = data.reduce((acc, lead) => {
        if (lead.origin) {
            acc[lead.origin] = (acc[lead.origin] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(originCounts).map(([origem, total]) => ({ origem, total }));
};

const fetchRankingData = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select(`id, full_name, leads ( id, status )`);
    if (error) throw new Error(error.message);

    return data.map(profile => {
        const totalLeads = profile.leads.length;
        const conversoes = profile.leads.filter(l => l.status === 'matriculado').length;
        const taxaConversao = totalLeads > 0 ? parseFloat(((conversoes / totalLeads) * 100).toFixed(1)) : 0;
        return {
            id: profile.id,
            nome: profile.full_name || 'Usuário sem nome',
            totalLeads,
            conversoes,
            taxaConversao,
        };
    });
};

const fetchRecentActivity = async () => {
    const { data, error } = await supabase
        .from('interactions')
        .select(`id, type, description, created_at, profiles ( full_name )`)
        .order('created_at', { ascending: false })
        .limit(5);
    if (error) throw new Error(error.message);

    return data.map(activity => ({
        id: activity.id,
        tipo: activity.type,
        descricao: activity.description,
        usuario: activity.profiles?.full_name || 'Sistema',
        tempo: formatRelativeTime(activity.created_at),
    }));
};

const fetchConversionData = async () => {
  const [profilesRes, leadsRes] = await Promise.all([
    supabase.from('profiles').select('id, full_name'),
    supabase.from('leads').select('owner_id, last_contact_at').eq('status', 'matriculado')
  ]);

  if (profilesRes.error) throw new Error(profilesRes.error.message);
  if (leadsRes.error) throw new Error(leadsRes.error.message);

  const profiles = profilesRes.data;
  const leads = leadsRes.data;

  const profileMap = new Map(profiles.map(p => [p.id, p.full_name || 'Sem Vendedor']));
  const vendedores = [...new Set(profiles.map(p => p.full_name || 'Sem Vendedor'))];

  const weeklyData = leads.reduce((acc, lead) => {
    if (!lead.last_contact_at || !lead.owner_id) return acc;

    const conversionDate = new Date(lead.last_contact_at);
    const weekStartDate = startOfWeek(conversionDate, { locale: ptBR });
    const weekLabel = `Sem ${format(weekStartDate, 'w', { locale: ptBR })}`;
    
    const sellerName = profileMap.get(lead.owner_id) || 'Sem Vendedor';

    if (!acc[weekLabel]) acc[weekLabel] = {};
    acc[weekLabel][sellerName] = (acc[weekLabel][sellerName] || 0) + 1;

    return acc;
  }, {} as Record<string, Record<string, number>>);

  const chartData = Object.entries(weeklyData)
    .map(([periodo, sellerData]) => ({ periodo, ...sellerData }))
    .sort((a, b) => parseInt(a.periodo.split(' ')[1]) - parseInt(b.periodo.split(' ')[1]));

  chartData.forEach(dataPoint => {
      vendedores.forEach(vendedor => {
          if (!dataPoint[vendedor]) dataPoint[vendedor] = 0;
      });
  });

  return { chartData, vendedores };
};

// --- O Hook ---

export function useDashboardData() {
    const statsQuery = useQuery({ queryKey: ['dashboardStats'], queryFn: fetchDashboardStats });
    const funnelQuery = useQuery({ queryKey: ['funnelData'], queryFn: fetchFunnelData });
    const temperatureQuery = useQuery({ queryKey: ['temperatureData'], queryFn: fetchTemperatureData });
    const originQuery = useQuery({ queryKey: ['originData'], queryFn: fetchOriginData });
    const rankingQuery = useQuery({ queryKey: ['rankingData'], queryFn: fetchRankingData });
    const activityQuery = useQuery({ queryKey: ['recentActivity'], queryFn: fetchRecentActivity });
    const conversionQuery = useQuery({ queryKey: ['conversionData'], queryFn: fetchConversionData });

    return {
        stats: statsQuery.data,
        funnelData: funnelQuery.data,
        temperatureData: temperatureQuery.data,
        originData: originQuery.data,
        rankingData: rankingQuery.data,
        activityData: activityQuery.data,
        conversionData: conversionQuery.data,
        isLoading: 
            statsQuery.isLoading ||
            funnelQuery.isLoading ||
            temperatureQuery.isLoading ||
            originQuery.isLoading ||
            rankingQuery.isLoading ||
            activityQuery.isLoading ||
            conversionQuery.isLoading,
    };
}
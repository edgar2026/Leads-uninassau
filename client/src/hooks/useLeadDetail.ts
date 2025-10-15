import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LeadFromSupabase } from "./useLeadsPanel";

// Tipagem para Interações
export type Interaction = {
  id: string;
  lead_id: string;
  user_id: string;
  type: 'ligacao' | 'email' | 'whatsapp' | 'reuniao' | 'visita' | 'cadastro';
  description: string | null;
  created_at: string;
  profiles: { full_name: string } | null;
};

// Tipagem para o Lead Detalhado (inclui todas as relações)
export type DetailedLead = LeadFromSupabase & {
  origins: { name: string } | null;
  lead_stages: { name: string } | null;
  courses: { name: string } | null;
  owner: { full_name: string } | null;
  interactions: Interaction[];
};

const fetchLeadDetails = async (leadId: string): Promise<DetailedLead> => {
  // Consulta simplificada para garantir que o lead principal seja carregado
  const { data: leadData, error: leadError } = await supabase
    .from("leads")
    .select(`
      *,
      origins(name),
      lead_stages(name),
      courses(name),
      owner_id
    `)
    .eq("id", leadId)
    .single();

  if (leadError) throw new Error(`Erro ao buscar lead: ${leadError.message}`);
  if (!leadData) throw new Error("Lead não encontrado.");

  // Busca o nome do responsável separadamente, se houver owner_id
  let ownerProfile = null;
  if (leadData.owner_id) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", leadData.owner_id)
      .single();
    ownerProfile = profileData;
  }

  const { data: interactionsData, error: interactionsError } = await supabase
    .from("interactions")
    .select(`
      *,
      profiles(full_name)
    `)
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (interactionsError) throw new Error(`Erro ao buscar interações: ${interactionsError.message}`);

  return {
    ...leadData,
    owner: ownerProfile, // Adiciona o perfil do responsável
    interactions: interactionsData as Interaction[],
  } as DetailedLead;
};

export function useLeadDetail(leadId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lead, isLoading, isError } = useQuery({
    queryKey: ["leadDetail", leadId],
    queryFn: () => fetchLeadDetails(leadId),
    enabled: !!leadId,
  });

  const addInteraction = useMutation({
    mutationFn: async ({ lead_id, type, description }: { lead_id: string; type: string; description: string }) => {
      const { error } = await supabase.from("interactions").insert({
        lead_id,
        type,
        description,
        user_id: (await supabase.auth.getUser()).data.user?.id, // Pega o ID do usuário logado
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Interação registrada." });
      queryClient.invalidateQueries({ queryKey: ["leadDetail", leadId] });
      queryClient.invalidateQueries({ queryKey: ["leads"] }); // Atualiza a lista de leads (último contato)
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  return {
    lead,
    isLoading,
    isError,
    addInteraction,
  };
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type LeadFromSupabase = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  course_id: string | null;
  origin_id: string | null;
  status: "quente" | "morno" | "frio" | "perdido" | "matriculado" | null;
  stage_id: string | null;
  owner_id: string | null;
  created_at: string | null;
  last_contact_at: string | null;
  courses: { name: string; type_id: string; course_types: { name: string } | null } | null;
  origins: { name: string } | null;
  lead_stages: { name: string } | null;
};

export function useLeadsPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();

  const { data: leads, isLoading: isLoadingLeads } = useQuery<LeadFromSupabase[]>({
    queryKey: ["leads", user?.id, profile?.role],
    queryFn: async () => {
      if (!user || !profile) return [];
      
      let query = supabase
        .from("leads")
        .select("*, courses(*, course_types(name)), origins(name), lead_stages(name)");

      // Se o usuário for do tipo 'Comercial', mostra apenas os leads dele.
      // Administradores e outros cargos podem ver todos os leads.
      if (profile.role === "Comercial") {
        query = query.eq("owner_id", user.id);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!user && !!profile,
  });

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id, name, type_id").order("name");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: origins, isLoading: isLoadingOrigins } = useQuery({
    queryKey: ["origins"],
    queryFn: async () => {
      const { data, error } = await supabase.from("origins").select("id, name").order("name");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: courseTypes, isLoading: isLoadingCourseTypes } = useQuery({
    queryKey: ["course_types"],
    queryFn: async () => {
      const { data, error } = await supabase.from("course_types").select("id, name").order("name");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: leadStages, isLoading: isLoadingLeadStages } = useQuery({
    queryKey: ["lead_stages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lead_stages").select("id, name").order("name");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const createLead = useMutation({
    mutationFn: async (newLead: any) => {
      const { error } = await supabase.rpc('create_lead_with_interaction', {
        name: newLead.name,
        phone: newLead.phone,
        email: newLead.email,
        course_id: newLead.course_id,
        origin_id: newLead.origin_id,
        status: newLead.status,
        stage_id: newLead.stage_id,
        interaction_description: newLead.description,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Lead cadastrado." });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const updateLead = useMutation({
    mutationFn: async (updatedLead: any) => {
      const { id, ...rest } = updatedLead;
      const { error } = await supabase.from("leads").update(rest).eq("id", id as string);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Lead atualizado." });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const deleteLead = useMutation({
    mutationFn: async (leadId: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", leadId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Lead excluído." });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  return {
    leads,
    courses,
    origins,
    courseTypes,
    leadStages,
    createLead,
    updateLead,
    deleteLead,
    isLoading: isLoadingLeads || isLoadingCourses || isLoadingOrigins || isLoadingCourseTypes || isLoadingLeadStages,
  };
}
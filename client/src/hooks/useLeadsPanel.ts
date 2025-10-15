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
  profiles: { full_name: string } | null;
};

export function useLeadsPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: leads, isLoading: isLoadingLeads } = useQuery<LeadFromSupabase[]>({
    queryKey: ["leads", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("leads")
        .select("*, courses(*, course_types(name)), origins(name), lead_stages(name), profiles(full_name)")
        .eq("owner_id", user.id);
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!user,
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

  return {
    leads,
    courses,
    origins,
    courseTypes,
    leadStages,
    createLead,
    updateLead,
    isLoading: isLoadingLeads || isLoadingCourses || isLoadingOrigins || isLoadingCourseTypes || isLoadingLeadStages,
  };
}
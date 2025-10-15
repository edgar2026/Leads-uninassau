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
  origin: string | null;
  status: "quente" | "morno" | "frio" | "perdido" | "matriculado" | null;
  stage: "contato" | "interesse" | "prova" | "matricula" | null;
  owner_id: string | null;
  created_at: string | null;
  last_contact_at: string | null;
  courses: { name: string } | null;
  profiles: { full_name: string } | null;
};

export function useLeadsPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: leads, isLoading: isLoadingLeads } = useQuery<LeadFromSupabase[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*, courses(name), profiles(full_name)");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id, name, type");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: origins, isLoading: isLoadingOrigins } = useQuery({
    queryKey: ["origins"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_distinct_origins");
      if (error) throw new Error(error.message);
      return data.map((item: { origin: string }) => item.origin) || [];
    },
  });

  const createLead = useMutation({
    mutationFn: async (newLead: Omit<LeadFromSupabase, "id" | "created_at" | "courses" | "profiles">) => {
      const { error } = await supabase.from("leads").insert({ ...newLead, owner_id: user?.id });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Lead cadastrado." });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["origins"] });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const updateLead = useMutation({
    mutationFn: async (updatedLead: Partial<LeadFromSupabase>) => {
      const { id, ...rest } = updatedLead;
      const { error } = await supabase.from("leads").update(rest).eq("id", id as string);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Lead atualizado." });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["origins"] });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  return {
    leads,
    courses,
    origins,
    createLead,
    updateLead,
    isLoading: isLoadingLeads || isLoadingCourses || isLoadingOrigins,
  };
}
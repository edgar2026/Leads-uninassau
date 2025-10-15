import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type Course = { id: string; name: string; type_id: string };
export type Origin = { id: string; name: string };
export type CourseType = { id: string; name: string };
export type LeadStage = { id: string; name: string };
export type Profile = { id: string; full_name: string; role: string };

export function useAdminManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // --- QUERIES ---
  const { data: courses, isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*, course_types(name)").order("name");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: origins, isLoading: isLoadingOrigins } = useQuery<Origin[]>({
    queryKey: ["origins"],
    queryFn: async () => {
      const { data, error } = await supabase.from("origins").select("*").order("name");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: courseTypes, isLoading: isLoadingCourseTypes } = useQuery<CourseType[]>({
    queryKey: ["course_types"],
    queryFn: async () => {
      const { data, error } = await supabase.from("course_types").select("*").order("name");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: leadStages, isLoading: isLoadingLeadStages } = useQuery<LeadStage[]>({
    queryKey: ["lead_stages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lead_stages").select("*").order("name");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: profiles, isLoading: isLoadingProfiles } = useQuery<Profile[]>({
    queryKey: ["all_profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, full_name, role");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  // --- MUTATIONS ---
  const createEntity = useMutation({
    mutationFn: async ({ entity, name, type_id }: { entity: 'courses' | 'origins' | 'course_types' | 'lead_stages', name: string, type_id?: string }) => {
      const payload: { name: string; type_id?: string } = { name };
      if (type_id) payload.type_id = type_id;
      const { error } = await supabase.from(entity).insert(payload);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, { entity }) => {
      toast({ title: "Sucesso!", description: "Item criado." });
      queryClient.invalidateQueries({ queryKey: [entity] });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const updateEntity = useMutation({
    mutationFn: async ({ entity, id, name, type_id }: { entity: 'courses' | 'origins' | 'course_types' | 'lead_stages', id: string, name: string, type_id?: string }) => {
      const payload: { name: string; type_id?: string } = { name };
      if (type_id) payload.type_id = type_id;
      const { error } = await supabase.from(entity).update(payload).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, { entity }) => {
      toast({ title: "Sucesso!", description: "Item atualizado." });
      queryClient.invalidateQueries({ queryKey: [entity] });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const deleteEntity = useMutation({
    mutationFn: async ({ entity, id }: { entity: 'courses' | 'origins' | 'course_types' | 'lead_stages', id: string }) => {
      const { error } = await supabase.from(entity).delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, { entity }) => {
      toast({ title: "Sucesso!", description: "Item excluído." });
      queryClient.invalidateQueries({ queryKey: [entity] });
    },
    onError: (error) => {
      toast({ title: "Erro", description: "Não foi possível excluir. Verifique se o item não está em uso.", variant: "destructive" });
    },
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "O cargo do usuário foi atualizado." });
      queryClient.invalidateQueries({ queryKey: ["all_profiles"] });
    },
    onError: (error) => {
      toast({ title: "Erro", description: `Não foi possível atualizar o cargo: ${error.message}`, variant: "destructive" });
    },
  });

  return {
    courses,
    origins,
    courseTypes,
    leadStages,
    profiles,
    isLoading: isLoadingCourses || isLoadingOrigins || isLoadingCourseTypes || isLoadingLeadStages || isLoadingProfiles,
    createEntity,
    updateEntity,
    deleteEntity,
    updateUserRole,
  };
}
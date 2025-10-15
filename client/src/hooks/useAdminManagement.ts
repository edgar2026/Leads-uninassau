import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type Course = { id: string; name: string; type: string };
export type Origin = { id: string; name: string };

export function useAdminManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // --- QUERIES ---
  const { data: courses, isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("name");
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

  // --- MUTATIONS ---
  const createEntity = useMutation({
    mutationFn: async ({ entity, name, type }: { entity: 'courses' | 'origins', name: string, type?: string }) => {
      const payload: { name: string; type?: string } = { name };
      if (type) payload.type = type;
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
    mutationFn: async ({ entity, id, name, type }: { entity: 'courses' | 'origins', id: string, name: string, type?: string }) => {
      const payload: { name: string; type?: string } = { name };
      if (type) payload.type = type;
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
    mutationFn: async ({ entity, id }: { entity: 'courses' | 'origins', id: string }) => {
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

  return {
    courses,
    origins,
    isLoading: isLoadingCourses || isLoadingOrigins,
    createEntity,
    updateEntity,
    deleteEntity,
  };
}
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GraduationCap, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseFormModal } from "@/components/CourseFormModal";

interface Course {
  id: string;
  name: string;
  type: 'Pós-graduação' | 'EAD' | 'Presencial';
  leads: { count: number }[];
}

export default function Cursos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, name, type, leads(count)");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { mutate: saveCourse, isPending: isSaving } = useMutation({
    mutationFn: async ({ data, courseId }: { data: { name: string; type: string }, courseId?: string }) => {
      if (courseId) {
        const { error } = await supabase.from("courses").update(data).eq("id", courseId);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("courses").insert(data);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Curso salvo com sucesso." });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const handleOpenModal = (course: Course | null = null) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Cursos</h1>
          <p className="text-muted-foreground mt-1">Gerencie os cursos disponíveis</p>
        </div>
        <Button data-testid="button-add-curso" onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40" />)
        ) : (
          courses?.map((curso) => (
            <Card key={curso.id} className="hover-elevate flex flex-col" data-testid={`card-curso-${curso.id}`}>
              <CardHeader className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{curso.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{curso.leads[0]?.count || 0} leads</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex gap-2">
                 <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {curso.type}
                </span>
                <Button size="sm" variant="outline" className="ml-auto" onClick={() => handleOpenModal(curso)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <CourseFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
        onSave={saveCourse}
        isSaving={isSaving}
      />
    </div>
  );
}
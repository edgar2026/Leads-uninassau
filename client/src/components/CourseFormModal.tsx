import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const courseSchema = z.object({
  name: z.string().min(3, "O nome do curso é obrigatório."),
  type: z.enum(["Pós-graduação", "EAD", "Presencial"]),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface Course {
  id: string;
  name: string;
  type: 'Pós-graduação' | 'EAD' | 'Presencial';
}

interface CourseFormModalProps {
  open: boolean;
  onClose: () => void;
  course?: Course | null;
  onSave: (data: CourseFormValues, courseId?: string) => void;
  isSaving: boolean;
}

export function CourseFormModal({ open, onClose, course, onSave, isSaving }: CourseFormModalProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      type: "Presencial",
    },
  });

  useEffect(() => {
    if (course) {
      form.reset(course);
    } else {
      form.reset({ name: "", type: "Presencial" });
    }
  }, [course, form, open]);

  const handleSubmit = (data: CourseFormValues) => {
    onSave(data, course?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{course ? "Editar Curso" : "Novo Curso"}</DialogTitle>
          <DialogDescription>
            Preencha os dados para gerenciar o curso.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Curso</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Administração" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Curso</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Presencial">Presencial</SelectItem>
                      <SelectItem value="EAD">EAD</SelectItem>
                      <SelectItem value="Pós-graduação">Pós-graduação</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
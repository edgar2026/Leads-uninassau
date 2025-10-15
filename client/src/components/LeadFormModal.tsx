import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LeadFromSupabase } from "@/hooks/useLeadsPanel";

type Course = { id: string; name: string; type_id: string };
type Origin = { id: string; name: string };
type CourseType = { id: string; name: string };
type LeadStage = { id: string; name: string };

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  lead?: Partial<LeadFromSupabase>;
  onSave: (lead: any) => void;
  courses: Course[];
  origins: Origin[];
  courseTypes: CourseType[];
  leadStages: LeadStage[];
}

export function LeadFormModal({ open, onClose, lead, onSave, courses, origins, courseTypes, leadStages }: LeadFormModalProps) {
  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm();

  const watchedCourseType = watch("course_type_id");

  const filteredCourses = useMemo(() => {
    if (!watchedCourseType) return [];
    return courses.filter(c => c.type_id === watchedCourseType);
  }, [courses, watchedCourseType]);

  useEffect(() => {
    if (open) {
      const leadCourse = courses.find(c => c.id === lead?.course_id);
      reset({
        name: lead?.name || "",
        phone: lead?.phone || "",
        email: lead?.email || "",
        course_type_id: leadCourse?.type_id || "",
        course_id: lead?.course_id || "",
        origin_id: lead?.origin_id || "",
        status: lead?.status || "morno",
        stage_id: lead?.stage_id || "",
      });
    }
  }, [open, lead, courses, reset]);

  useEffect(() => {
    setValue('course_id', '');
  }, [watchedCourseType, setValue]);

  const onSubmit = (data: any) => {
    const { course_type_id, ...leadData } = data;
    onSave({ id: lead?.id, ...leadData });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lead?.id ? "Editar Lead" : "Novo Lead"}</DialogTitle>
          <DialogDescription>
            Preencha os dados do lead para cadastro no sistema
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input id="name" {...register("name", { required: true })} data-testid="input-nome" />
              {errors.name && <p className="text-red-500 text-xs">Nome é obrigatório</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone / WhatsApp</Label>
              <Input id="phone" {...register("phone")} placeholder="(00) 00000-0000" data-testid="input-telefone" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register("email")} data-testid="input-email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course_type_id">Tipo de Curso *</Label>
              <Controller
                name="course_type_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger data-testid="select-tipo-curso">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.course_type_id && <p className="text-red-500 text-xs">Tipo é obrigatório</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="course_id">Curso de Interesse *</Label>
              <Controller
                name="course_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={!watchedCourseType}>
                    <SelectTrigger data-testid="select-curso">
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCourses.map(course => (
                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.course_id && <p className="text-red-500 text-xs">Curso é obrigatório</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin_id">Origem do Lead *</Label>
              <Controller
                name="origin_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger data-testid="select-origem">
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      {origins.map(origin => (
                        <SelectItem key={origin.id} value={origin.id}>{origin.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
               {errors.origin_id && <p className="text-red-500 text-xs">Origem é obrigatória</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quente">🔥 Quente</SelectItem>
                      <SelectItem value="morno">🟡 Morno</SelectItem>
                      <SelectItem value="frio">🧊 Frio</SelectItem>
                      <SelectItem value="perdido">Perdido</SelectItem>
                      <SelectItem value="matriculado">Matriculado</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="stage_id">Etapa do Funil *</Label>
              <Controller
                name="stage_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger data-testid="select-etapa">
                      <SelectValue placeholder="Selecione a etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {leadStages.map(stage => (
                        <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.stage_id && <p className="text-red-500 text-xs">Etapa é obrigatória</p>}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancelar
            </Button>
            <Button type="submit" data-testid="button-save">
              {lead?.id ? "Atualizar" : "Cadastrar"} Lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
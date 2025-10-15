import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LeadFromSupabase } from "@/hooks/useLeadsPanel";

type Course = { id: string; name: string };

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  lead?: Partial<LeadFromSupabase>;
  onSave: (lead: any) => void;
  courses: Course[];
  origins: string[];
}

export function LeadFormModal({ open, onClose, lead, onSave, courses, origins }: LeadFormModalProps) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (open) {
      reset({
        name: lead?.name || "",
        phone: lead?.phone || "",
        email: lead?.email || "",
        course_id: lead?.course_id || "",
        origin: lead?.origin || "",
        status: lead?.status || "morno",
        stage: lead?.stage || "contato",
        // observacoes: "", // Note: 'observacoes' is not in the leads table
      });
    }
  }, [open, lead, reset]);

  const onSubmit = (data: any) => {
    onSave({ id: lead?.id, ...data });
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
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register("email")} data-testid="input-email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course_id">Curso de Interesse *</Label>
              <Controller
                name="course_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger data-testid="select-curso">
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.course_id && <p className="text-red-500 text-xs">Curso é obrigatório</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">Origem do Lead *</Label>
              <Controller
                name="origin"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger data-testid="select-origem">
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      {origins.map(origin => (
                        <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
               {errors.origin && <p className="text-red-500 text-xs">Origem é obrigatória</p>}
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
            <div className="space-y-2">
              <Label htmlFor="stage">Etapa do Funil *</Label>
              <Controller
                name="stage"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger data-testid="select-etapa">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contato">Contato</SelectItem>
                      <SelectItem value="interesse">Interesse</SelectItem>
                      <SelectItem value="prova">Prova</SelectItem>
                      <SelectItem value="matricula">Matrícula</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {/* <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" {...register("observacoes")} placeholder="Adicione observações sobre o lead..." className="min-h-24" data-testid="textarea-observacoes" />
            </div> */}
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
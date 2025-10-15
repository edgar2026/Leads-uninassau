import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ManagementFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; name: string; type_id?: string }) => void;
  item?: { id?: string; name?: string; type_id?: string };
  title: string;
  hasTypeField?: boolean;
  courseTypes?: { id: string; name: string }[];
}

export function ManagementFormModal({ open, onClose, onSave, item, title, hasTypeField = false, courseTypes = [] }: ManagementFormModalProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  useEffect(() => {
    if (open) {
      reset({
        name: item?.name || "",
        type_id: item?.type_id || (hasTypeField && courseTypes.length > 0 ? courseTypes[0].id : undefined),
      });
    }
  }, [open, item, reset, hasTypeField, courseTypes]);

  const onSubmit = (data: any) => {
    onSave({ id: item?.id, ...data });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item?.id ? `Editar ${title}` : `Novo ${title}`}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name", { required: "Nome é obrigatório" })} />
            {errors.name && <p className="text-sm text-red-500">{(errors.name as any).message}</p>}
          </div>
          {hasTypeField && (
            <div className="space-y-2">
              <Label htmlFor="type_id">Tipo</Label>
              <Controller
                name="type_id"
                control={control}
                rules={{ required: "Tipo é obrigatório" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type_id && <p className="text-sm text-red-500">{(errors.type_id as any).message}</p>}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
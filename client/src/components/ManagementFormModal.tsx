import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ManagementFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; name: string; type?: string }) => void;
  item?: { id?: string; name?: string; type?: string };
  title: string;
  hasType?: boolean;
}

export function ManagementFormModal({ open, onClose, onSave, item, title, hasType = false }: ManagementFormModalProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  useEffect(() => {
    if (open) {
      reset({
        name: item?.name || "",
        type: item?.type || (hasType ? "Presencial" : undefined),
      });
    }
  }, [open, item, reset, hasType]);

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
          {hasType && (
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select name="type" defaultValue={item?.type || "Presencial"} onValueChange={(value) => control.setValue('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="EAD">EAD</SelectItem>
                  <SelectItem value="Pós-graduação">Pós-graduação</SelectItem>
                </SelectContent>
              </Select>
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
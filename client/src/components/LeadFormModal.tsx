import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Lead } from "./LeadCard";

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  lead?: Lead;
  onSave?: (lead: Partial<Lead>) => void;
}

export function LeadFormModal({ open, onClose, lead, onSave }: LeadFormModalProps) {
  const [formData, setFormData] = useState({
    nome: lead?.nome || "",
    telefone: lead?.telefone || "",
    email: lead?.email || "",
    curso: lead?.curso || "",
    origem: lead?.origem || "",
    status: lead?.status || "morno",
    etapa: lead?.etapa || "contato",
    observacoes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Save lead:", formData);
    onSave?.(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lead ? "Editar Lead" : "Novo Lead"}</DialogTitle>
          <DialogDescription>
            Preencha os dados do lead para cadastro no sistema
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                data-testid="input-nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone / WhatsApp *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                required
                data-testid="input-telefone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="curso">Curso de Interesse *</Label>
              <Select value={formData.curso} onValueChange={(value) => setFormData({ ...formData, curso: value })}>
                <SelectTrigger data-testid="select-curso">
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administração">Administração</SelectItem>
                  <SelectItem value="Engenharia">Engenharia</SelectItem>
                  <SelectItem value="Direito">Direito</SelectItem>
                  <SelectItem value="Medicina">Medicina</SelectItem>
                  <SelectItem value="Psicologia">Psicologia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="origem">Origem do Lead *</Label>
              <Select value={formData.origem} onValueChange={(value) => setFormData({ ...formData, origem: value })}>
                <SelectTrigger data-testid="select-origem">
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Site">Site</SelectItem>
                  <SelectItem value="Feira">Feira</SelectItem>
                  <SelectItem value="Indicação">Indicação</SelectItem>
                  <SelectItem value="Redes Sociais">Redes Sociais</SelectItem>
                  <SelectItem value="Google Ads">Google Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="etapa">Etapa do Funil *</Label>
              <Select value={formData.etapa} onValueChange={(value) => setFormData({ ...formData, etapa: value as any })}>
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
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Adicione observações sobre o lead..."
                className="min-h-24"
                data-testid="textarea-observacoes"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancelar
            </Button>
            <Button type="submit" data-testid="button-save">
              {lead ? "Atualizar" : "Cadastrar"} Lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

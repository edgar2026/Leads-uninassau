import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { StageBadge } from "@/components/StageBadge";
import { InteractionModal } from "@/components/InteractionModal";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, MessageSquare, Edit } from "lucide-react";

// TODO: remove mock functionality
const mockLead = {
  id: "1",
  nome: "Maria Santos",
  telefone: "(11) 98765-4321",
  email: "maria.santos@email.com",
  curso: "Administração",
  origem: "Site",
  status: "quente" as const,
  etapa: "interesse" as const,
  observacoes: "Interessada em turma noturna. Preferência por campus central.",
  cadastradoEm: "15 de outubro de 2024",
  responsavel: "João Silva",
};

const mockInteractions = [
  {
    id: "1",
    tipo: "ligacao" as const,
    descricao: "Ligação realizada para apresentação do curso. Lead demonstrou interesse.",
    usuario: "João Silva",
    data: "14/10/2024 15:30",
  },
  {
    id: "2",
    tipo: "email" as const,
    descricao: "Enviado material informativo sobre grade curricular e valores.",
    usuario: "João Silva",
    data: "13/10/2024 10:15",
  },
  {
    id: "3",
    tipo: "whatsapp" as const,
    descricao: "Lead entrou em contato perguntando sobre bolsas de estudo.",
    usuario: "Sistema",
    data: "12/10/2024 18:45",
  },
];

const interactionIcons = {
  ligacao: Phone,
  email: Mail,
  whatsapp: MessageSquare,
  reuniao: Calendar,
  visita: MapPin,
};

export default function LeadDetail() {
  const [, params] = useRoute("/lead/:id");
  const [, setLocation] = useLocation();
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/leads")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold" data-testid="text-lead-name">{mockLead.nome}</h1>
          <p className="text-muted-foreground mt-1">Cadastrado em {mockLead.cadastradoEm}</p>
        </div>
        <Button variant="outline" data-testid="button-edit-lead">
          <Edit className="h-4 w-4 mr-2" />
          Editar Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Lead</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Telefone</p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {mockLead.telefone}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">E-mail</p>
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {mockLead.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Curso</p>
                  <p>{mockLead.curso}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Origem</p>
                  <p>{mockLead.origem}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                  <StatusBadge status={mockLead.status} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Etapa</p>
                  <StageBadge stage={mockLead.etapa} />
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Responsável</p>
                  <p>{mockLead.responsavel}</p>
                </div>
              </div>
              {mockLead.observacoes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">{mockLead.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Histórico de Interações</CardTitle>
              <Button
                size="sm"
                onClick={() => setShowInteractionModal(true)}
                data-testid="button-add-interaction"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Nova Interação
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInteractions.map((interaction) => {
                  const Icon = interactionIcons[interaction.tipo];
                  return (
                    <div
                      key={interaction.id}
                      className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                      data-testid={`interaction-${interaction.id}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{interaction.descricao}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {interaction.usuario} • {interaction.data}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => window.open(`https://wa.me/55${mockLead.telefone.replace(/\D/g, '')}`, '_blank', 'noopener,noreferrer')}
                data-testid="button-whatsapp"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => window.location.href = `mailto:${mockLead.email}`}
                data-testid="button-email"
              >
                <Mail className="h-4 w-4 mr-2" />
                Enviar E-mail
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <InteractionModal
        open={showInteractionModal}
        onClose={() => setShowInteractionModal(false)}
        leadName={mockLead.nome}
        onSave={(interaction) => console.log("Saved interaction:", interaction)}
      />
    </div>
  );
}

import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { StageBadge } from "@/components/StageBadge";
import { InteractionModal } from "@/components/InteractionModal";
import { ArrowLeft, Phone, Mail, Calendar, MessageSquare, Edit, FilePlus, Loader2 } from "lucide-react";
import { useLeadDetail, Interaction } from "@/hooks/useLeadDetail";
import { formatRelativeTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const interactionIcons = {
  ligacao: Phone,
  email: Mail,
  whatsapp: MessageSquare,
  reuniao: Calendar,
  visita: Calendar, // Usando Calendar para visita/reunião por enquanto
  cadastro: FilePlus,
};

const InteractionTimeline = ({ interactions }: { interactions: Interaction[] }) => {
  return (
    <div className="space-y-4">
      {interactions.map((interaction) => {
        const Icon = interactionIcons[interaction.type as keyof typeof interactionIcons] || MessageSquare;
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
              <p className="text-sm">{interaction.description || `Interação do tipo ${interaction.type}`}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {interaction.profiles?.full_name || "Usuário Desconhecido"} • {formatRelativeTime(interaction.created_at)}
              </p>
            </div>
          </div>
        );
      })}
      {interactions.length === 0 && (
        <p className="text-muted-foreground text-sm">Nenhuma interação registrada ainda.</p>
      )}
    </div>
  );
};

export default function LeadDetail() {
  const [, params] = useRoute("/lead/:id");
  const leadId = params?.id || "";
  const [, setLocation] = useLocation();
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  const { lead, isLoading, addInteraction } = useLeadDetail(leadId);

  const handleSaveInteraction = (interaction: { tipo: string; descricao: string }) => {
    if (leadId) {
      addInteraction.mutate({
        lead_id: leadId,
        type: interaction.tipo,
        description: interaction.descricao,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-96" />
          </div>
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Lead não encontrado.</h2>
        <Button variant="link" onClick={() => setLocation("/leads")}>
          Voltar para a lista de Leads
        </Button>
      </div>
    );
  }

  const leadStatus = lead.status || "morno";
  const leadStageName = lead.lead_stages?.name?.toLowerCase().replace('í', 'i').replace('ã', 'a') as any || 'contato';
  const leadOwner = lead.owner?.full_name || "N/A";

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
          <h1 className="text-3xl font-bold" data-testid="text-lead-name">{lead.name}</h1>
          <p className="text-muted-foreground mt-1">Cadastrado em {lead.created_at ? formatRelativeTime(lead.created_at) : 'N/A'}</p>
        </div>
        <Button variant="outline" data-testid="button-edit-lead" onClick={() => console.log("TODO: Open Edit Modal")}>
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
                    {lead.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">E-mail</p>
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {lead.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Curso</p>
                  <p>{lead.courses?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Origem</p>
                  <p>{lead.origins?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                  <StatusBadge status={leadStatus} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Etapa</p>
                  <StageBadge stage={leadStageName} />
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Responsável</p>
                  <p>{leadOwner}</p>
                </div>
              </div>
              {lead.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">{lead.description}</p>
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
                disabled={addInteraction.isPending}
              >
                {addInteraction.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <MessageSquare className="h-4 w-4 mr-2" />
                )}
                Nova Interação
              </Button>
            </CardHeader>
            <CardContent>
              <InteractionTimeline interactions={lead.interactions} />
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
                onClick={() => lead.phone && window.open(`https://wa.me/55${lead.phone.replace(/\D/g, '')}`, '_blank', 'noopener,noreferrer')}
                disabled={!lead.phone}
                data-testid="button-whatsapp"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => lead.email && (window.location.href = `mailto:${lead.email}`)}
                disabled={!lead.email}
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
        leadName={lead.name}
        onSave={handleSaveInteraction}
      />
    </div>
  );
}
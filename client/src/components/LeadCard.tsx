import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, type LeadStatus } from "./StatusBadge";
import { StageBadge, type LeadStage } from "./StageBadge";
import { Mail, Phone, Edit, Eye } from "lucide-react";

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  curso: string;
  origem: string;
  status: LeadStatus;
  etapa: LeadStage;
  ultimoContato?: string;
}

interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onView?: (lead: Lead) => void;
}

export function LeadCard({ lead, onEdit, onView }: LeadCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-lead-${lead.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold">{lead.nome}</h3>
          <StatusBadge status={lead.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span data-testid={`text-phone-${lead.id}`}>{lead.telefone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="truncate" data-testid={`text-email-${lead.id}`}>{lead.email}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <StageBadge stage={lead.etapa} />
          <Badge variant="secondary" className="text-xs">{lead.curso}</Badge>
          <Badge variant="secondary" className="text-xs">{lead.origem}</Badge>
        </div>
        {lead.ultimoContato && (
          <p className="text-xs text-muted-foreground">
            Último contato: {lead.ultimoContato}
          </p>
        )}
      </CardContent>
      <CardFooter className="gap-2 pt-0">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onEdit?.(lead)}
          data-testid={`button-edit-${lead.id}`}
        >
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onView?.(lead)}
          data-testid={`button-view-${lead.id}`}
        >
          <Eye className="h-4 w-4 mr-1" />
          Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}

function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: "default" | "secondary"; className?: string }) {
  const baseClass = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  const variantClass = variant === "secondary" ? "bg-secondary text-secondary-foreground" : "";
  return <span className={`${baseClass} ${variantClass} ${className}`}>{children}</span>;
}

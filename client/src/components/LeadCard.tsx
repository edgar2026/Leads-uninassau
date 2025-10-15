import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, type LeadStatus } from "./StatusBadge";
import { StageBadge, type LeadStage } from "./StageBadge";
import { Mail, Phone, Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  courseName: string | null;
  origin: string | null;
  status: LeadStatus;
  stage: LeadStage;
  last_contact_at: string | null;
}

interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onView?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
}

export function LeadCard({ lead, onEdit, onView, onDelete }: LeadCardProps) {
  return (
    <Card className="hover-elevate flex flex-col" data-testid={`card-lead-${lead.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{lead.name}</h3>
            <StatusBadge status={lead.status} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(lead)}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(lead)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1">
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span data-testid={`text-phone-${lead.id}`}>{lead.phone}</span>
          </div>
        )}
        {lead.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate" data-testid={`text-email-${lead.id}`}>{lead.email}</span>
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          <StageBadge stage={lead.stage} />
          {lead.courseName && <Badge variant="secondary" className="text-xs">{lead.courseName}</Badge>}
          {lead.origin && <Badge variant="secondary" className="text-xs">{lead.origin}</Badge>}
        </div>
        {lead.last_contact_at && (
          <p className="text-xs text-muted-foreground">
            Último contato: {formatRelativeTime(lead.last_contact_at)}
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-3">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onView?.(lead)}
          data-testid={`button-view-${lead.id}`}
        >
          <Eye className="h-4 w-4 mr-1" />
          Ver Detalhes
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
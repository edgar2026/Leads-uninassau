import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Eye } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatRelativeTime } from "@/lib/utils";
import type { LeadFromSupabase } from "@/hooks/useLeadsPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface LeadsTableProps {
  leads: LeadFromSupabase[];
  isLoading: boolean;
  onEdit: (lead: LeadFromSupabase) => void;
  onDelete: (lead: LeadFromSupabase) => void;
  onView: (lead: LeadFromSupabase) => void;
}

export function LeadsTable({ leads, isLoading, onEdit, onDelete, onView }: LeadsTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Etapa</TableHead>
            <TableHead>Último Contato</TableHead>
            <TableHead className="text-right w-[80px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={5}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id} data-testid={`row-lead-${lead.id}`}>
                <TableCell className="font-medium">
                  <div>{lead.name}</div>
                  <div className="text-xs text-muted-foreground">{lead.email}</div>
                </TableCell>
                <TableCell>{lead.courses?.name || "N/A"}</TableCell>
                <TableCell>
                  <StatusBadge status={lead.status || "morno"} />
                </TableCell>
                <TableCell>{lead.lead_stages?.name || "N/A"}</TableCell>
                <TableCell>{lead.last_contact_at ? formatRelativeTime(lead.last_contact_at) : "Nenhum"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(lead)}>
                        <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(lead)}>
                        <Edit className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(lead)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { LeadCard } from "@/components/LeadCard";
import { LeadFormModal } from "@/components/LeadFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, LayoutGrid, List } from "lucide-react";
import { useLeadsPanel, type LeadFromSupabase } from "@/hooks/useLeadsPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadsTable } from "@/components/LeadsTable";
import { DeleteLeadDialog } from "@/components/DeleteLeadDialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function LeadsPanel() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [cursoFilter, setCursoFilter] = useState<string>("todos");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Partial<LeadFromSupabase> | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [leadToDelete, setLeadToDelete] = useState<LeadFromSupabase | undefined>(undefined);

  const { leads, courses, origins, courseTypes, leadStages, createLead, updateLead, deleteLead, isLoading } = useLeadsPanel();

  const handleSaveLead = (leadData: any) => {
    if (leadData.id) {
      updateLead.mutate(leadData);
    } else {
      createLead.mutate(leadData);
    }
  };

  const openNewLeadModal = () => {
    setSelectedLead(undefined);
    setShowLeadModal(true);
  };

  const openEditLeadModal = (lead: any) => {
    const leadToEdit = leads?.find(l => l.id === lead.id);
    setSelectedLead(leadToEdit);
    setShowLeadModal(true);
  };

  const handleDeleteRequest = (lead: any) => {
    const leadToDelete = leads?.find(l => l.id === lead.id);
    setLeadToDelete(leadToDelete);
  };

  const handleConfirmDelete = () => {
    if (leadToDelete) {
      deleteLead.mutate(leadToDelete.id);
      setLeadToDelete(undefined);
    }
  };

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    
    return leads.filter((lead) => {
      const leadName = lead.name?.toLowerCase() || "";
      const leadPhone = lead.phone || "";
      const leadEmail = lead.email?.toLowerCase() || "";
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearch =
        leadName.includes(searchTermLower) ||
        leadPhone.includes(searchTerm) ||
        leadEmail.includes(searchTermLower);

      const matchesStatus = statusFilter === "todos" || lead.status === statusFilter;
      const matchesCurso = cursoFilter === "todos" || lead.course_id === cursoFilter;

      return matchesSearch && matchesStatus && matchesCurso;
    });
  }, [leads, searchTerm, statusFilter, cursoFilter]);

  const mappedLeadsForCard = filteredLeads.map(lead => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    courseName: lead.courses?.name || 'N/A',
    origin: lead.origins?.name || 'N/A',
    status: lead.status || 'morno',
    stage: (lead.lead_stages?.name?.toLowerCase().replace('í', 'i').replace('ã', 'a') as any) || 'contato',
    last_contact_at: lead.last_contact_at,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-leads-title">Meus Leads</h1>
          <p className="text-muted-foreground mt-1">Gerencie e acompanhe seus leads</p>
        </div>
        <Button data-testid="button-add-lead" onClick={openNewLeadModal}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4 flex-wrap flex-1">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="quente">🔥 Quente</SelectItem>
              <SelectItem value="morno">🟡 Morno</SelectItem>
              <SelectItem value="frio">🧊 Frio</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
              <SelectItem value="matriculado">Matriculado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={cursoFilter} onValueChange={setCursoFilter}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-curso">
              <SelectValue placeholder="Curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os cursos</SelectItem>
              {courses?.map(course => (
                <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as any)}>
          <ToggleGroupItem value="card" aria-label="Visualização em cards"><LayoutGrid className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Visualização em tabela"><List className="h-4 w-4" /></ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)
          ) : (
            mappedLeadsForCard.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={openEditLeadModal}
                onView={(l) => setLocation(`/lead/${l.id}`)}
                onDelete={handleDeleteRequest}
              />
            ))
          )}
        </div>
      ) : (
        <LeadsTable
          leads={filteredLeads}
          isLoading={isLoading}
          onEdit={openEditLeadModal}
          onDelete={handleDeleteRequest}
          onView={(l) => setLocation(`/lead/${l.id}`)}
        />
      )}

      {(!isLoading && filteredLeads.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum lead encontrado</p>
        </div>
      )}

      <LeadFormModal
        open={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSave={handleSaveLead}
        lead={selectedLead}
        courses={courses || []}
        origins={origins || []}
        courseTypes={courseTypes || []}
        leadStages={leadStages || []}
      />

      <DeleteLeadDialog
        open={!!leadToDelete}
        onOpenChange={(open) => !open && setLeadToDelete(undefined)}
        onConfirm={handleConfirmDelete}
        leadName={leadToDelete?.name || ""}
      />
    </div>
  );
}
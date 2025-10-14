import { useState } from "react";
import { useLocation } from "wouter";
import { LeadCard, type Lead } from "@/components/LeadCard";
import { LeadFormModal } from "@/components/LeadFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";

// TODO: remove mock functionality
const mockLeads: Lead[] = [
  {
    id: "1",
    nome: "Maria Santos",
    telefone: "(11) 98765-4321",
    email: "maria.santos@email.com",
    curso: "Administração",
    origem: "Site",
    status: "quente",
    etapa: "interesse",
    ultimoContato: "2 horas atrás",
  },
  {
    id: "2",
    nome: "João Oliveira",
    telefone: "(21) 97654-3210",
    email: "joao.oliveira@email.com",
    curso: "Engenharia",
    origem: "Feira",
    status: "morno",
    etapa: "contato",
    ultimoContato: "1 dia atrás",
  },
  {
    id: "3",
    nome: "Ana Costa",
    telefone: "(31) 96543-2109",
    email: "ana.costa@email.com",
    curso: "Direito",
    origem: "Indicação",
    status: "frio",
    etapa: "prova",
    ultimoContato: "5 dias atrás",
  },
  {
    id: "4",
    nome: "Pedro Almeida",
    telefone: "(41) 95432-1098",
    email: "pedro.almeida@email.com",
    curso: "Medicina",
    origem: "Site",
    status: "quente",
    etapa: "matricula",
    ultimoContato: "1 hora atrás",
  },
  {
    id: "5",
    nome: "Carla Mendes",
    telefone: "(51) 94321-0987",
    email: "carla.mendes@email.com",
    curso: "Psicologia",
    origem: "Feira",
    status: "matriculado",
    etapa: "matricula",
    ultimoContato: "Hoje",
  },
  {
    id: "6",
    nome: "Roberto Silva",
    telefone: "(61) 93210-9876",
    email: "roberto.silva@email.com",
    curso: "Administração",
    origem: "Site",
    status: "morno",
    etapa: "interesse",
    ultimoContato: "3 dias atrás",
  },
];

export default function LeadsPanel() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [cursoFilter, setCursoFilter] = useState<string>("todos");
  const [showLeadModal, setShowLeadModal] = useState(false);

  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "todos" || lead.status === statusFilter;
    const matchesCurso = cursoFilter === "todos" || lead.curso === cursoFilter;

    return matchesSearch && matchesStatus && matchesCurso;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-leads-title">Meus Leads</h1>
          <p className="text-muted-foreground mt-1">Gerencie e acompanhe seus leads</p>
        </div>
        <Button data-testid="button-add-lead" onClick={() => setShowLeadModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
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
          <SelectTrigger className="w-[180px]" data-testid="select-status">
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
          <SelectTrigger className="w-[180px]" data-testid="select-curso">
            <SelectValue placeholder="Curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os cursos</SelectItem>
            <SelectItem value="Administração">Administração</SelectItem>
            <SelectItem value="Engenharia">Engenharia</SelectItem>
            <SelectItem value="Direito">Direito</SelectItem>
            <SelectItem value="Medicina">Medicina</SelectItem>
            <SelectItem value="Psicologia">Psicologia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onEdit={(l) => console.log("Edit lead:", l)}
            onView={(l) => setLocation(`/lead/${l.id}`)}
          />
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum lead encontrado</p>
        </div>
      )}

      <LeadFormModal
        open={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSave={(lead) => console.log("Saved lead:", lead)}
      />
    </div>
  );
}

import { LeadCard, type Lead } from "../LeadCard";

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
];

export default function LeadCardExample() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Lead Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onEdit={(l) => console.log("Edit lead:", l)}
            onView={(l) => console.log("View lead:", l)}
          />
        ))}
      </div>
    </div>
  );
}

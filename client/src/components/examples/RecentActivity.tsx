import { RecentActivity } from "../RecentActivity";

const mockActivities = [
  {
    id: "1",
    tipo: "novo_lead" as const,
    descricao: "Novo lead cadastrado: Ana Silva",
    usuario: "João Silva",
    tempo: "5 min atrás",
  },
  {
    id: "2",
    tipo: "ligacao" as const,
    descricao: "Ligação realizada com Maria Santos",
    usuario: "Pedro Costa",
    tempo: "1 hora atrás",
  },
  {
    id: "3",
    tipo: "email" as const,
    descricao: "E-mail enviado para Carlos Oliveira",
    usuario: "Ana Rodrigues",
    tempo: "2 horas atrás",
  },
];

export default function RecentActivityExample() {
  return (
    <div className="p-8 max-w-2xl">
      <RecentActivity activities={mockActivities} />
    </div>
  );
}

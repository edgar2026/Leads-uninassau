import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GraduationCap } from "lucide-react";

// TODO: remove mock functionality
const mockCursos = [
  { id: "1", nome: "Administração", totalLeads: 89, ativo: true },
  { id: "2", nome: "Engenharia", totalLeads: 67, ativo: true },
  { id: "3", nome: "Direito", totalLeads: 45, ativo: true },
  { id: "4", nome: "Medicina", totalLeads: 23, ativo: true },
  { id: "5", nome: "Psicologia", totalLeads: 23, ativo: true },
];

export default function Cursos() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Cursos</h1>
          <p className="text-muted-foreground mt-1">Gerencie os cursos disponíveis</p>
        </div>
        <Button data-testid="button-add-curso" onClick={() => console.log("Add curso triggered")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCursos.map((curso) => (
          <Card key={curso.id} className="hover-elevate" data-testid={`card-curso-${curso.id}`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{curso.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground">{curso.totalLeads} leads</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => console.log("Edit:", curso)}>
                Editar
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => console.log("View:", curso)}>
                Ver Leads
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

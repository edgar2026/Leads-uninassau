import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-1">Personalize o sistema</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a aparência do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Tema</Label>
                <p className="text-sm text-muted-foreground">Alternar entre modo claro e escuro</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perfil do Usuário</CardTitle>
            <CardDescription>Atualize suas informações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" defaultValue="João Silva" data-testid="input-nome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" defaultValue="joao.silva@instituicao.edu.br" data-testid="input-email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input id="cargo" defaultValue="Comercial" disabled data-testid="input-cargo" />
            </div>
            <Button onClick={() => console.log("Save triggered")} data-testid="button-save">
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critérios de Temperatura</CardTitle>
            <CardDescription>Defina quando um lead é considerado quente, morno ou frio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>🔥 Quente - Último contato há menos de</Label>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="3" className="w-24" />
                <span>dias</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>🟡 Morno - Último contato entre</Label>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="3" className="w-24" />
                <span>e</span>
                <Input type="number" defaultValue="7" className="w-24" />
                <span>dias</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>🧊 Frio - Último contato há mais de</Label>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="7" className="w-24" />
                <span>dias</span>
              </div>
            </div>
            <Button onClick={() => console.log("Save criteria triggered")}>
              Salvar Critérios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

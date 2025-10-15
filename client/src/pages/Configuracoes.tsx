import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Plus } from "lucide-react";
import { useAdminManagement, type Course, type Origin, type CourseType, type LeadStage, type Profile } from "@/hooks/useAdminManagement";
import { ManagementTable } from "@/components/ManagementTable";
import { ManagementFormModal } from "@/components/ManagementFormModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type Item = Course | Origin | CourseType | LeadStage;
type EntityType = 'courses' | 'origins' | 'course_types' | 'lead_stages';

type ModalState = {
  isOpen: boolean;
  item?: Item;
  type: EntityType | null;
};

type DeleteDialogState = {
  isOpen: boolean;
  item?: Item;
  type: EntityType | null;
};

export default function Configuracoes() {
  const { courses, origins, courseTypes, leadStages, profiles, isLoading, createEntity, updateEntity, deleteEntity, updateUserRole } = useAdminManagement();
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: null });
  const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>({ isOpen: false, type: null });

  const openModal = (type: EntityType, item?: Item) => {
    setModalState({ isOpen: true, type, item });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, item: undefined });
  };

  const openDeleteDialog = (type: EntityType, item: Item) => {
    setDeleteDialogState({ isOpen: true, type, item });
  };

  const closeDeleteDialog = () => {
    setDeleteDialogState({ isOpen: false, type: null, item: undefined });
  };

  const handleSave = (data: { id?: string; name: string; type_id?: string }) => {
    if (modalState.type) {
      if (data.id) {
        updateEntity.mutate({ entity: modalState.type, id: data.id, name: data.name, type_id: data.type_id });
      } else {
        createEntity.mutate({ entity: modalState.type, name: data.name, type_id: data.type_id });
      }
    }
  };

  const handleDelete = () => {
    if (deleteDialogState.item && deleteDialogState.type) {
      deleteEntity.mutate({ entity: deleteDialogState.type, id: deleteDialogState.item.id });
      closeDeleteDialog();
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    updateUserRole.mutate({ userId, newRole });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-1">Personalize e gerencie o sistema</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label>Tema (Claro/Escuro)</Label>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <CardDescription>
              Visualize e edite os cargos dos usuários do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[200px]">Cargo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  profiles?.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">{profile.full_name}</TableCell>
                      <TableCell>
                        <Select
                          value={profile.role}
                          onValueChange={(newRole) => handleRoleChange(profile.id, newRole)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Administrador">Administrador</SelectItem>
                            <SelectItem value="Diretor">Diretor</SelectItem>
                            <SelectItem value="Coordenador">Coordenador</SelectItem>
                            <SelectItem value="QG">QG</SelectItem>
                            <SelectItem value="Comercial">Comercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gerenciar Cursos</CardTitle>
              <CardDescription>Adicione, edite ou remova cursos.</CardDescription>
            </div>
            <Button size="sm" onClick={() => openModal('courses')}>
              <Plus className="h-4 w-4 mr-2" /> Novo Curso
            </Button>
          </CardHeader>
          <CardContent>
            <ManagementTable
              data={courses?.map(c => ({...c, type: (c as any).course_types?.name}))}
              isLoading={isLoading}
              onEdit={(item) => openModal('courses', item)}
              onDelete={(item) => openDeleteDialog('courses', item)}
              headers={["Nome", "Tipo"]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gerenciar Origens de Lead</CardTitle>
              <CardDescription>Adicione, edite ou remova as origens dos leads.</CardDescription>
            </div>
            <Button size="sm" onClick={() => openModal('origins')}>
              <Plus className="h-4 w-4 mr-2" /> Nova Origem
            </Button>
          </CardHeader>
          <CardContent>
            <ManagementTable
              data={origins}
              isLoading={isLoading}
              onEdit={(item) => openModal('origins', item)}
              onDelete={(item) => openDeleteDialog('origins', item)}
              headers={["Nome"]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gerenciar Tipos de Curso</CardTitle>
              <CardDescription>Adicione ou remova os tipos de curso (ex: EAD).</CardDescription>
            </div>
            <Button size="sm" onClick={() => openModal('course_types')}>
              <Plus className="h-4 w-4 mr-2" /> Novo Tipo
            </Button>
          </CardHeader>
          <CardContent>
            <ManagementTable
              data={courseTypes}
              isLoading={isLoading}
              onEdit={(item) => openModal('course_types', item)}
              onDelete={(item) => openDeleteDialog('course_types', item)}
              headers={["Nome"]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gerenciar Etapas do Funil</CardTitle>
              <CardDescription>Personalize as etapas do seu funil de vendas.</CardDescription>
            </div>
            <Button size="sm" onClick={() => openModal('lead_stages')}>
              <Plus className="h-4 w-4 mr-2" /> Nova Etapa
            </Button>
          </CardHeader>
          <CardContent>
            <ManagementTable
              data={leadStages}
              isLoading={isLoading}
              onEdit={(item) => openModal('lead_stages', item)}
              onDelete={(item) => openDeleteDialog('lead_stages', item)}
              headers={["Nome"]}
            />
          </CardContent>
        </Card>
      </div>

      <ManagementFormModal
        open={modalState.isOpen}
        onClose={closeModal}
        onSave={handleSave}
        item={modalState.item}
        title={
          modalState.type === 'courses' ? 'Curso' :
          modalState.type === 'origins' ? 'Origem' :
          modalState.type === 'course_types' ? 'Tipo de Curso' : 'Etapa do Funil'
        }
        hasTypeField={modalState.type === 'courses'}
        courseTypes={courseTypes}
      />

      <AlertDialog open={deleteDialogState.isOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o item
              "{deleteDialogState.item?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
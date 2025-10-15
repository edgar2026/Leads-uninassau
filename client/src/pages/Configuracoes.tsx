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
import { useAdminManagement, type Course, type Origin } from "@/hooks/useAdminManagement";
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

type ModalState = {
  isOpen: boolean;
  item?: Course | Origin;
  type: 'course' | 'origin' | null;
};

type DeleteDialogState = {
  isOpen: boolean;
  item?: Course | Origin;
  type: 'course' | 'origin' | null;
};

export default function Configuracoes() {
  const { courses, origins, isLoading, createEntity, updateEntity, deleteEntity } = useAdminManagement();
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: null });
  const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>({ isOpen: false, type: null });

  const openModal = (type: 'course' | 'origin', item?: Course | Origin) => {
    setModalState({ isOpen: true, type, item });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, item: undefined });
  };

  const openDeleteDialog = (type: 'course' | 'origin', item: Course | Origin) => {
    setDeleteDialogState({ isOpen: true, type, item });
  };

  const closeDeleteDialog = () => {
    setDeleteDialogState({ isOpen: false, type: null, item: undefined });
  };

  const handleSave = (data: { id?: string; name: string; type?: string }) => {
    const entity = modalState.type === 'course' ? 'courses' : 'origins';
    if (data.id) {
      updateEntity.mutate({ entity, id: data.id, name: data.name, type: data.type });
    } else {
      createEntity.mutate({ entity, name: data.name, type: data.type });
    }
  };

  const handleDelete = () => {
    if (deleteDialogState.item && deleteDialogState.type) {
      const entity = deleteDialogState.type === 'course' ? 'courses' : 'origins';
      deleteEntity.mutate({ entity, id: deleteDialogState.item.id });
      closeDeleteDialog();
    }
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gerenciar Cursos</CardTitle>
              <CardDescription>Adicione, edite ou remova cursos.</CardDescription>
            </div>
            <Button size="sm" onClick={() => openModal('course')}>
              <Plus className="h-4 w-4 mr-2" /> Novo Curso
            </Button>
          </CardHeader>
          <CardContent>
            <ManagementTable
              data={courses}
              isLoading={isLoading}
              onEdit={(item) => openModal('course', item)}
              onDelete={(item) => openDeleteDialog('course', item)}
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
            <Button size="sm" onClick={() => openModal('origin')}>
              <Plus className="h-4 w-4 mr-2" /> Nova Origem
            </Button>
          </CardHeader>
          <CardContent>
            <ManagementTable
              data={origins}
              isLoading={isLoading}
              onEdit={(item) => openModal('origin', item)}
              onDelete={(item) => openDeleteDialog('origin', item)}
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
        title={modalState.type === 'course' ? 'Curso' : 'Origem'}
        hasType={modalState.type === 'course'}
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
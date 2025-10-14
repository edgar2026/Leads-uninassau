import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Skeleton } from "@/components/ui/skeleton";

const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function UserProfileCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({ full_name: profile.full_name || "" });
    }
  }, [profile, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!user) throw new Error("Usuário não autenticado.");
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: values.full_name, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Seu perfil foi atualizado.",
      });
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      // Also invalidate the auth context's profile data if it's separate
      queryClient.invalidateQueries({ queryKey: ["authProfile"] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
          <CardDescription>Atualize suas informações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil do Usuário</CardTitle>
        <CardDescription>Atualize suas informações</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutate(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-nome" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>E-mail</FormLabel>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Cargo</FormLabel>
              <Input
                value={profile?.role || ""}
                disabled
                data-testid="input-cargo"
              />
            </div>
            <Button type="submit" disabled={isPending} data-testid="button-save">
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

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
            <CardDescription>
              Personalize a aparência do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Tema</Label>
                <p className="text-sm text-muted-foreground">
                  Alternar entre modo claro e escuro
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <UserProfileCard />

        <Card>
          <CardHeader>
            <CardTitle>Critérios de Temperatura</CardTitle>
            <CardDescription>
              Defina quando um lead é considerado quente, morno ou frio
            </CardDescription>
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
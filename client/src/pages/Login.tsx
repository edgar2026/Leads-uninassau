import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Login() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setLocation("/", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Sistema CRM Educacional</CardTitle>
            <CardDescription>Entre ou crie sua conta para acessar</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            localization={{
              variables: {
                sign_up: {
                  email_label: "E-mail",
                  password_label: "Senha",
                  button_label: "Cadastrar",
                  social_provider_text: "Entrar com {{provider}}",
                  link_text: "Não tem uma conta? Cadastre-se",
                  confirmation_text: "Verifique seu e-mail para o link de confirmação"
                },
                sign_in: {
                  email_label: "E-mail",
                  password_label: "Senha",
                  button_label: "Entrar",
                  social_provider_text: "Entrar com {{provider}}",
                  link_text: "Já tem uma conta? Entre",
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
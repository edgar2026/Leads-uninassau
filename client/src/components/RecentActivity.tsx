import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Phone, Mail, MessageSquare, Calendar, UserPlus } from "lucide-react";

interface Activity {
  id: string;
  tipo: "ligacao" | "email" | "whatsapp" | "reuniao" | "novo_lead";
  descricao: string;
  usuario: string;
  tempo: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const iconMap = {
  ligacao: Phone,
  email: Mail,
  whatsapp: MessageSquare,
  reuniao: Calendar,
  novo_lead: UserPlus,
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card data-testid="card-activity">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = iconMap[activity.tipo];
          return (
            <div
              key={activity.id}
              className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
              data-testid={`activity-${activity.id}`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.descricao}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.usuario} • {activity.tempo}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

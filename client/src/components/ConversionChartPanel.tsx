import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays, subMonths, startOfDay, endOfDay, startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConversionChart } from "@/components/ConversionChart";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversionData {
  periodo: string;
  [key: string]: string | number;
}

// --- Funções de busca ---

async function fetchCourses() {
  const { data, error } = await supabase.from("courses").select("id, name, type");
  if (error) throw new Error(error.message);
  return data;
}

async function fetchConversionData(period: string, courseType: string, courseId: string) {
  let startDate: Date;
  const now = new Date();

  switch (period) {
    case "day":
      startDate = startOfDay(now);
      break;
    case "month":
      startDate = startOfMonth(now);
      break;
    case "total":
    default:
      startDate = new Date(0); // From the beginning of time
      break;
  }

  let query = supabase
    .from("leads")
    .select("created_at, owner_id, course_id, profiles!inner(full_name, role), courses!inner(name, type)")
    .eq("status", "matriculado")
    .in("profiles.role", ["Comercial", "QG"])
    .gte("created_at", startDate.toISOString());

  if (courseType !== "todos") {
    query = query.eq("courses.type", courseType);
  }
  if (courseId !== "todos") {
    query = query.eq("course_id", courseId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

// --- Componente ---

export function ConversionChartPanel() {
  const [period, setPeriod] = useState("month");
  const [courseType, setCourseType] = useState("todos");
  const [courseId, setCourseId] = useState("todos");

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["coursesList"],
    queryFn: fetchCourses,
  });

  const { data: rawData, isLoading: isLoadingData } = useQuery({
    queryKey: ["conversionData", period, courseType, courseId],
    queryFn: () => fetchConversionData(period, courseType, courseId),
  });

  const filteredCourses = useMemo(() => {
    if (courseType === "todos") return courses;
    return courses?.filter((c) => c.type === courseType);
  }, [courses, courseType]);

  const { chartData, vendedores } = useMemo(() => {
    if (!rawData) return { chartData: [], vendedores: [] };

    const dateFormat = period === "day" ? "HH:00" : "dd/MM";
    
    const grouped = rawData.reduce((acc, lead) => {
      const date = format(new Date(lead.created_at), dateFormat, { locale: ptBR });
      const vendedor = lead.profiles?.full_name || "Desconhecido";
      
      if (!acc[date]) acc[date] = { periodo: date };
      if (!acc[date][vendedor]) acc[date][vendedor] = 0;
      acc[date][vendedor]++;
      
      return acc;
    }, {} as Record<string, ConversionData>);

    const chartData = Object.values(grouped).sort((a, b) => a.periodo.localeCompare(b.periodo));
    const vendedores = [...new Set(rawData.map(lead => lead.profiles?.full_name || "Desconhecido"))];

    return { chartData, vendedores };
  }, [rawData, period]);

  const isLoading = isLoadingCourses || isLoadingData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversões por Período</CardTitle>
        <div className="flex gap-2 flex-wrap pt-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoje</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="total">Período Total</SelectItem>
            </SelectContent>
          </Select>
          <Select value={courseType} onValueChange={(value) => { setCourseType(value); setCourseId("todos"); }}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              <SelectItem value="Pós-graduação">Pós-graduação</SelectItem>
              <SelectItem value="EAD">EAD</SelectItem>
              <SelectItem value="Presencial">Presencial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={courseId} onValueChange={setCourseId} disabled={!filteredCourses}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Cursos</SelectItem>
              {filteredCourses?.map(course => (
                <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px]" />
        ) : (
          <ConversionChart data={chartData} vendedores={vendedores} />
        )}
      </CardContent>
    </Card>
  );
}
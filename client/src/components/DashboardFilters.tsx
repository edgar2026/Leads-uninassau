import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardFiltersProps {
  dateRange: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  courseType: string;
  onCourseTypeChange: (type: string) => void;
}

export function DashboardFilters({
  dateRange,
  onDateChange,
  courseType,
  onCourseTypeChange,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y", { locale: ptBR })} -{" "}
                  {format(dateRange.to, "LLL dd, y", { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto" align="start">
          <div className="p-4 pb-2 text-sm text-muted-foreground">
            Selecione a data de início e a data de fim.
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateChange}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>

      <Select value={courseType} onValueChange={onCourseTypeChange}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Tipo de Curso" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os Tipos</SelectItem>
          <SelectItem value="Presencial">Presencial</SelectItem>
          <SelectItem value="EAD">EAD</SelectItem>
          <SelectItem value="Pós-graduação">Pós-graduação</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
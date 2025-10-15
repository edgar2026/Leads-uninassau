import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2 } from "lucide-react";

interface ManagementTableProps<T extends { id: string; name: string; type?: string }> {
  data: T[] | undefined;
  isLoading: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  headers: string[];
}

export function ManagementTable<T extends { id: string; name: string; type?: string }>({
  data,
  isLoading,
  onEdit,
  onDelete,
  headers,
}: ManagementTableProps<T>) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map(header => <TableHead key={header}>{header}</TableHead>)}
            <TableHead className="text-right w-[120px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={headers.length}><Skeleton className="h-5 w-full" /></TableCell>
                <TableCell><Skeleton className="h-8 w-full" /></TableCell>
              </TableRow>
            ))
          ) : (
            data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                {item.type && <TableCell>{item.type}</TableCell>}
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(item)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Status Badges</h2>
      <div className="flex gap-2 flex-wrap">
        <StatusBadge status="quente" />
        <StatusBadge status="morno" />
        <StatusBadge status="frio" />
        <StatusBadge status="perdido" />
        <StatusBadge status="matriculado" />
      </div>
    </div>
  );
}

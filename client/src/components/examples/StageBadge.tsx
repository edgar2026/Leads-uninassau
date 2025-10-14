import { StageBadge } from "../StageBadge";

export default function StageBadgeExample() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Stage Badges</h2>
      <div className="flex gap-2 flex-wrap">
        <StageBadge stage="contato" />
        <StageBadge stage="interesse" />
        <StageBadge stage="prova" />
        <StageBadge stage="matricula" />
      </div>
    </div>
  );
}

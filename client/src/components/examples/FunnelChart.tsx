import { FunnelChart } from "../FunnelChart";

const mockData = [
  { name: "Contato", value: 247, percentage: 100 },
  { name: "Interesse", value: 156, percentage: 63 },
  { name: "Prova", value: 98, percentage: 40 },
  { name: "Matrícula", value: 52, percentage: 21 },
];

export default function FunnelChartExample() {
  return (
    <div className="p-8 max-w-2xl">
      <FunnelChart data={mockData} />
    </div>
  );
}

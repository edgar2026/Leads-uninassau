import { ConversionChart } from "../ConversionChart";

const mockData = [
  { periodo: "Sem 1", "João Silva": 12, "Maria Costa": 15, "Pedro Santos": 8 },
  { periodo: "Sem 2", "João Silva": 15, "Maria Costa": 18, "Pedro Santos": 10 },
  { periodo: "Sem 3", "João Silva": 18, "Maria Costa": 14, "Pedro Santos": 12 },
  { periodo: "Sem 4", "João Silva": 20, "Maria Costa": 20, "Pedro Santos": 15 },
];

export default function ConversionChartExample() {
  return (
    <div className="p-8">
      <ConversionChart data={mockData} consultores={["João Silva", "Maria Costa", "Pedro Santos"]} />
    </div>
  );
}
import { TemperatureDistribution } from "../TemperatureDistribution";

const mockData = [
  { name: "Quente", value: 89, emoji: "🔥" },
  { name: "Morno", value: 102, emoji: "🟡" },
  { name: "Frio", value: 56, emoji: "🧊" },
];

export default function TemperatureDistributionExample() {
  return (
    <div className="p-8 max-w-xl">
      <TemperatureDistribution data={mockData} />
    </div>
  );
}

import { LeadsByOriginChart } from "../LeadsByOriginChart";

const mockData = [
  { origem: "Site", total: 89 },
  { origem: "Feira", total: 67 },
  { origem: "Indicação", total: 45 },
  { origem: "Google Ads", total: 32 },
  { origem: "Redes Sociais", total: 14 },
];

export default function LeadsByOriginChartExample() {
  return (
    <div className="p-8">
      <LeadsByOriginChart data={mockData} />
    </div>
  );
}

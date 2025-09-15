import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export type ChartConfig = {
  type: "doughnut" | "bar";
  data: any;
  options?: any;
};

export default function ChartWidget({ config }: { config: ChartConfig }) {
  if (config.type === "doughnut") return <Doughnut data={config.data} options={config.options} />;
  if (config.type === "bar") return <Bar data={config.data} options={config.options} />;
  return null;
}

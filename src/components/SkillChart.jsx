import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
export default function SkillChart({ data = [] }) {
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 15, right: 20 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip formatter={(v) => [`${v}%`, "Evidence"]} />
          <Bar dataKey="score" radius={[0, 8, 8, 0]} fill="#85586F" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

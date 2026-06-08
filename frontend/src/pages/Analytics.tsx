import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Technical", value: 40 },
  { name: "Leadership", value: 30 },
  { name: "Soft Skills", value: 30 },
];

export default function Analytics() {
  return (
    <div className="min-h-screen bg-[#070B1A] text-white p-6">

      <h1 className="text-4xl font-bold">
        Career Analytics
      </h1>

      <div className="mt-10 bg-[#111827] p-6 rounded-3xl">

        <h2 className="text-xl font-semibold mb-5">
          Skill Distribution
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                outerRadius={100}
              >
                <Cell fill="#8B5CF6" />
                <Cell fill="#6366F1" />
                <Cell fill="#A78BFA" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
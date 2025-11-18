// file: UI/src/components/ChartPanel.jsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";

export default function ChartPanel({ data = [], meta = {} }) {
  const xKey = meta.xKey || "time";
  const yKey = meta.yKey || "value";
  const chartType = meta.chartType || "line";

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div style={{ fontSize: 13, color: "#666" }}>No chart data</div>;
  }

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        {chartType === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yKey} dot={false} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

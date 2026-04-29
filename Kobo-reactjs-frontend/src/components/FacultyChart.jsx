import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import "./FacultyChart.css";

const COLORS = [
  "#667eea",
  "#764ba2",
  "#f093fb",
  "#f5576c",
  "#4facfe",
  "#00f2fe",
  "#43e97b",
  "#fa709a",
  "#fee140",
  "#30cfd0",
];

function FacultyChart({ data }) {
  console.log("FacultyChart received data:", data);

  if (!data || data.length === 0) {
    return (
      <div className="faculty-chart-container">
        <p className="no-chart-data">No data available for chart</p>
      </div>
    );
  }

  const totalStudents = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="faculty-chart-container">
      <div className="chart-header">
        <h3 className="chart-title">📊 Faculty Distribution</h3>
        <p className="chart-subtitle">Total Students: {totalStudents}</p>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, value, percent }) =>
                `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} students`, "Count"]}
              contentStyle={{
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(102, 126, 234, 0.3)",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
              cursor={{ fill: "rgba(102, 126, 234, 0.1)" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                paddingTop: "20px",
                color: "#cbd5e1",
              }}
              formatter={(value, entry) => (
                <span style={{ color: "#cbd5e1", fontSize: "13px" }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-stats">
        <div className="stats-grid">
          {data.map((item, index) => (
            <div key={item.name} className="stat-item">
              <div
                className="stat-color"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <div className="stat-content">
                <p className="stat-name">{item.name}</p>
                <p className="stat-value">
                  {item.value} students
                  <span className="stat-percent">
                    {((item.value / totalStudents) * 100).toFixed(1)}%
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FacultyChart;

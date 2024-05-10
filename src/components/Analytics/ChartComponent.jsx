// components/Analytics/ChartComponent.jsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const ChartComponent = ({ filters }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Fetch data based on filters and set the chart data
    // For example, you might fetch data from an API endpoint like:
    // fetch(`api/data?weather=${filters.weather}&courseDifficulty=${filters.courseDifficulty}&holeDescription=${filters.holeDescription}`)
    //   .then(response => response.json())
    //   .then(data => setChartData(data));

    // For now, we’ll use some dummy data:
    const dummyData = {
      labels: ["Hole 1", "Hole 2", "Hole 3", "Hole 4", "Hole 5"],
      datasets: [
        {
          label: "Score",
          data: [3, 2, 4, 3, 5],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
    setChartData(dummyData);
  }, [filters]);

  return (
    <div>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default ChartComponent;

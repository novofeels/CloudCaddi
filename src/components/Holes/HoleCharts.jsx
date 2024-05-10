import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ArcElement,
  Filler,
} from "chart.js";
import { getHoleScoresByHoleId } from "../../services/HoleService";
import "./HoleCharts.css";
import { getAllScoreCards } from "../../services/ScoreCardService";
import animatedGif from "../../assets/OwlbertEinsteinGif.gif";
import staticGif from "../../assets/OwlbertEinsteinGif.gif";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ArcElement,
  Filler
);

export const HoleCharts = ({ currentUser, holeId }) => {
  const [holeScores, setHoleScores] = useState([]);
  const [lineChartData, setLineChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [scoreCards, setScoreCards] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [chartType, setChartType] = useState("line"); // State for toggling chart type
  const [chartKey, setChartKey] = useState(0); // Key to force re-render

  useEffect(() => {
    const fetchData = async () => {
      const hsObjs = await getHoleScoresByHoleId(holeId);
      const scObjs = await getAllScoreCards();
      setHoleScores(hsObjs);
      setScoreCards(scObjs);
      processHoleScores(hsObjs, scObjs);
    };

    fetchData();
  }, [holeId]);

  const processHoleScores = (holeScores, scoreCards) => {
    const combinedData = holeScores
      .map((holeScore) => {
        const thisScoreCard = scoreCards.find(
          (sc) => sc.id === holeScore.scoreCardId
        );
        if (thisScoreCard && thisScoreCard.date) {
          const dateInMillis =
            thisScoreCard.date.toString().length === 13
              ? thisScoreCard.date
              : thisScoreCard.date * 1000;
          return {
            ...holeScore,
            date: dateInMillis,
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    // Sort by date
    combinedData.sort((a, b) => a.date - b.date);

    const dates = [];
    const totalStrokes = [];
    const averageScores = [];
    const parValues = [];
    const strokeCategories = {
      "Hole-in-One": 0,
      Birdie: 0,
      Par: 0,
      Bogey: 0,
      "Double Bogey": 0,
    };

    // Calculate total strokes and collect dates
    combinedData.forEach((data) => {
      const date = new Date(data.date).toLocaleDateString();
      dates.push(date);
      totalStrokes.push(data.score);
      parValues.push(data.par);

      // Categorize strokes for pie chart
      const strokeDifference = data.score - data.par;
      if (data.score === 1) {
        strokeCategories["Hole-in-One"] += 1;
      } else if (strokeDifference === -1) {
        strokeCategories.Birdie += 1;
      } else if (strokeDifference === 0) {
        strokeCategories.Par += 1;
      } else if (strokeDifference === 1) {
        strokeCategories.Bogey += 1;
      } else if (strokeDifference >= 2) {
        strokeCategories["Double Bogey"] += 1;
      }
    });

    // Calculate the average score
    const total = totalStrokes.reduce((sum, score) => sum + score, 0);
    const averageStroke = total / totalStrokes.length;

    // Fill the averageScores array with the average score
    for (let i = 0; i < totalStrokes.length; i++) {
      averageScores.push(averageStroke);
    }

    // Calculate suggestedMax for the y-axis
    const suggestedMax = Math.max(...totalStrokes) + 1;

    setLineChartData({
      labels: dates,
      datasets: [
        {
          label: "Total Strokes",
          data: totalStrokes,
          borderColor: "#00FF00", // Bright green for Pip-Boy style
          backgroundColor: "rgba(0, 255, 0, 0.1)",
          pointBackgroundColor: "#00FF00",
          pointStyle: "rect",
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.5)",
          tension: 0, // Sharp lines
          fill: true,
        },
        {
          label: "Average Strokes",
          data: averageScores,
          borderColor: "#FFFF00", // Yellow for average
          backgroundColor: "#FFFF00",
          borderDash: [5, 5],
          pointStyle: "circle",
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.5)",
          tension: 0, // Sharp lines
          fill: false,
        },
        {
          label: "Par",
          data: parValues,
          borderColor: "#FF0000", // Red for par
          backgroundColor: "#FF0000",
          pointStyle: "triangle",
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.5)",
          tension: 0, // Sharp lines
          fill: false,
        },
      ],
    });

    const activeCategories = Object.keys(strokeCategories).filter(
      (key) => strokeCategories[key] > 0
    );

    const categoryColors = {
      "Hole-in-One": "rgba(255, 255, 255, 0.1)", // White for Hole-in-One
      Birdie: "rgba(255, 223, 0, 0.3)", // Gold for Birdie
      Par: "rgba(0, 255, 0, 0.3)", // Green for Par
      Bogey: "rgba(255, 0, 0, 0.3)", // Red for Bogey
      "Double Bogey": "rgba(128, 0, 128, 0.3)", // Purple for Double Bogey
    };

    setPieChartData({
      labels: activeCategories,
      datasets: [
        {
          data: activeCategories.map((key) => strokeCategories[key]),
          borderColor: activeCategories.map((key) => categoryColors[key]), // Green lines for Pip-Boy style
          backgroundColor: activeCategories.map((key) => categoryColors[key]),
          borderWidth: 2,
          hoverBorderColor: activeCategories.map((key) => categoryColors[key]),
          hoverBackgroundColor: activeCategories.map(
            (key) => `${categoryColors[key].replace("0.3", "1")}` // Change opacity to 1 for hover
          ),
        },
      ],
    });
  };

  const toggleChartType = () => {
    setChartType((prevType) => (prevType === "line" ? "pie" : "line"));
    setIsActive(!isActive); // Toggle owl animation
    setChartKey((prevKey) => prevKey + 1); // Force re-render with a new key
  };

  if (!lineChartData || !pieChartData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bigDivForCharts">
      <div className="chart-container">
        {chartType === "line" ? (
          <Line key={chartKey} data={lineChartData} options={chartOptions} />
        ) : (
          <Pie key={chartKey} data={pieChartData} options={pieChartOptions} />
        )}
      </div>
      <div className="bird-box-interactive">
        <div className="bird-speech">
          Ignore the cloud, raw data hold the answers! click me for more.
        </div>
        <img
          src={isActive ? animatedGif : staticGif}
          alt="Cloud Caddi"
          className={`Owl-gif2 ${isActive ? "active" : ""}`}
          onClick={toggleChartType}
        />
      </div>
    </div>
  );
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: {
          size: 17,
          family: "'Jersey 10', cursive",
        },
        color: "#00FF00", // Bright green for Pip-Boy style
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      },
    },
    tooltip: {
      backgroundColor: "#000000",
      titleFont: {
        size: 14,
        family: "'Jersey 10', cursive",
        color: "#00FF00",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      },
      bodyFont: {
        size: 14,
        family: "'Jersey 10', cursive",
        color: "#00FF00",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      },
      footerFont: {
        size: 14,
        family: "'Jersey 10', cursive",
        color: "#00FF00",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Date",
        font: {
          size: 20,
          family: "'Jersey 10', cursive",
        },
        color: "#00FF00",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      },
      ticks: {
        font: {
          size: 12,
          family: "'Jersey 10', cursive",
        },
        color: "#00FF00", // Bright green for Pip-Boy style
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)", // More transparent grid lines
      },
    },
    y: {
      beginAtZero: true, // Start y-axis at 0
      title: {
        display: true,
        text: "Strokes",
        font: {
          size: 20,
          family: "'Jersey 10', cursive",
        },
        color: "#00FF00",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      },
      ticks: {
        font: {
          size: 14,
          family: "'Jersey 10', cursive",
        },
        color: "#00FF00", // Bright green for Pip-Boy style
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
        stepSize: 1, // Ensure only whole numbers are displayed
        callback: function (value) {
          if (Math.floor(value) === value) {
            return value;
          }
        },
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)", // More transparent grid lines
      },
      suggestedMax: 5, // Ensure at least one tick above the highest value
    },
  },
  animation: {
    duration: 1500,
    easing: "easeInOutBack",
  },
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: {
          size: 17,
          family: "'Jersey 10', cursive",
        },
        color: "#00FF00", // Bright green for Pip-Boy style
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      },
    },
    tooltip: {
      backgroundColor: "#000000",
      titleFont: {
        size: 14,
        family: "'Jersey 10', cursive",
        color: "#00FF00",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      },
      bodyFont: {
        size: 12,
        family: "'Jersey 10', cursive",
        color: "#00FF00",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      },
      footerFont: {
        size: 12,
        family: "'Jersey 10', cursive",
        color: "#00FF00",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  animation: {
    duration: 1500,
    easing: "easeInOutBack",
  },
  hover: {
    onHover: function (e, elements) {
      if (elements.length) {
        e.native.target.style.cursor = "pointer";
      } else {
        e.native.target.style.cursor = "default";
      }
    },
  },
};

export default HoleCharts;

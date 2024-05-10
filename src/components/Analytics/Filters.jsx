// components/Analytics/Filters.jsx
import React from "react";

const Filters = ({ filters, onFilterChange }) => {
  return (
    <div>
      <label>
        Weather:
        <input
          type="text"
          value={filters.weather}
          onChange={(e) => onFilterChange("weather", e.target.value)}
        />
      </label>
      <label>
        Course Difficulty:
        <input
          type="text"
          value={filters.courseDifficulty}
          onChange={(e) => onFilterChange("courseDifficulty", e.target.value)}
        />
      </label>
      <label>
        Hole Description:
        <input
          type="text"
          value={filters.holeDescription}
          onChange={(e) => onFilterChange("holeDescription", e.target.value)}
        />
      </label>
    </div>
  );
};

export default Filters;

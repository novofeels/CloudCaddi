import { useEffect, useState, useRef } from "react";
import { getAllCourses } from "../../services/CourseService";
import staticGif from "../../assets/staticGif.gif";
import animatedGif from "../../assets/CloudCaddiInClubhouse.gif";
import lowBlip from "../../assets/LowBlip.mp3";
import mediumBlip from "../../assets/MediumBlip.mp3";
import highBlip from "../../assets/HighBlip.mp3";
import { Link, useNavigate } from "react-router-dom";
import "./CourseList.css";

export const CourseList = () => {
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [displayedText, setDisplayedText] = useState(
    "Choose a course to see details or select a difficulty level to filter courses."
  );
  const [textToDisplay, setTextToDisplay] = useState(displayedText);
  const beepRef = useRef(null);
  const [mascotImage, setMascotImage] = useState(staticGif);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    getAllCourses().then((courses) => {
      setAllCourses(courses);
      setFilteredCourses(courses);
    });
  }, []);

  useEffect(() => {
    if (isActive && displayedText.length < textToDisplay.length) {
      const currentChar = textToDisplay[displayedText.length];
      beepRef.current = new Audio(
        currentChar === " "
          ? mediumBlip
          : ".!?".includes(currentChar)
          ? lowBlip
          : highBlip
      );
      beepRef.current.volume = 0.1; // Adjust the volume as needed
      beepRef.current.play();

      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + currentChar);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [displayedText, isActive]);

  const handleMascotClick = () => {
    setIsActive(!isActive);
    setMascotImage(isActive ? staticGif : animatedGif);
  };

  const handleFilterChange = (difficulty) => {
    const newFilteredCourses =
      difficulty === "all"
        ? allCourses
        : allCourses.filter((course) => course.difficulty === difficulty);
    setFilteredCourses(newFilteredCourses);
    setTextToDisplay(`Here are all the ${difficulty} courses.`);
    setDisplayedText("");
    setIsActive(true);
  };
  const handleCardClick = (course) => {
    setIsZoomed(true);
    // Optionally handle navigation or other actions after animation ends
    setTimeout(() => {
      // Example: navigate to another route
      navigate(`/CourseDetails/${course.id}`);
      // Reset state if staying on the same page
    }, 2500); // Match the duration of the animation
  };

  return (
    <div className="course-details-container">
      <h1 className={`course-title2 ${isZoomed ? "zoom-spin" : ""}`}>
        COURSES
      </h1>
      <div className={`interactive-area5 ${isZoomed ? "zoom-spin" : ""}`}>
        <div className="text-bubble5">{displayedText}</div>
        <img
          src={isActive ? animatedGif : staticGif}
          alt="Mascot"
          className="mascot-gif5"
          onClick={handleMascotClick}
        />
      </div>
      <div className={`filters ${isZoomed ? "zoom-spin" : ""}`}>
        {["all", "easy", "moderate", "difficult"].map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => handleFilterChange(difficulty)}
            className="filter-button"
          >
            {difficulty.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="holes-container2">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className={`hole-card2 ${isZoomed ? "zoom-spin" : ""}`}
            onClick={() => handleCardClick(course)}
          >
            <div className="hole-info">
              <h2 className="card-header"> {course.name}</h2>

              <p> par: {course.par}</p>

              <p> difficulty: {course.difficulty} </p>
            </div>
            {course.image && (
              <img
                src={course.image}
                alt={`NOT FOUND`}
                className="hole-image"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

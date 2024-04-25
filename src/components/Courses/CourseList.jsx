import { useEffect, useState, useRef } from "react";
import { getAllCourses } from "../../services/CourseService";
import staticGif from "../../assets/staticGif.png";
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

  const handleCardClick = (courseId) => {
    event.preventDefault();
    navigate(`/CourseDetails/${courseId}`);
  };
  return (
    <div className="course-details-container">
      <h1 className="course-title2">COURSES</h1>
      <div className="interactive-area5">
        <div className="text-bubble5">{displayedText}</div>
        <img
          src={isActive ? animatedGif : staticGif}
          alt="Mascot"
          className="mascot-gif5"
          onClick={handleMascotClick}
        />
      </div>
      <div className="filters">
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
          <Link to={`/CourseDetails/${course.id}`} className="hole-card-link">
            <div key={course.id} className="hole-card2">
              <div className="hole-info">
                <h2> {course.name}</h2>
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
          </Link>
        ))}
      </div>
    </div>
  );
};

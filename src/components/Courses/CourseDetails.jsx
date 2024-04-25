import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHolesByCourseId } from "../../services/HoleService";
import staticGif from "../../assets/staticGif.png";
import animatedGif from "../../assets/CloudCaddiInClubhouse.gif";
import lowBlip from "../../assets/LowBlip.mp3";
import mediumBlip from "../../assets/MediumBlip.mp3";
import highBlip from "../../assets/HighBlip.mp3";
import "./CourseDetails.css";
import { getCourseById } from "../../services/CourseService";

export const CourseDetails = () => {
  const [thisCourse, setThisCourse] = useState(null);
  const [holes, setHoles] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [displayedText, setDisplayedText] = useState(
    "Click on the hole you need to edit."
  );
  const { courseId } = useParams();

  useEffect(() => {
    getCourseById(courseId).then(setThisCourse);
    getHolesByCourseId(courseId).then(setHoles);
  }, [courseId]);

  const handleMascotClick = () => {
    setIsActive(!isActive);
    // Toggle mascot gif and play a sound
    const beep = new Audio(isActive ? lowBlip : highBlip);
    beep.play();
  };
  if (thisCourse) {
    return (
      <div className="course-details-container">
        <h1 className="course-title2">{thisCourse[0].name.toUpperCase()}</h1>
        <div className="interactive-area5">
          <div className="text-bubble5">{displayedText}</div>
          <img
            src={isActive ? animatedGif : staticGif}
            alt="Mascot"
            className="mascot-gif5"
            onClick={handleMascotClick}
          />
        </div>
        <div className="holes-container">
          {holes.map((hole) => (
            <div key={hole.id} className="hole-card">
              <div className="hole-info">
                <h2>Hole {hole.holeNumber}</h2>
                <p>Par: {hole.par}</p>
                <p>Distance: {hole.distance}ft</p>
              </div>
              {hole.image && (
                <img
                  src={hole.image}
                  alt={`Hole ${hole.holeNumber}`}
                  className="hole-image"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
};

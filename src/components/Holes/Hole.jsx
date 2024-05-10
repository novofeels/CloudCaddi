import { useEffect, useRef, useState } from "react";
import { getAllHoles } from "../../services/HoleService";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCourses } from "../../services/CourseService";
import staticGif from "../../assets/staticGif.gif";
import animatedGif from "../../assets/CloudCaddiInClubhouse.gif";
import lowBlip from "../../assets/LowBlip.mp3";
import mediumBlip from "../../assets/MediumBlip.mp3";
import highBlip from "../../assets/HighBlip.mp3";
import "./Hole.css";
import {
  createNewHoleScore,
  getAllHoleScores,
  getAllScoreCards,
  getHoleScoreByScoreCardId,
  updateScoreCardWithScore,
} from "../../services/ScoreCardService";
import CloudCaddiDriving from "../../assets/CloudCaddiDriving.png";
import { HoleCharts } from "./HoleCharts";

export const Hole = ({ currentUser }) => {
  const navigate = useNavigate();
  const { courseId, holeNum, scoreCardId } = useParams();
  const [holes, setHoles] = useState([]);
  const [thisHole, setThisHole] = useState({});
  const [courses, setCourses] = useState([]);
  const [thisCourse, setThisCourse] = useState({});
  const [speechText, setSpeechText] = useState("Need a Tip?");
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [isMascotClicked, setIsMascotClicked] = useState(false);
  const [strokesTaken, setStrokesTaken] = useState(0);
  const [scoreCards, setScoreCards] = useState([]);
  const [thisScoreCard, setThisScoreCard] = useState({});
  const [isDriving, setIsDriving] = useState(false);
  const [bypassDefaultText, setBypassDefaultText] = useState(false);

  const [thisRoundsHoleScores, setThisRoundsHoleScores] = useState([]);
  const lowBeepRef = useRef(new Audio(lowBlip));
  const mediumBeepRef = useRef(new Audio(mediumBlip));
  const highBeepRef = useRef(new Audio(highBlip));

  useEffect(() => {
    setIsDriving(false);
    getHoleScoreByScoreCardId(parseInt(scoreCardId)).then((holeScoreObjs) =>
      setThisRoundsHoleScores(holeScoreObjs)
    );
    getAllCourses().then((courseObjs) => setCourses(courseObjs));
    getAllHoles().then((holeObjs) => setHoles(holeObjs));
    getAllScoreCards().then((scoreCardObjs) => setScoreCards(scoreCardObjs));
  }, [scoreCardId]);

  useEffect(() => {
    const foundHole = holes.find(
      (hole) =>
        hole.courseId === parseInt(courseId) &&
        hole.holeNumber === parseInt(holeNum)
    );
    setThisHole(foundHole);
    const foundCourse = courses.find(
      (course) => course.id === parseInt(courseId)
    );
    setThisCourse(foundCourse);
    const foundScoreCard = scoreCards.find(
      (scoreCard) => scoreCard.id === parseInt(scoreCardId)
    );
    setThisScoreCard(foundScoreCard);
  }, [holes, holeNum, courseId, courses, scoreCardId, scoreCards]);

  useEffect(() => {
    if (isMascotClicked && !bypassDefaultText) {
      const newSpeechText =
        "Same conditions as your best score—scattered clouds, mild wind. Keep it steady and low. No need to overthink it. Just swing like you did last time and you might actually pull off another good shot.";
      setSpeechText(newSpeechText);
      setDisplayedText("");
      setIndex(0);
    } else if (bypassDefaultText) {
      const newSpeechText2 = "BUCKLE UP!!!";
      setSpeechText(newSpeechText2);
      setDisplayedText("");
      setIndex(0);
      // Reset after use
    }
  }, [isMascotClicked, bypassDefaultText]);
  // Add other dependencies if the text depends on them

  useEffect(() => {
    let timeout;
    if (index < speechText.length && displayedText !== speechText) {
      const nextChar = speechText.charAt(index);
      const delay = nextChar === " " ? 50 : nextChar === "." ? 600 : 100; // Set delay based on character

      // Decide which sound to play based on the character
      if ("!?.".includes(nextChar)) {
        highBeepRef.current.play();
      } else if (nextChar === " ") {
        mediumBeepRef.current.play();
      } else {
        lowBeepRef.current.play();
      }

      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + nextChar);
        setIndex(index + 1);
      }, delay);
    }

    return () => clearTimeout(timeout);
  }, [index, speechText, displayedText]);

  useEffect(() => {
    if (index >= speechText.length && isMascotClicked) {
      // When text finishes, wait for a short period then reset to static image
      setTimeout(() => {
        setIsMascotClicked(false);
      }, 10); // Delay can be adjusted to ensure the gif plays a bit longer if needed
    }
  }, [index, speechText, isMascotClicked]);

  const handleClickMascot = () => {
    // Toggle isMascotClicked to trigger the useEffect
    setIsMascotClicked((prev) => !prev);
    setDisplayedText("");
    setIndex(0);
  };

  const handleStrokesChange = (event) => {
    setStrokesTaken(event.target.value);
  };

  const handleButtonClick = () => {
    const holeScoreToPost = {
      userId: currentUser.id,
      holeId: thisHole.id,
      scoreCardId: parseInt(scoreCardId),
      par: thisHole.par,
      score: parseInt(strokesTaken),
      holeNumber: parseInt(holeNum),
      windSpeed: thisScoreCard.windSpeed,
      windDirection: thisScoreCard.windDirection,
      temperature: thisScoreCard.temperature,
      humidity: thisScoreCard.humidity,
      pressure: thisScoreCard.pressure,
      description: thisScoreCard.description,
    };

    createNewHoleScore(holeScoreToPost);

    // Set the new speech text and trigger the mascot animation
    // Directly set the text to display
    setBypassDefaultText(true); // Start animation
    // Reset the index for character-by-character display

    // Use setTimeout to manage the sequence of actions
    setTimeout(() => {
      setIsDriving(true); // Start driving animation
      document.querySelector(".mascot-driving").style.display = "block";
      document.querySelector(".dim-background").style.display = "block";

      // After the driving animation, handle navigation
      setTimeout(() => {
        document.querySelector(".dim-background").style.display = "none";
        document.querySelector(".mascot-driving").style.display = "none";
        setIsDriving(false); // Ensure the driving state is reset
        setStrokesTaken(0); // Reset stroke count for new hole
        setBypassDefaultText(false);
        setDisplayedText("Need a Tip?");
        getHoleScoreByScoreCardId(parseInt(scoreCardId)).then((holeScoreObjs) =>
          setThisRoundsHoleScores(holeScoreObjs)
        );

        // Navigate to the next part of the application
        navigate(
          `/scoreCard/${scoreCardId}/${courseId}/${parseInt(holeNum) + 1}`
        );
      }, 3000); // This delay should align with the duration of the mascot driving animation
    }, 1500); // Delay the start of the animation to allow users to read the "HOLD ON" message
  };

  const handleFinish = () => {
    const holeScoreToPost = {
      userId: currentUser.id,
      holeId: thisHole.id,
      scoreCardId: parseInt(scoreCardId),
      par: thisHole.par,
      score: parseInt(strokesTaken),
      holeNumber: parseInt(holeNum),
      windSpeed: thisScoreCard.windSpeed,
      windDirection: thisScoreCard.windDirection,
      temperature: thisScoreCard.temperature,
      humidity: thisScoreCard.humidity,
      pressure: thisScoreCard.pressure,
      description: thisScoreCard.description,
    };
    const totalScore = thisRoundsHoleScores.reduce(
      (total, currentHoleScore) => {
        return total + currentHoleScore.score;
      },
      0
    ); // Initialize the total as 0.

    const totalScore2 = totalScore + parseInt(strokesTaken);

    const updatedScoreCard = {
      userId: thisScoreCard.userId,
      courseId: thisScoreCard.courseId,
      par: thisScoreCard.par,
      score: totalScore2,
      date: thisScoreCard.date,
      windSpeed: thisScoreCard.windSpeed,
      windDirection: thisScoreCard.windDirection,
      temperature: thisScoreCard.temperature,
      humidity: thisScoreCard.humidity,
      pressure: thisScoreCard.pressure,
      description: thisScoreCard.description,
      id: thisScoreCard.id,
    };
    createNewHoleScore(holeScoreToPost);
    updateScoreCardWithScore(updatedScoreCard, parseInt(scoreCardId));

    // Set the new speech text and trigger the mascot animation
    // Directly set the text to display
    setBypassDefaultText(true); // Start animation
    // Reset the index for character-by-character display

    // Use setTimeout to manage the sequence of actions
    setTimeout(() => {
      setIsDriving(true); // Start driving animation
      document.querySelector(".mascot-driving").style.display = "block";
      document.querySelector(".dim-background").style.display = "block";

      // After the driving animation, handle navigation
      setTimeout(() => {
        document.querySelector(".dim-background").style.display = "none";
        document.querySelector(".mascot-driving").style.display = "none";
        setIsDriving(false); // Ensure the driving state is reset
        setStrokesTaken(0); // Reset stroke count for new hole
        setBypassDefaultText(false);
        setDisplayedText("Need a Tip?");
        getHoleScoreByScoreCardId(parseInt(scoreCardId)).then((holeScoreObjs) =>
          setThisRoundsHoleScores(holeScoreObjs)
        );

        // Navigate to the next part of the application
        navigate(`/RoundList`);
      }, 3500); // This delay should align with the duration of the mascot driving animation
    }, 2000); // Delay the start of the animation to allow users to read the "HOLD ON" message
  };

  return (
    <div className="div-for-black-background">
      <div className="hole-info-container">
        <div className="course-title99">{thisCourse?.name}</div>
        <div className="image-carousel-container">
          <img
            className="image-carousel"
            src={thisHole?.image}
            alt={`Hole view`}
          />
          <div className="charts-graphs">
            <HoleCharts currentUser={currentUser} holeId={thisHole?.id} />
          </div>
        </div>
        <div className="hole-details-and-mascot-container">
          {" "}
          {/* Wrapper for stats and mascot */}
          <div className="hole-stats-container">
            <div className="hole-detail">
              <div className="aboveButton">
                <h2 className="workDammit">
                  Hole {thisHole?.holeNumber} - {thisHole?.distance} ft
                </h2>
                <p className="makeParBigger">Par {thisHole?.par}</p>
              </div>
              <div className="input-group">
                <input
                  className="input-stroke"
                  type="number"
                  placeholder="User input strokes"
                  value={strokesTaken}
                  onChange={handleStrokesChange}
                />
                {parseInt(holeNum) < parseInt(thisCourse?.numOfHoles) ? (
                  <button
                    className="proceed-button"
                    onClick={handleButtonClick}
                  >
                    PROCEED TO NEXT HOLE
                  </button>
                ) : (
                  <button className="proceed-button" onClick={handleFinish}>
                    Finish Round
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mascot-container3">
            {" "}
            {/* New container for the mascot */}
            <div className="mascot-speech-bubble3">
              <div className="mascot-text3">{displayedText}</div>
            </div>
            <img
              className="mascot3"
              src={isMascotClicked ? animatedGif : staticGif}
              alt="Mascot"
              onClick={handleClickMascot}
            />
          </div>
        </div>
        <div className="scorecard">
          <div className="header">Hole#</div>
          {Array.from({ length: 18 }, (_, i) => (
            <div key={i} className="hole-number">
              {i + 1}
            </div>
          ))}
          <div className="header">Strokes</div>
          {Array.from({ length: 18 }, (_, i) => {
            // Find the hole score object for the current hole number
            const holeScore = thisRoundsHoleScores.find(
              (score) => score.holeNumber === i + 1
            );
            // Display the score if available, otherwise display 'X'
            return (
              <div key={i} className="strokes">
                {holeScore ? holeScore.score : "X"}
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="dim-background"
        style={{ display: isDriving ? "block" : "none" }}
      ></div>

      <img
        src={CloudCaddiDriving}
        alt="Mascot Driving Golf Cart"
        className={`mascot-driving ${isDriving ? "start-driving2" : ""}`}
        style={{ display: isDriving ? "block" : "none" }}
      />
    </div>
  );
};

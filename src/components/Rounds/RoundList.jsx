import { useEffect, useState, useRef, useMemo } from "react";
import "./RoundList.css";
import { getScoreCardsByUserId } from "../../services/ScoreCardService";
import lowBlip from "../../assets/LowBlip.mp3";
import mediumBlip from "../../assets/MediumBlip.mp3";
import highBlip from "../../assets/HighBlip.mp3";
import animatedGif from "../../assets/CloudCaddiInClubhouse.gif";
import staticGif from "../../assets/staticGif.png";
import { Link, useNavigate } from "react-router-dom";
import { getAllCourses } from "../../services/CourseService";

export const RoundList = ({ currentUser }) => {
  const [filterDate, setFilterDate] = useState("");
  const [myRounds, setMyRounds] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [displayedText, setDisplayedText] = useState(
    "Select a round to see details or edit."
  );
  const [textToDisplay, setTextToDisplay] = useState(
    "Choose a round to see details or select a round to edit."
  );
  const [index, setIndex] = useState(0);
  const [pokeCounter, setPokeCounter] = useState(0);
  const [allCourses, setAllCourses] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const beepRef = useRef(null);
  const navigate = useNavigate();
  const epochToDate = (epochTime) => {
    const date = new Date(epochTime * 1000);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const filteredAndSortedRounds = useMemo(() => {
    // If no date is picked, sort all rounds and return
    if (!filterDate) {
      return myRounds.sort((a, b) => b.date - a.date);
    }

    // If a date is picked, filter and then sort the rounds
    const dateFilteredRounds = myRounds.filter(
      (round) => epochToDate(round.date) === filterDate
    );
    return dateFilteredRounds.sort((a, b) => b.date - a.date);
  }, [myRounds, filterDate]);

  useEffect(() => {
    getAllCourses().then((courseObjs) => setAllCourses(courseObjs));
    getScoreCardsByUserId(parseInt(currentUser.id)).then(setMyRounds);
  }, [currentUser.id]);

  useEffect(() => {
    if (isActive && index < textToDisplay.length) {
      const currentChar = textToDisplay[index];
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
        setIndex(index + 1);
      }, 100);

      return () => clearTimeout(timer);
    } else if (isActive && index === textToDisplay.length) {
      setIsActive(false);
    }
  }, [index, isActive, textToDisplay]);
  const handleLogout = () => {
    localStorage.removeItem("Caddi_User");
    navigate("/login", { replace: true });
  };

  const handleMascotClick = () => {
    setIsActive(!isActive);
    const newCount = pokeCounter + 1;
    setPokeCounter(newCount);

    let message = "";

    switch (newCount) {
      case 1:
        message = "Here's all your scorecards bud.";
        break;
      case 2:
        message = "Stop poking me.";
        break;
      case 3:
        message = "I'm warning you.";
        break;
      case 4:
        message = "That's it pal!";
        // Introduce a delay based on the message length
        break;
      default:
        setPokeCounter(0); // Reset the counter to 0
        return; // Optionally do nothing after the 4th poke
    }

    setTextToDisplay(message);
    setDisplayedText("");
    setIndex(0);

    if (newCount === 4) {
      // Calculate delay to allow message to be read fully
      const readingTime = message.length * 100; // Assuming 100ms per character for reading
      setTimeout(handleLogout, readingTime + 1200); // Add extra 2 seconds after the message is fully displayed
    }
  };

  const formatDate = (epoch) => {
    const date = new Date(epoch * 1000);
    return `${date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })} `;
  };
  const formatTime = (epoch) => {
    const time = new Date(epoch * 1000);

    return `${time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };
  const navigateToRoundDetail = (roundId) => {
    // Implementation for navigation
    console.log("Navigate to round:", roundId);
    // Replace console.log with actual navigation logic
  };

  const degreesToDirection = (degrees) => {
    if (typeof degrees !== "number" || isNaN(degrees)) {
      console.error("Invalid input for degrees:", degrees);
      return "Unknown";
    }
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    const index = Math.floor((degrees + 11.25) / 22.5);
    console.log(
      "Degrees:",
      degrees,
      "Index:",
      index,
      "Direction:",
      directions[index % 16]
    );
    return directions[index % 16];
  };
  const handleCardClick = (round) => {
    setIsZoomed(true);
    // Optionally handle navigation or other actions after animation ends
    setTimeout(() => {
      // Example: navigate to another route
      navigate(`/RoundDetails/${round.id}`);
      // Reset state if staying on the same page
    }, 1500); // Match the duration of the animation
  };

  if (myRounds) {
    return (
      <div className="round-details-container">
        <h1 className={`round-title2 ${isZoomed ? "zoom-spin" : ""}`}>
          ROUNDS
        </h1>
        <div className={`interactive-area79 ${isZoomed ? "zoom-spin" : ""}`}>
          <div className="text-bubble79">{displayedText}</div>
          <img
            src={isActive ? animatedGif : staticGif}
            alt="Mascot"
            className={`mascot-gif79 ${isZoomed ? "zoom-spin" : ""}`}
            onClick={handleMascotClick}
          />
        </div>
        <div className={`date-picker-container ${isZoomed ? "zoom-spin" : ""}`}>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="date-picker"
          />
        </div>
        <div className="rounds-container2">
          {filteredAndSortedRounds.map((round) => {
            const thisCourse = allCourses.find(
              (course) => round.courseId === course.id
            );

            const wind = thisCourse
              ? degreesToDirection(round.windDirection)
              : "Unknown";

            return (
              <div
                key={round.id}
                className={`round-card2 ${isZoomed ? "zoom-spin" : ""}`}
                style={{ "--card-index": index }}
                onClick={() => handleCardClick(round)}
              >
                <div className="round-info">
                  <h3 className="round-header2">{formatDate(round.date)}</h3>
                  <h3 className="round-header">{formatTime(round.date)}</h3>
                  <div className="new-div-forp">
                    <div className="new-div-forp2">
                      <p className="make-it-smaller">
                        course: {thisCourse?.name}
                      </p>
                      <p className="make-it-smaller">par: {round.par}</p>

                      <p className="make-it-smaller">
                        weather: {round.description}
                      </p>
                    </div>
                    <div className="new-div-forp3">
                      <p className="make-it-smaller">
                        difficulty: {thisCourse?.difficulty}
                      </p>
                      <p className="make-it-smaller">score: {round.score}</p>
                      <p className="make-it-smaller">
                        wind: {wind} {round.windSpeed} mph
                      </p>
                    </div>
                  </div>
                </div>
                {thisCourse?.image && (
                  <img
                    src={thisCourse.image}
                    alt="Course"
                    className="round-image"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

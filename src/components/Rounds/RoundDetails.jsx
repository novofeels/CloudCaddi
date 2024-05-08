import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getHoleScoreByScoreCardId,
  getScoreCardById,
  patchHoleScore,
  patchScoreCard,
} from "../../services/ScoreCardService";
import lowBlip from "../../assets/LowBlip.mp3";
import mediumBlip from "../../assets/MediumBlip.mp3";
import highBlip from "../../assets/HighBlip.mp3";
import animatedGif from "../../assets/CloudCaddiInClubhouse.gif";
import staticGif from "../../assets/staticGif.png";
import "./RoundDetails.css";
import {
  deleteHoleScoresByScoreCardId,
  deleteScoreCardById,
} from "../../services/Delete";
import { MascotModal } from "./MascotModal";
export const RoundDetails = () => {
  const { roundId } = useParams();
  const [holeScores, setHoleScores] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [pokeCounter, setPokeCounter] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [displayedText, setDisplayedText] = useState(
    "Edit the scorecard above and click the round card below to submit your changes."
  );
  const [textToDisplay, setTextToDisplay] = useState(
    "Choose a round to see details or select a round to edit."
  );
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState({});
  const [showModal, setShowModal] = useState(false);
  const beepRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getHoleScoreByScoreCardId(parseInt(roundId)).then((scores) =>
      setHoleScores(scores)
    );
    getScoreCardById(parseInt(roundId)).then((roundObj) => setRound(roundObj));
  }, [roundId]);

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
  const handleMascotClick = () => {
    setIsActive(!isActive);
    const newCount = pokeCounter + 1;
    setPokeCounter(newCount);

    let message = "";

    switch (newCount) {
      case 1:
        message =
          "Edit the scorecard above, then click the round card below to submit.";
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

  const handleHoleScoreChange = (holeNumber, newScore) => {
    setHoleScores((prevHoleScores) =>
      prevHoleScores.map((hs) =>
        hs.holeNumber === holeNumber ? { ...hs, score: newScore } : hs
      )
    );
  };

  const updateTotalScore = async () => {
    // Sum the scores using .reduce()
    const newTotalScore = holeScores.reduce(
      (total, holeScore) => total + holeScore.score,
      0
    );
    // Call patchScoreCard to update the total score
    await patchScoreCard(round.id, newTotalScore);
    // Update the local round state with the new total score
    setRound((prevRound) => ({ ...prevRound, score: newTotalScore }));
  };

  const handleCardClick = async () => {
    setIsZoomed(true);
    // Update each hole score
    for (const holeScore of holeScores) {
      await patchHoleScore(holeScore.id, holeScore.score);
    }
    // Then, update the total score
    await updateTotalScore();
    setTimeout(() => {
      // Example: navigate to another route
      navigate(`/RoundList`);
      // Reset state if staying on the same page
    }, 2500);
  };

  const handleDeleteButton = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    deleteHoleScoresByScoreCardId(round.id);
    deleteScoreCardById(round.id);
    navigate("/RoundList");
    setShowModal(false);
  };
  if (round) {
    return (
      <div className="big-div-for-round-details">
        <div
          className={`round-details-scorecard ${isZoomed ? "zoom-spin" : ""}`}
        >
          <div className="round-details-row">
            <div className="round-details-header">Hole#</div>
            {Array.from({ length: 18 }, (_, i) => (
              <div key={`hole-${i}`} className="round-details-hole-number">
                {i + 1}
              </div>
            ))}
          </div>
          <div className="round-details-row">
            <div className="round-details-header">Strokes</div>
            {holeScores.map((holeScore, i) => (
              <input
                type="number"
                key={i}
                className="round-details-strokes"
                value={holeScores[i].score}
                onChange={(e) =>
                  handleHoleScoreChange(i + 1, parseInt(e.target.value))
                }
              />
            ))}
          </div>
        </div>
        <div
          className={`round-details-interactive-area ${
            isZoomed ? "zoom-spin" : ""
          }`}
        >
          <div className="round-details-text-bubble">{displayedText}</div>
          <img
            src={isActive ? animatedGif : staticGif}
            alt="Mascot"
            className={`round-details-mascot-gif ${
              isZoomed ? "zoom-spin" : ""
            }`}
            onClick={handleMascotClick}
          />
          <button
            className={`delete-btn2 ${isZoomed ? "zoom-spin" : ""}`}
            onClick={handleDeleteButton}
          >
            DELETE ROUND
          </button>
          <MascotModal
            isOpen={showModal}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
            message="Well, Well, Well..."
          />
        </div>
        <div
          key={round.id}
          className={`round-card3 ${isZoomed ? "zoom-spin" : ""}`}
          style={{ "--card-index": index }}
          onClick={handleCardClick}
        >
          <div className="round-info">
            <h3 className="round-header2">{formatDate(round.date)}</h3>
            <h3 className="round-header">{formatTime(round.date)}</h3>
            <div className="new-div-forp">
              <div className="new-div-forp2">
                <p className="make-it-smaller">course: {round?.course?.name}</p>
                <p className="make-it-smaller">par: {round.par}</p>

                <p className="make-it-smaller">weather: {round.description}</p>
              </div>
              <div className="new-div-forp3">
                <p className="make-it-smaller">
                  difficulty: {round?.course?.difficulty}
                </p>
                <p className="make-it-smaller">score: {round.score}</p>
                <p className="make-it-smaller">
                  wind: {degreesToDirection(round.windDirection)} -{" "}
                  {round.windSpeed} mph
                </p>
              </div>
            </div>
          </div>
          {round.course?.image && (
            <img
              src={round.course.image}
              alt="Course"
              className="round-image"
            />
          )}
        </div>
        ;
      </div>
    );
  }
};

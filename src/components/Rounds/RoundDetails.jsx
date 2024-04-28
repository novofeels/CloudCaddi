import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getHoleScoreByScoreCardId } from "../../services/ScoreCardService";
import lowBlip from "../../assets/LowBlip.mp3";
import mediumBlip from "../../assets/MediumBlip.mp3";
import highBlip from "../../assets/HighBlip.mp3";
import animatedGif from "../../assets/CloudCaddiInClubhouse.gif";
import staticGif from "../../assets/staticGif.png";
import "./RoundDetails.css";
export const RoundDetails = () => {
  const { roundId } = useParams();
  const [holeScores, setHoleScores] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [pokeCounter, setPokeCounter] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [displayedText, setDisplayedText] = useState(
    "Select a round to see details or edit."
  );
  const [textToDisplay, setTextToDisplay] = useState(
    "Choose a round to see details or select a round to edit."
  );
  const [index, setIndex] = useState(0);
  const beepRef = useRef(null);

  useEffect(() => {
    getHoleScoreByScoreCardId(parseInt(roundId)).then((scores) =>
      setHoleScores(scores)
    );
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

  return (
    <div className="big-div-for-round-details">
      <div className="round-details-scorecard">
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
          {Array.from({ length: 18 }, (_, i) => {
            const holeScore = holeScores.find(
              (score) => score.holeNumber === i + 1
            );
            return (
              <div key={`stroke-${i}`} className="round-details-strokes">
                {holeScore ? holeScore.score : "X"}
              </div>
            );
          })}
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
          className={`round-details-mascot-gif ${isZoomed ? "zoom-spin" : ""}`}
          onClick={handleMascotClick}
        />
      </div>
    </div>
  );
};

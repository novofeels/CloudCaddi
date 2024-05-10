import React, { useState, useEffect } from "react";
import "./Analytics.css";
import lowBlip from "../../assets/LowBlip.mp3";
import mediumBlip from "../../assets/MediumBlip.mp3";
import highBlip from "../../assets/HighBlip.mp3";
import animatedGif from "../../assets/OwlbertEinsteinGif.gif";
import staticGif from "../../assets/OwlbertEinsteinGif.gif";
import successSound from "../../assets/success.wav";
import Filters from "./Filters";
import ChartComponent from "./ChartComponent";

export const Analytics = ({ currentUser }) => {
  const defaultText = "Is someone there?";
  const [displayedText, setDisplayedText] = useState(defaultText);
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [emphasizingYOUR, setEmphasizingYOUR] = useState(false);
  const [filters, setFilters] = useState();

  const text =
    "How'd you get in here...?\\n\\nAnyhow, my name is Owlbert Einstein - I crunch the numbers around here, the cloud is just a figurehead \\n\\nI'm not quite set up yet, come back later.";
  useEffect(() => {
    if (isActive && index < text.length && !pause) {
      const currentChar = text[index];
      let beep;
      let delay = currentChar === " " ? 125 : 35; // Default delay

      if (
        index === 0 ||
        (".!?".includes(text[index - 1]) &&
          text[index - 1] !== undefined &&
          text[index] !== " ")
      ) {
        beep = new Audio(highBlip);
      } else if (".!?".includes(currentChar)) {
        beep = new Audio(lowBlip);
      } else {
        beep = new Audio(mediumBlip);
      }

      beep.volume = 0.05;

      if (text.substring(index).startsWith("\\n\\n")) {
        beep.play();
        setPause(true);
        setTimeout(() => {
          setDisplayedText((prev) => prev + "\n\n");
          setIndex(index + 4);
          setPause(false);
        }, 500);
        return;
      }

      if (
        (text.substring(index, index + 4) === "YOUR" && !emphasizingYOUR) ||
        text.substring(index, index + 4) === "...."
      ) {
        setEmphasizingYOUR(true);
      }

      if (emphasizingYOUR) {
        delay = 500; // Slowed down emphasis
        if (
          (currentChar === "R" &&
            text.substring(index - 3, index + 1) === "YOUR") ||
          (currentChar === "." &&
            text.substring(index - 3, index + 1) === "....")
        ) {
          setEmphasizingYOUR(false);
        }
      } else {
        delay = currentChar === " " ? 80 : 35; // Normal delay
      }

      beep.play();
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + currentChar);
        setIndex(index + 1);

        // Check if this is the last character and play the success sound
        if (index === text.length - 1) {
          const successBeep = new Audio(successSound);
          successBeep.volume = 0.1; // Set volume as needed
          successBeep.play();
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [index, pause, isActive, emphasizingYOUR]);

  useEffect(() => {
    let gifTimer;
    if (isActive) {
      const gifDuration = 30000;
      gifTimer = setTimeout(() => {
        setIsActive(false);

        setIndex(0); // Reset index to start text from beginning on next activation
      }, gifDuration);
    }

    return () => clearTimeout(gifTimer);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setDisplayedText(""); // Clear the default text
    setIndex(0); // Start from the beginning of the provided text
  };

  const onFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  return (
    <div className="div-for-background4">
      <div className="container4welcome">
        <div className="text-bubble-analytics">{displayedText}</div>
        <img
          src={isActive ? animatedGif : staticGif}
          alt="Cloud Caddi"
          className={`Owl-gif "active"`}
          onClick={handleStart}
        />
      </div>
    </div>
  );
};

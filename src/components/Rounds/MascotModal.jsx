import React, { useState, useEffect } from "react";
import "./MascotModal.css";
import lowBlip from "../../assets/LowBlip.mp3";
import mediumBlip from "../../assets/MediumBlip.mp3";
import highBlip from "../../assets/HighBlip.mp3";
import animatedGif from "../../assets/CloudCaddiInClubhouse.gif";
import staticGif from "../../assets/staticGif.png";
import successSound from "../../assets/success.wav";

export const MascotModal = ({ isOpen, onClose, onConfirm, message }) => {
  const [displayedText, setDisplayedText] = useState("Well, well, well...");
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [emphasizingYOUR, setEmphasizingYOUR] = useState(false);
  const fullText = "Admit you're a cheater and i'll make this alllll go away."; // Moved out of the effect

  useEffect(() => {
    if (isActive && index < fullText.length && !pause) {
      const currentChar = fullText[index];
      const beep = new Audio(
        ".!?"[currentChar]
          ? lowBlip
          : index === 0 || ".!?"[fullText[index - 1]]
          ? highBlip
          : mediumBlip
      );
      beep.volume = 0.05;

      const delay = emphasizingYOUR ? 500 : currentChar === " " ? 80 : 35;

      beep.play();
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + currentChar);
        setIndex((prevIndex) => prevIndex + 1);

        if (index === fullText.length - 1) {
          new Audio(successSound).play();
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [index, pause, isActive, emphasizingYOUR]);

  useEffect(() => {
    if (isActive) {
      const gifTimer = setTimeout(() => {
        setIsActive(false);
        setIndex(0); // Reset index to start text from beginning on next activation
      }, 30000); // Adjusted duration for clarity

      return () => clearTimeout(gifTimer);
    }
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setDisplayedText(""); // Clear the default text
    setIndex(0); // Start from the beginning of the provided text
  };

  if (!isOpen) return null;

  const handleNotCheaterMouseOver = (event) => {
    const button = event.currentTarget;
    const buttonRect = button.getBoundingClientRect();

    // Maximum displacement in pixels
    const maxDisplacement = 800;

    // Get a random displacement within a set range
    let deltaX = Math.random() * maxDisplacement - maxDisplacement / 2;
    let deltaY = Math.random() * maxDisplacement - maxDisplacement / 2;

    // Calculate new position
    let newX = buttonRect.left + deltaX;
    let newY = buttonRect.top + deltaY;

    // Ensure the button does not move off screen
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + buttonRect.width > window.innerWidth)
      newX = window.innerWidth - buttonRect.width;
    if (newY + buttonRect.height > window.innerHeight)
      newY = window.innerHeight - buttonRect.height;

    // Apply the transformation
    button.style.transform = `translate(${newX - buttonRect.left}px, ${
      newY - buttonRect.top
    }px)`;
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="interactive-modal">
          <div className="text-bubble99">{displayedText}</div>
          <img
            src={isActive ? animatedGif : staticGif}
            alt="Cloud Caddi"
            className={`cloud-gif99 ${isActive ? "active" : ""}`}
            onClick={handleStart}
          />
        </div>
        <div className="modal-btns">
          <button onClick={onConfirm} className="modal-btn">
            I'M A CHEATER
          </button>
          <button
            onMouseEnter={handleNotCheaterMouseOver}
            className="modal-btn2"
          >
            I'M NOT A CHEATER
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import './TextBubble.css';
import lowBlip from '../../assets/LowBlip.mp3';
import mediumBlip from '../../assets/MediumBlip.mp3';
import highBlip from '../../assets/HighBlip.mp3';
import animatedGif from '../../assets/CloudCaddiInClubhouse.gif';
import staticGif from '../../assets/staticGif.png';

export const TextBubble = ({ text }) => {
    const defaultText = "What are you waiting for kid, click on me!";
    const [displayedText, setDisplayedText] = useState(defaultText);
    const [index, setIndex] = useState(0);
    const [pause, setPause] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [emphasizingYOUR, setEmphasizingYOUR] = useState(false);

    useEffect(() => {
        if (isActive && index < text.length && !pause) {
            const currentChar = text[index];
            let beep;
            let delay = currentChar === ' ' ? 125 : 35;  // Default delay

            if (index === 0 || ".!?".includes(text[index - 1]) && text[index - 1] !== undefined && text[index] !== ' ') {
                beep = new Audio(highBlip);
            } else if (".!?".includes(currentChar)) {
                beep = new Audio(lowBlip);
            } else {
                beep = new Audio(mediumBlip);
            }

            beep.volume = 0.1;

            if (text.substring(index).startsWith('\\n\\n')) {
                beep.play();
                setPause(true);
                setTimeout(() => {
                    setDisplayedText(prev => prev + '\n\n');
                    setIndex(index + 4);
                    setPause(false);
                }, 500);
                return;
            }

            if (text.substring(index, index + 4) === "YOUR" && !emphasizingYOUR) {
                setEmphasizingYOUR(true);
            }

            if (emphasizingYOUR) {
                delay = 500;
                if (currentChar === 'R' && text.substring(index - 3, index + 1) === "YOUR") {
                    setEmphasizingYOUR(false);
                }
            }

            beep.play();
            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + currentChar);
                setIndex(index + 1);
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [index, text, pause, isActive, emphasizingYOUR]);

    useEffect(() => {
        let gifTimer;
        if (isActive) {
            const gifDuration = 30000;
            gifTimer = setTimeout(() => {
                setIsActive(false);
                setDisplayedText(defaultText);
                setIndex(0);  // Reset index to start text from beginning on next activation
            }, gifDuration);
        }

        return () => clearTimeout(gifTimer);
    }, [isActive]);

    const handleStart = () => {
        setIsActive(true);
        setDisplayedText('');  // Clear the default text
        setIndex(0);  // Start from the beginning of the provided text
    };

    return (
        <div className="container">
            <div className="text-bubble">{displayedText}</div>
            <img src={isActive ? animatedGif : staticGif} alt="Cloud Caddi" className="cloud-gif"/>
            <button onClick={handleStart} disabled={isActive}>Start</button>
        </div>
    );
}

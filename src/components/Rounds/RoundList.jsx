import { useEffect, useState, useRef } from "react";
import './RoundList.css';
import { getScoreCardsByUserId } from "../../services/ScoreCardService";
import lowBlip from '../../assets/LowBlip.mp3';
import mediumBlip from '../../assets/MediumBlip.mp3';
import highBlip from '../../assets/HighBlip.mp3';
import animatedGif from '../../assets/CloudCaddiInClubhouse.gif';
import staticGif from '../../assets/staticGif.png';
import { useNavigate } from "react-router-dom";

export const RoundList = ({ currentUser }) => {
    const [myRounds, setMyRounds] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [displayedText, setDisplayedText] = useState("Select a round to see details or edit.");
    const [textToDisplay, setTextToDisplay] = useState("Choose a round to see details or select a round to edit.");
    const [index, setIndex] = useState(0);
    const [pokeCounter, setPokeCounter] = useState(0)
    const beepRef = useRef(null);
    const navigate = useNavigate()

    useEffect(() => {
        getScoreCardsByUserId(parseInt(currentUser.id)).then(setMyRounds);
    }, [currentUser.id]);

    useEffect(() => {
        if (isActive && index < textToDisplay.length) {
            const currentChar = textToDisplay[index];
            beepRef.current = new Audio(currentChar === ' ' ? mediumBlip : (".!?".includes(currentChar) ? lowBlip : highBlip));
            beepRef.current.volume = 0.1;  // Adjust the volume as needed
            beepRef.current.play();

            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + currentChar);
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
    
    ;

    const formatDate = (epoch) => {
        const date = new Date(epoch * 1000);
        return `${date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}`;
    }

    const navigateToRoundDetail = (roundId) => {
        // Implementation for navigation
        console.log("Navigate to round:", roundId);
        // Replace console.log with actual navigation logic
    }

    return (
        <div className='course-list-container'>
            <div className="interactive-area2">
                <div className="text-bubble2">{displayedText}</div>
                <img 
                    src={isActive ? animatedGif : staticGif} 
                    alt="Cloud Caddi" 
                    className="cloud-gif2"
                    onClick={handleMascotClick}
                />
            </div>
            <div className="rounds-container">
                {myRounds.map(round => (
                    <div key={round.id} className="round-card" onClick={() => {
                        setTextToDisplay(`You selected a round from ${formatDate(round.date)}.`);
                        setDisplayedText("");
                        setIndex(0);
                        setIsActive(true);
                    }}>
                        <div className="round-info">
                            <h2>Date: {formatDate(round.date)}</h2>
                            <p>Total Score: {round.score}</p>
                            <p>Par: {round.par}</p>
                            <p>Wind: {round.windSpeed} mph {round.windDirection}°</p>
                            <p>Weather: {round.description}</p>
                        </div>
                        <button onClick={() => navigateToRoundDetail(round.id)} className="edit-view-button">
                            Edit/View
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

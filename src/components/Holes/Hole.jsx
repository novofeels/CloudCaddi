import { useEffect, useRef, useState } from "react";
import { getAllHoles } from "../../services/HoleService";
import { useParams } from "react-router-dom";
import { getAllCourses } from "../../services/CourseService";
import staticGif from '../../assets/staticGif.png'
import animatedGif from '../../assets/CloudCaddiInClubhouse.gif'
import lowBlip from '../../assets/LowBlip.mp3';
import mediumBlip from '../../assets/MediumBlip.mp3';
import highBlip from '../../assets/HighBlip.mp3';
import './Hole.css'
export const Hole = () => {
    const { courseId, holeNum } = useParams()
    const [holes, setHoles] = useState([]);
    const [thisHole, setThisHole] = useState({})
    const [courses, setCourses] = useState([])
    const [thisCourse, setThisCourse] = useState({})
    const [speechText, setSpeechText] = useState("Need a Tip?");
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);
    const [isMascotClicked, setIsMascotClicked] = useState(false);
    const [strokesTaken, setStrokesTaken] = useState(0)
    const lowBeepRef = useRef(new Audio(lowBlip));
    const mediumBeepRef = useRef(new Audio(mediumBlip));
    const highBeepRef = useRef(new Audio(highBlip))

    useEffect(() => {
        getAllCourses().then(courseObjs => setCourses(courseObjs))
        getAllHoles().then(holeObjs => setHoles(holeObjs));
    }, []);

    useEffect(() => {
const foundHole = holes.find(hole => hole.courseId === parseInt(courseId) && hole.holeNumber === parseInt(holeNum) )
setThisHole(foundHole)
const foundCourse = courses.find(course => course.id === parseInt(courseId))
setThisCourse(foundCourse)
    },[holes, holeNum, courseId, courses])

    useEffect(() => {
        if (isMascotClicked) {
            // Directly update speechText and reset other states as needed
            const newSpeechText = "If i had One I'd Give it to ya.";
            setSpeechText(newSpeechText);
            setDisplayedText("");  // Clear the display text immediately when text is set
            setIndex(0);  // Reset index to start the new speech
        }
    }, [isMascotClicked])
     // Add other dependencies if the text depends on them

     useEffect(() => {
        let timeout;
        if (index < speechText.length && displayedText !== speechText) {
            const nextChar = speechText.charAt(index);
            const delay = nextChar === ' ' ? 100 : nextChar === '.' ? 600 : 100; // Set delay based on character
    
            // Decide which sound to play based on the character
            if ("!?.".includes(nextChar)) {
                highBeepRef.current.play();
            } else if (nextChar === ' ') {
                mediumBeepRef.current.play();
            } else {
                lowBeepRef.current.play();
            }
    
            timeout = setTimeout(() => {
                setDisplayedText(prev => prev + nextChar);
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
            }, 10);  // Delay can be adjusted to ensure the gif plays a bit longer if needed
        }
    }, [index, speechText, isMascotClicked]);
    
    const handleClickMascot = () => {
        // Toggle isMascotClicked to trigger the useEffect
        setIsMascotClicked(prev => !prev);
        setDisplayedText("");
        setIndex(0)
    };

    const handleStrokesChange = (event) => {
        setStrokesTaken(event.target.value);
    };

    return (
        <div className="hole-info-container">
            <div className="course-title">{thisCourse?.name}</div>
            <div className="image-carousel-container">
                <img className="image-carousel" src={thisHole?.image} alt={`Hole view`} />
                <div className="charts-graphs">Charts and Graphs</div>
            </div>
            <div className="hole-details-and-mascot-container"> {/* Wrapper for stats and mascot */}
                <div className="hole-stats-container">
                    <div className="hole-detail">
                        <h2>Hole {thisHole?.holeNumber} - {thisHole?.distance} ft</h2>
                        <p>Par {thisHole?.par}</p>
                        <div className="input-group">
                        <input
                    className="input-stroke"
                    type="number"
                    placeholder="User input strokes"
                    value={strokesTaken}
                    onChange={handleStrokesChange}
                />
                            <button className="proceed-button">Input Score/Proceed to Next Hole</button>
                        </div>
                    </div>
                </div>
                <div className="mascot-container"> {/* New container for the mascot */}
                    <div className="mascot-speech-bubble">
                        <div className="mascot-text">{displayedText}</div>
                    </div>
                    <img
                    className="mascot"
                    src={isMascotClicked ? animatedGif : staticGif}
                    alt="Mascot"
                    onClick={handleClickMascot}
                />
                </div>
            </div>
            <div className="scorecard">
                {Array.from({ length: 18 }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                ))}
                {Array.from({ length: 18 }, (_, i) => (
                    <div key={i}>X</div> // Replace 'X' with actual data if available
                ))}
            </div>
        </div>
    );
    
};



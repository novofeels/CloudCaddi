import React, { useState, useEffect, useRef } from 'react';
import './NewRound.css';
import { getAllCourses } from "../../services/CourseService";
import lowBlip from '../../assets/LowBlip.mp3';
import mediumBlip from '../../assets/MediumBlip.mp3';
import highBlip from '../../assets/HighBlip.mp3';
import animatedGif from '../../assets/CloudCaddiInClubhouse.gif';
import staticGif from '../../assets/staticGif.png';
import CloudCaddiDriving from '../../assets/CloudCaddiDriving.png';
import { useNavigate } from 'react-router-dom';
export const NewRound = ({ currentUser }) => {
    const [allCourses, setAllCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [displayedText, setDisplayedText] = useState("Pick your poison");
    const [index, setIndex] = useState(0);
    const [isDriving, setIsDriving] = useState(false);
    const [textToDisplay, setTextToDisplay] = useState("Use the search bar to choose a course");

    const navigate = useNavigate()

    const beepRef = useRef(null);
    

    useEffect(() => {
        getAllCourses().then(setAllCourses);
    }, []);

    useEffect(() => {
        if (isActive && index < textToDisplay.length) {
            const currentChar = textToDisplay[index];
            beepRef.current = new Audio(currentChar === ' ' ? mediumBlip : (".!?".includes(currentChar) ? lowBlip : highBlip));
            beepRef.current.volume = 0.03;
            beepRef.current.play();
    
            // Handle new paragraph or newline
            if (textToDisplay.substring(index, index + 4) === '\\n\\n') {
                beepRef.current.play();
                const timer = setTimeout(() => {
                    setDisplayedText(prev => prev + '\n\n');
                    setIndex(index + 4); // Skip the '\\n\\n' characters
                }, 500);
                return () => clearTimeout(timer);
            }
    
            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + currentChar);
                setIndex(index + 1);
            }, currentChar === ' ' ? 150 : 50);
    
            return () => clearTimeout(timer);
        } else if (isActive && index === textToDisplay.length) {
            setIsActive(false);  // Stop the animation once the last character is displayed
        }
    }, [index, isActive, textToDisplay]);
    

    const handleSearchChange = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        if (value.trim()) {
            setFilteredCourses(allCourses.filter(course =>
                course.name.toLowerCase().includes(value)
            ));
        } else {
            setFilteredCourses([]);
        }
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setFilteredCourses([]);
        setSearchTerm(course.name);
     
        
        setTimeout(() => {
            setDisplayedText(""); // Clear existing text
            setTextToDisplay(`${course.name}?\\n\\nI'm gonna shower you with tips.`); // Include newline
            setIndex(0); // Reset index for new animation
            setIsActive(true); // Start animation
        }, 100); // Delay to ensure state updates
    };
    
    

    const handleStart = () => {
        setIsActive(true);
        setDisplayedText('');  // Clear the default text
        setIndex(0);  // Start from the beginning of the provided text
    };


    const handleStartRound = () => {
        setIsActive(true); // This will start the animation for "BUCKLE UP"
        setDisplayedText(""); // Clear the default text
        setTextToDisplay("I'LL DRIVE"); // Update the state to the new text that should be animated
        setIndex(0); // Reset the index to start the text animation from the beginning
    
        setTimeout(() => {
            setIsDriving(true); // Activate the mascot animation
            // Show the mascot and dim the background
            document.querySelector('.mascot-driving').style.display = 'block';
            document.querySelector('.dim-background').style.display = 'block';
    
            // After the animation, navigate to the scorecard page
            setTimeout(() => {
                navigate(`/ScoreCard/${selectedCourse.id}/1`);
            }, 4000); // This timeout should match the duration of the driveAcross animation
        }, 1250); // Adjust the delay time as needed
    };
    
    
    
    return (
        <div className='div-for-background'>
        <div className="interactive-area">
    <div className="text-bubble">{displayedText}</div>
    <img src={isActive ? animatedGif : staticGif}
         alt="Cloud Caddi"
         className={`cloud-gif ${isActive ? 'active' : 'inactive'}`}
         onClick={handleStart} />
</div>

            <div className="search-and-results">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                {filteredCourses.length > 0 && (
                    <div className="suggestions">
                        {filteredCourses.map(course => (
                            <div key={course.id} onClick={() => handleCourseSelect(course)} className="suggestion-item">
                                {course.name}
                            </div>
                        ))}
                    </div>
                )}
                {selectedCourse && (
                    <div className="course-details">
                        <h2>{selectedCourse.name}</h2>
                        <img src={selectedCourse.image} alt={selectedCourse.name} className="course-image" />
                        <p><strong>Number of Holes:</strong> {selectedCourse.numOfHoles}</p>
                        <p><strong>Par:</strong> {selectedCourse.par}</p>
                        <p><strong>Difficulty:</strong> {selectedCourse.difficulty}</p>
                        <button className="start-round-button" onClick={handleStartRound}>START ROUND</button>
                    </div>
                )}
            </div>
            <div className="dim-background"></div>
            <img src={CloudCaddiDriving} alt="Mascot Driving Golf Cart" className={`mascot-driving ${isDriving ? "start-driving" : ""}`} />

        </div>
        
    );
};

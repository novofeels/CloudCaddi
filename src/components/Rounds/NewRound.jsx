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
import { createNewScoreCard } from '../../services/ScoreCardService';
import { Button } from 'react-bootstrap';
export const NewRound = ({ currentUser }) => {
    const [allCourses, setAllCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [displayedText, setDisplayedText] = useState("Pick your poison");
    const [index, setIndex] = useState(0);
    const [isDriving, setIsDriving] = useState(false);
    const [textToDisplay, setTextToDisplay] = useState("Use the search bar to choose a course, or create one if you cant find it");
    const [datePlayed, setDatePlayed] = useState('');
    const [timePlayed, setTimePlayed] = useState('');  
    const [volume, setVolume] = useState(0.5)
    
    const navigate = useNavigate()

    const beepRef = useRef(null);
    

    useEffect(() => {
        getAllCourses().then(setAllCourses);
    }, []);

    useEffect(() => {
        if (isActive && index < textToDisplay.length) {
            const currentChar = textToDisplay[index];
            beepRef.current = new Audio(currentChar === ' ' ? mediumBlip : (".!?".includes(currentChar) ? lowBlip : highBlip));
            beepRef.current.volume = volume
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


    const handleStartRound = async () => {
        setIsActive(true); // This will start the animation for "BUCKLE UP"
        setDisplayedText(""); // Clear the default text
        setTextToDisplay("I'LL DRIVE"); // Update the state to the new text that should be animated
        setIndex(0); // Reset the index to start the text animation from the beginning
        const epochTime = getEpochTime(datePlayed, timePlayed);
       
        console.log(epochTime);  // Outputs the epoch time in milliseconds

        const apiKey = '76fe7ff7f7752481cc3fd866e54ae92b'
        const url = `https://history.openweathermap.org/data/2.5/history/city?lat=${selectedCourse.lat}&lon=${selectedCourse.long}&type=hour&start=${epochTime}&cnt=1&appid=${apiKey}&units=imperial`

        const response = await fetch(url);
        const data = await response.json()

        const weatherData = data.list[0]; // assuming 'list' array always contains at least one item

        const scoreCardToPost = {
            userId: currentUser.id,
            courseId: selectedCourse.id,
            par: selectedCourse.par,
            score: 0,
            date: epochTime,
            windSpeed: weatherData.wind.speed,
            windDirection: weatherData.wind.deg,
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            pressure: weatherData.main.pressure,
            description: weatherData.weather[0].description // assuming 'weather' array is not empty
        }

        const response2 = await createNewScoreCard(scoreCardToPost)
        const response2json = await response2.json()

         const scoreCardId = parseInt(response2json.id)
         console.log(scoreCardId)
   
        setTimeout(() => {
            setIsDriving(true); // Activate the mascot animation
            // Show the mascot and dim the background
            document.querySelector('.mascot-driving').style.display = 'block';
            document.querySelector('.dim-background').style.display = 'block';
    
            // After the animation, navigate to the scorecard page
            setTimeout(() => {
                navigate(`/scoreCard/${scoreCardId}/${selectedCourse.id}/1`);
            }, 4000); // This timeout should match the duration of the driveAcross animation
        }, 1250); // Adjust the delay time as needed
    };

    const getEpochTime = (date, time) => {
        // Combine date and time into a full datetime string, assuming it's local Central Time
        const dateTimeString = `${date}T${time}:00`;
    
        // Create a Date object assuming the string is in Central Time
        // Note: JavaScript Date assumes the string without timezone to be UTC, so we append the timezone offset
        // Adjust for daylight saving if necessary. Here, assuming UTC-5 as an example.
        const localDate = new Date(`${dateTimeString}-05:00`);
    
        // Get the Unix timestamp in milliseconds
        const epochTime = localDate.getTime();
    
        return epochTime / 1000; // Convert to seconds from milliseconds
    };
    
    
    // Example usage

    const handleCreateCourse = () => {
        navigate(`/CourseCreate`)
    }
    
    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
         // Adjust volume of the current audio element
    }
    
    
    return (
        <div className='div-for-background69'>
            <div className="interactive-area">
            <input className='slider' type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => handleVolumeChange(e.target.value)} />
                <div className="text-bubble">{displayedText}</div>
                <img src={isActive ? animatedGif : staticGif}
                    alt="Cloud Caddi"
                    className={`cloud-gif ${isActive ? 'active' : 'inactive'}`}
                    onClick={handleStart} />
                

            </div>
    
            <div className="search-and-results">
                <div className='container-for-input-and-button'>
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
<button className="create-course-button" onClick={handleCreateCourse}>Create New Course</button>
                </div>
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
    
                        {/* Date picker */}
                        <div className="date-picker">
                            <label htmlFor="datePlayed">Date Played:</label>
                            <input
                                type="date"
                                id="datePlayed"
                                value={datePlayed}
                                onChange={e => setDatePlayed(e.target.value)}
                                className="date-input"
                            />
                        </div>
    
                        {/* Time picker */}
                        <div className="time-picker">
                            <label htmlFor="timePlayed">Time Played:</label>
                            <input
                                type="time"
                                id="timePlayed"
                                value={timePlayed}
                                onChange={e => setTimePlayed(e.target.value)}
                                className="time-input"
                            />
                        </div>
                        <button className="start-round-button" onClick={handleStartRound}>START ROUND</button>
                        
                    </div>

                )}
                 
            </div>
            <div className="dim-background"></div>
            <img src={CloudCaddiDriving} alt="Mascot Driving Golf Cart" className={`mascot-driving ${isDriving ? "start-driving" : ""}`} />
        </div>
    ); // Ensure this is a parenthesis to close the return
    
};


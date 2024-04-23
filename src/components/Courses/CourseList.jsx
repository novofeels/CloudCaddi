import { useEffect, useState, useRef } from "react";
import { getAllCourses } from "../../services/CourseService";
import staticGif from '../../assets/staticGif.png';
import animatedGif from '../../assets/CloudCaddiInClubhouse.gif';
import lowBlip from '../../assets/LowBlip.mp3';
import mediumBlip from '../../assets/MediumBlip.mp3';
import highBlip from '../../assets/HighBlip.mp3';
import { useNavigate } from "react-router-dom";
import './CourseList.css'
export const CourseList = () => {
    const navigate = useNavigate()
    const [allCourses, setAllCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [filter, setFilter] = useState("all"); // 'easy', 'moderate', 'difficult', or 'all'
    const [isActive, setIsActive] = useState(false);
    const [displayedText, setDisplayedText] = useState("");
    const [textToDisplay, setTextToDisplay] = useState("Choose a course to see details or select a difficulty level to filter courses.");
    const [index, setIndex] = useState(0);
    const beepRef = useRef(null);

    useEffect(() => {
        getAllCourses().then(courses => {
            setAllCourses(courses);
            setFilteredCourses(courses);
        });
    }, []);

    useEffect(() => {
        if (isActive && index < textToDisplay.length) {
            const currentChar = textToDisplay[index];
            beepRef.current = new Audio(currentChar === ' ' ? mediumBlip : (".!?".includes(currentChar) ? lowBlip : highBlip));
            beepRef.current.play();
            beepRef.current.volume = 0.03

            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + currentChar);
                setIndex(index + 1);
            }, 100);

            return () => clearTimeout(timer);
        } else if (isActive && index === textToDisplay.length) {
            setIsActive(false);
        }
    }, [index, isActive, textToDisplay]);

    const handleFilterChange = (difficulty) => {
        setFilter(difficulty);
        setTextToDisplay(`Heres all the ${difficulty} ones.`);
        setDisplayedText("");
        setIndex(0);
        setIsActive(true);
        const newFilteredCourses = difficulty === 'all' ? allCourses : allCourses.filter(course => course.difficulty === difficulty);
        setFilteredCourses(newFilteredCourses);
    };

    const handleCourseClick = (course) => {
        setTextToDisplay(`You selected ${course.name}, which is a ${course.difficulty} course.`);
        setDisplayedText("");
        setIndex(0);
        setIsActive(true);
    };

    const handleNavigate = (courseId) => {
        navigate(`/CourseList/${courseId}`);
    }

    return (
        <div className='course-list-container'>
            <div className="interactive-area">
                <div className="text-bubble">{displayedText}</div>
                <img src={animatedGif} alt="Cloud Caddi" className="cloud-gif" />
            </div>
            <div className="filters-and-cards">
                <div className="filters">
                    {['all', 'easy', 'moderate', 'difficult'].map(difficulty => (
                        <button key={difficulty} onClick={() => handleFilterChange(difficulty)}>{difficulty}</button>
                    ))}
                </div>
                <div className="course-cards">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="course-card" onClick={() => handleCourseClick(course)}>
                            <img src={course.image || staticGif} alt={course.name} className="course-image" />
                            <div className="course-info">
                                <h2>{course.name}</h2>
                                <p>Difficulty: {course.difficulty}</p>
                                <p>Par: {course.par}</p>
                                <p>Number of Holes: {course.numOfHoles}</p>
                                <button onClick={() => handleCourseClick(course)} className="view-edit-button">
                                    Edit/View Course
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    
};

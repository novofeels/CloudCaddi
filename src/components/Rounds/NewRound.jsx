import React, { useEffect, useState } from "react";
import { getAllCourses } from "../../services/CourseService";
import "./NewRound.css"; // Ensure you have this CSS file in your project

export const NewRound = ({ currentUser }) => {
    const [allCourses, setAllCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getAllCourses().then(setAllCourses);
    }, []);

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
    };

    return (
        <div className="new-round-container">
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
                </div>
            )}
        </div>
    );
};

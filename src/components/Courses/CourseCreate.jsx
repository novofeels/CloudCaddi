import { useState, useEffect, useRef } from 'react';
import { CreateCourse } from '../../services/CourseService';
import { useNavigate } from 'react-router-dom';
import './CourseCreate.css'
// Define initMap globally
window.initMap = () => {
  // This function can be left empty or used to handle map initialization
};

export const CourseCreate = () => {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); // Track whether the map script has loaded
  const [searchQuery, setSearchQuery] = useState('');
  const [courseName, setCourseName] = useState('');
  const [numHoles, setNumHoles] = useState('');
  const [parForCourse, setPar] = useState('');
  const [difficultyForCourse, setDifficulty] = useState('');
  const markerRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    // Dynamically load Google Maps API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB2b8XSCoyQiH4QQtHkLmmVVCUh65-aE80&libraries=places,geometry&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Add event listener to check when the script has finished loading
    script.addEventListener('load', () => {
      setMapLoaded(true);
    });

    document.body.appendChild(script);

    // Clean up: Remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      // Initialize the map
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 36.16273884933904, lng: -86.77714642744345 },
        zoom: 4,
      });

      // Add click event listener to the map
      map.addListener('click', (event) => {
        // Retrieve latitude and longitude of clicked location
        const { latLng } = event;
        const latitude = latLng.lat();
        const longitude = latLng.lng();

        // Store clicked location in state
        setClickedLocation({ latitude, longitude });

        // Remove previous marker, if any
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        // Create a new marker at the clicked location
        const newMarker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          title: 'Clicked Location',
        });

        // Store the new marker in the ref
        markerRef.current = newMarker;
      });

      // Create search box and link it to the UI element
      const input = document.getElementById('searchInput');
      const searchBox = new window.google.maps.places.SearchBox(input);

      // Listen for the event triggered when the user selects a prediction and retrieve more details for that place
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }

        // Get the first place
        const place = places[0];

        // Pan to the selected place and zoom in
        map.setCenter(place.geometry.location);
        map.setZoom(15);

        // Store the selected location in state
        setClickedLocation({
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        });

        // Remove previous marker, if any
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        // Create a new marker at the selected location
        const newMarker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: 'Selected Location',
        });

        // Store the new marker in the ref
        markerRef.current = newMarker;
      });
    }
  }, [mapLoaded]);

  const handleCourseCreate = async () => {
   if (courseName && clickedLocation && numHoles && parForCourse && difficultyForCourse){
    const courseToPost = {
        name: courseName,
        lat: clickedLocation.latitude,
        long: clickedLocation.longitude,
        numOfHoles: numHoles,
        par: parForCourse,
        difficulty: difficultyForCourse
    }
    
    CreateCourse(courseToPost).then(response => response.json())
    .then(data => {
      const courseId = data.id;
      navigate(`/CourseCreate/${courseId}/1`);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
  
  } else {
        window.alert("choose your shit")
    }
  }

  return (
    <div>
      <div className="course-title">CREATE COURSE</div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {mapLoaded && (
          <div style={{ position: 'relative', width: '50%' }}>
            <div style={{ margin: '15px', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
              <input
                id="searchInput"
                type="text"
                placeholder="Search for a location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '300px', padding: '10px', marginRight: '20px' }}
              />
            </div>
            <div id="map" style={{ width: '90%', height: '400px', margin: '75px 30px' }}></div>
          </div>
        )}
        <div style={{ width: '50%', marginLeft: '20px' }}>
          <h2>Course Details</h2>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="courseName">Name Of Course:</label>
            <input id="courseName" type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="numHoles">Number of Holes:</label>
            <input id="numHoles" type="number" value={numHoles} onChange={(e) => setNumHoles(e.target.value)} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="par">Par For Course:</label>
            <input id="par" type="number" value={parForCourse} onChange={(e) => setPar(e.target.value)} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="difficulty">Difficulty:</label>
            <select id="difficulty" value={difficultyForCourse} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">Select</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="difficult">Difficult</option>
            </select>
          </div>
          {clickedLocation && (
            <div>
              <h2>Selected Location:</h2>
              <p>Latitude: {clickedLocation.latitude}</p>
              <p>Longitude: {clickedLocation.longitude}</p>
            </div>
          )}
          <button onClick={handleCourseCreate} style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Create Course
          </button>
        </div>
      </div>
    </div>
  );
  
};

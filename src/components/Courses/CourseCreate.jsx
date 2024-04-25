import { useState, useEffect, useRef } from 'react';
import { CreateCourse } from '../../services/CourseService';
import { useNavigate } from 'react-router-dom';
import './CourseCreate.css'
import staticGif from '../../assets/staticGif.png'
import animatedGif from '../../assets/CloudCaddiInClubhouse.gif'
import lowBlip from '../../assets/LowBlip.mp3';
import mediumBlip from '../../assets/MediumBlip.mp3';
import highBlip from '../../assets/HighBlip.mp3';
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
  const [fileURL, setFileURL] = useState(null)
  const [textToShow, setTextToShow] = useState('');
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isMascotAnimated, setIsMascotAnimated] = useState(false);

  const lowBlipSound = new Audio(lowBlip);
  const mediumBlipSound = new Audio(mediumBlip);
  const highBlipSound = new Audio(highBlip);
  const markerRef = useRef(null);
  const fileInputRef = useRef(null)
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
      handleTextRendering();
      const mapOptions = {
        center: { lat:  38.949180578340034, lng: -96.16359051924033 },
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true,  // Disable default controls
        styles: [  // Customize the map's appearance
          {
            featureType: "poi",  // Points of interest
            elementType: "labels",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "transit",  // All transit stations and lines
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "road",  // All roads
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ visibility: "off" }]
          }
        ]
      };
  
      const map = new window.google.maps.Map(document.getElementById('map'), mapOptions)

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

    
      // Adjust horizontal scroll by a certain number of pixels
      // This example assumes you want to scroll the window 100 pixels to the right
     
   
  }, [mapLoaded]);

  const handleCourseCreate = async () => {
   if (courseName && clickedLocation && numHoles && parForCourse && difficultyForCourse){
    const courseToPost = {
        name: courseName,
        lat: clickedLocation.latitude,
        long: clickedLocation.longitude,
        numOfHoles: parseInt(numHoles),
        par: parseInt(parForCourse),
        difficulty: difficultyForCourse,
        image: fileURL
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

  const handleImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
        console.log("No file selected or file access error.");
        return;  // Return early if no files are selected
    }

    const selectedFile = e.target.files[0];
    if (selectedFile) {
        const reader = new FileReader();

        reader.onload = (event) => {
            setFileURL(event.target.result);  // Set the file URL to the loaded data URL of the file
        };

        reader.onerror = (error) => {
            console.error('Error reading file:', error);
        };

        reader.readAsDataURL(selectedFile);
    } else {
        console.log("Failed to load file because the file is undefined.");
    }
};

const handleMascotClick = () => {
  setIsMascotAnimated(true); // Start the animation
  handleTextRendering(); // Start displaying text in the speech bubble
};

const handleTextRendering = () => {
  // Ensure this message is properly defined
  setDisplayText('');
  const initialMessage = "SShow me on this old map where this uncharted course is.";
  setTextToShow(initialMessage);
  
  setCurrentCharacterIndex(0);

  const timer = setInterval(() => {
    setCurrentCharacterIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      // Ensure newIndex does not exceed the message length
      if (newIndex >= textToShow.length) {
        clearInterval(timer); // Stop when all characters are displayed
        return prevIndex;
      }

      // Play a sound effect with each character
      playSoundEffect(newIndex);

      // Append next character to the display text
      setDisplayText((prevDisplayText) => prevDisplayText + textToShow[newIndex]);
      return newIndex;
    });
  }, 100); // Adjust the speed as necessary
};

// Function to play sound based on the character index
const playSoundEffect = (index) => {
  if (index % 2 === 0) lowBlipSound.play();
  else if (index % 3 === 0) mediumBlipSound.play();
  else highBlipSound.play();
};


 return (
    <div className='div-for-background2'>
      <div className="course-title">CREATE COURSE</div>
      <div className="course-creation-container">
        {mapLoaded && (
          <div className="map-container">
            <div className="search-box">
              <input
                id="searchInput"
                className="search-input"
                type="text"
                placeholder="Search for a location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='frame'>
            <div id="map" className="map-display"></div>
            </div>
          </div>
        )}
        <div className="details-section">
          <h2>Course Details</h2>
          <div className="field-group">
            <label htmlFor="courseName" className='label'>Name Of Course:</label>
            <input id="courseName" type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
          </div>
          <div className="field-group">
            <label htmlFor="numHoles" className='label'>Number of Holes:</label>
            <input id="numHoles" type="number" value={numHoles} onChange={(e) => setNumHoles(e.target.value)} />
          </div>
          <div className="field-group">
            <label htmlFor="par" className='label'>Par For Course:</label>
            <input id="par" type="number" value={parForCourse} onChange={(e) => setPar(e.target.value)} />
          </div>
          <div className="field-group">
            <label htmlFor="difficulty" className='label'>Difficulty:</label>
            <select id="difficulty" value={difficultyForCourse} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">Select</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="difficult">Difficult</option>
            </select>
          </div>
          {clickedLocation && (
            <div className="selected-location">
              <h2>Selected Location:</h2>
              <p>Latitude: {clickedLocation.latitude}</p>
              <p>Longitude: {clickedLocation.longitude}</p>
              <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="custom-file-upload">
    Upload Image
</button>
<input type="file" ref={fileInputRef} name="image" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />

        {fileURL && <img src={fileURL} alt="Selected" style={{ maxWidth: "100px", marginTop: '10px' }} />}
            </div>
          )}

          <button onClick={handleCourseCreate} className="create-button">
            Create Course
          </button>
     
        </div>

      </div>
      <div className="mascot-container">
      
      <div className="speech-bubble">{displayText}</div>
      <img
  className='mascot-gif'
  src={isMascotAnimated ? animatedGif : staticGif}
  alt="Mascot"
  onClick={handleMascotClick}
/>
    </div>
    </div>
  );
};

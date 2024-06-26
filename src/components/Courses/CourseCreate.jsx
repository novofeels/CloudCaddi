import { useState, useEffect, useRef } from "react";
import { CreateCourse } from "../../services/CourseService";
import { useNavigate } from "react-router-dom";
import "./CourseCreate.css";
import staticGif from "../../assets/staticGif.gif";
import animatedGif from "../../assets/CloudCaddiInClubhouse.gif";
import lowBlip from "../../assets/LowBlip.mp3";
import mediumBlip from "../../assets/MediumBlip.mp3";
import highBlip from "../../assets/HighBlip.mp3";
// Define initMap globally
window.initMap = () => {
  // This function can be left empty or used to handle map initialization
};

export const CourseCreate = () => {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); // Track whether the map script has loaded
  const [searchQuery, setSearchQuery] = useState("");
  const [courseName, setCourseName] = useState("");
  const [numHoles, setNumHoles] = useState("");
  const [parForCourse, setPar] = useState("");
  const [difficultyForCourse, setDifficulty] = useState("");
  const [fileURL, setFileURL] = useState(null);
  const [textToShow, setTextToShow] = useState("");
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isMascotAnimated, setIsMascotAnimated] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const lowBlipSound = new Audio(lowBlip);
  const mediumBlipSound = new Audio(mediumBlip);
  const highBlipSound = new Audio(highBlip);
  const markerRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Dynamically load Google Maps API script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB2b8XSCoyQiH4QQtHkLmmVVCUh65-aE80&libraries=places,geometry&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Add event listener to check when the script has finished loading
    script.addEventListener("load", () => {
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
        center: { lat: 38.949180578340034, lng: -96.16359051924033 },
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "road",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ visibility: "off" }],
          },
        ],
      };

      const map = new window.google.maps.Map(
        document.getElementById("map"),
        mapOptions
      );

      map.addListener("click", (event) => {
        const { latLng } = event;
        const latitude = latLng.lat();
        const longitude = latLng.lng();

        setClickedLocation({ latitude, longitude });

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        const newMarker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          title: "Clicked Location",
        });

        markerRef.current = newMarker;
        setDetailsVisible(true); // Show the details section when a pin is dropped
      });

      const input = document.getElementById("searchInput");
      const searchBox = new window.google.maps.places.SearchBox(input);

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) {
          return;
        }

        const place = places[0];
        map.setCenter(place.geometry.location);
        map.setZoom(15);

        setClickedLocation({
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        });

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        const newMarker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: "Selected Location",
        });

        markerRef.current = newMarker;
        setDetailsVisible(true); // Show the details section when a pin is dropped
      });
    }
  }, [mapLoaded]);

  const handleCourseCreate = async () => {
    if (
      courseName &&
      clickedLocation &&
      numHoles &&
      parForCourse &&
      difficultyForCourse
    ) {
      const courseToPost = {
        name: courseName,
        lat: clickedLocation.latitude,
        long: clickedLocation.longitude,
        numOfHoles: parseInt(numHoles),
        par: parseInt(parForCourse),
        difficulty: difficultyForCourse,
        image: fileURL,
      };

      CreateCourse(courseToPost)
        .then((response) => response.json())
        .then((data) => {
          const courseId = data.id;
          navigate(`/CourseCreate/${courseId}/1`);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      window.alert("choose your shit");
    }
  };

  const handleImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.log("No file selected or file access error.");
      return; // Return early if no files are selected
    }

    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setFileURL(event.target.result); // Set the file URL to the loaded data URL of the file
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
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
    setDisplayText("");
    const initialMessage =
      "MMuch better, Now show me on this old map where this uncharted course is.";
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
        setDisplayText(
          (prevDisplayText) => prevDisplayText + textToShow[newIndex]
        );
        return newIndex;
      });
    }, 100); // Adjust the speed as necessary
  };

  // Function to play sound based on the character index
  const playSoundEffect = (index) => {
    if (index % 3 === 0) highBlipSound.play();
    else mediumBlipSound.play();
  };

  return (
    <div className="div-for-background2">
      <div className="course-title">CREATE COURSE</div>
      <div className="course-creation-container">
        {mapLoaded && (
          <div className="map-container">
            <div className="search-box">
              <input
                id="searchInput"
                className="search-input69"
                type="text"
                placeholder="Search for a location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="frame">
              <div id="map" className="map-display"></div>
            </div>
          </div>
        )}
        <div
          className={`details-section ${detailsVisible ? "crtOn" : "hidden"}`}
        >
          <h2 className="ohYEAHHH2">Course Details</h2>
          <div className="field-group">
            <label htmlFor="courseName" className="label">
              Name Of Course:
            </label>
            <input
              className="inputDetails"
              id="courseName"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label htmlFor="numHoles" className="label">
              Number of Holes:
            </label>
            <input
              className="inputDetails"
              id="numHoles"
              type="number"
              value={numHoles}
              onChange={(e) => setNumHoles(e.target.value)}
            />
          </div>
          <div className="bigDivCC">
            <div className="field-group">
              <label htmlFor="par" className="label">
                Par For Course:
              </label>
              <input
                className="inputDetails"
                id="par"
                type="number"
                value={parForCourse}
                onChange={(e) => setPar(e.target.value)}
              />

              <label htmlFor="difficulty" className="label">
                Difficulty:
              </label>
              <select
                className="inputDetails"
                id="difficulty"
                value={difficultyForCourse}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">Select</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="difficult">Difficult</option>
              </select>
              {clickedLocation && (
                <div className="selected-location">
                  <h2>Selected Location:</h2>
                  <p className="ohYa">Latitude: {clickedLocation.latitude}</p>
                  <p className="ohYa">Longitude: {clickedLocation.longitude}</p>
                </div>
              )}
            </div>
            <div className="upload-column">
              {" "}
              {fileURL && (
                <img src={fileURL} alt="Selected" className="okbud" />
              )}
              <button
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
                className="custom-file-upload"
              >
                Upload Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <button onClick={handleCourseCreate} className="create-button">
            Create Course
          </button>
        </div>
      </div>
      <div className="mascot-container66">
        {displayText ? (
          <div className="speech-bubble66">{displayText}</div>
        ) : (
          <div className="speech-bubble66">who turned out the lights?</div>
        )}

        <img
          className="mascot-gif66"
          src={isMascotAnimated ? animatedGif : staticGif}
          alt="Mascot"
          onClick={handleMascotClick}
        />
      </div>
    </div>
  );
};

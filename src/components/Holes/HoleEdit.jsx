import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  EditHole,
  createHole,
  createHolyHoleDescriptions,
  deleteHolyHoleDescriptionsById,
  getAllHoleDescriptions,
  getHoleByIdWithEmbed,
  getHolyHoleDescriptionsByHoleId,
} from "../../services/HoleService";
import "./HoleEdit.css"; // Import the CSS file
import { getCourseById } from "../../services/CourseService";

export const HoleEdit = () => {
  const { courseId, holeId } = useParams();
  const navigate = useNavigate();
  const [holeDescriptions, setHoleDescriptions] = useState([]);
  const [par, setPar] = useState("");
  const [distance, setDistance] = useState("");
  const [selectedDescriptions, setSelectedDescriptions] = useState([]);
  const [thisHole, setThisHole] = useState();
  const [fileURL, setFileURL] = useState(null);
  const [thisCourse, setThisCourse] = useState({});
  const [descriptionsForDelete, setDescriptionsForDelete] = useState([]);
  const [animate, setAnimate] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getHolyHoleDescriptionsByHoleId(parseInt(holeId)).then((descObjs) =>
      setDescriptionsForDelete(descObjs)
    );
    getHoleByIdWithEmbed(parseInt(holeId)).then((holeObj) =>
      setThisHole(holeObj)
    );
    getAllHoleDescriptions().then(setHoleDescriptions);
    getCourseById(parseInt(courseId)).then((courseObj) =>
      setThisCourse(courseObj)
    );
  }, [courseId, holeId]);

  useEffect(() => {
    if (thisCourse && thisHole) {
      setPar(thisHole.par);
      setDistance(thisHole.distance);
      setFileURL(thisHole.image);
      const descriptionIds = thisHole.holyHoleDescriptions.map(
        (desc) => desc.holeDescriptionId
      );
      setSelectedDescriptions(descriptionIds);
    }
  }, [thisCourse, thisHole]);

  const handleHoleEdit = async () => {
    try {
      descriptionsForDelete.map((desc) =>
        deleteHolyHoleDescriptionsById(desc.id)
      );
      const holeData = {
        courseId: parseInt(courseId),
        holeNumber: thisHole.holeNumber,
        par: parseInt(par),
        distance: parseInt(distance),
        image: fileURL,
      };

      await EditHole(holeData, thisHole.id);

      await Promise.all(
        selectedDescriptions.map((descriptionId) =>
          createHolyHoleDescriptions({
            holeId: thisHole.id, // Assuming thisHole.id is the ID of the hole
            holeDescriptionId: descriptionId,
          })
        )
      );

      // Reset states
      setPar("");
      setDistance("");
      setSelectedDescriptions([]);

      setFileURL(null);
      setAnimate(true);

      // Set a timer to navigate after the animation completes
      setTimeout(() => {
        navigate(`/CourseDetails/${parseInt(courseId)}`);
      }, 1000); // Assuming the animation duration is 1 second
    } catch (error) {
      console.error("Error creating hole:", error);
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

  const handleDescriptionClick = (descriptionId) => {
    const index = selectedDescriptions.indexOf(descriptionId);
    if (index === -1) {
      setSelectedDescriptions([...selectedDescriptions, descriptionId]);
    } else {
      const updatedDescriptions = [...selectedDescriptions];
      updatedDescriptions.splice(index, 1);
      setSelectedDescriptions(updatedDescriptions);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (thisCourse && thisHole) {
    console.log(thisCourse);
    return (
      <div className="create-hole-container2" key={holeId}>
        <div className={`form-section3 ${animate ? "shoot-off" : ""}`}>
          <h2 className="centerThis2">{thisCourse.name}</h2>
          <h2 className="centerThis">Hole {thisHole.holeNumber}</h2>
          <div className="form-field">
            <label className="parLabel">Par:</label>
            <input
              className="createHoleInput parInputField"
              type="number"
              value={par}
              onChange={(e) => setPar(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Distance:</label>
            <input
              className="createHoleInput"
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
          </div>
          <h3>Select Hole Descriptions:</h3>
          <div className="newBigDiv">
            <div className="smallDiv1">
              {holeDescriptions.map((description) => (
                <div key={description.id} className="description-item">
                  <input
                    className="createHoleInput"
                    type="checkbox"
                    checked={selectedDescriptions.includes(description.id)}
                    onChange={() => handleDescriptionClick(description.id)}
                    style={{ marginRight: "5px" }}
                  />
                  <label>{description.description}</label>
                </div>
              ))}
            </div>
            <div classname="smallDiv2">
              <div className="image-section image-container">
                <label>Image:</label>
                <div>
                  <button
                    type="button"
                    className="button image-upload-button"
                    onClick={triggerFileInput}
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
                {fileURL && (
                  <img
                    src={fileURL}
                    alt="Selected"
                    style={{ maxWidth: "175px" }}
                  />
                )}
              </div>
            </div>
          </div>
          <button className="button" onClick={() => handleHoleEdit()}>
            EDIT HOLE
          </button>
        </div>
      </div>
    );
  }
};
